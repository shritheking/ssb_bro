import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, Mic, MicOff, Video, VideoOff, 
  Share2, Users, MessageSquare, Hand, X, Send, 
  Smile, LayoutGrid, Maximize, Minimize, Check, 
  ChevronDown, UserCheck, Monitor, Disc, Pause, 
  Play, Copy, Link as LinkIcon, Download, Clock, 
  FileText, Sparkles, ExternalLink, HelpCircle,
  Volume2, Settings, Target, Award, AlertCircle
} from 'lucide-react';
import { saveSessionRecording } from '../../lib/supabase';

interface FloatingReaction {
  id: number;
  emoji: string;
  left: number;
  delay: number;
}

export const ZoomMeetingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rawCode = searchParams.get('code');
  const meetingCode = rawCode ? rawCode.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3') : '842 1900 3328';
  const passcode = searchParams.get('passcode') || 'SSB2026';
  const topic = searchParams.get('topic') || 'SSB Psychology & Diagnostic Debrief';
  const mentor = searchParams.get('mentor') || 'Lt. Vamshi E.';
  const candidateName = searchParams.get('name') || 'Arjun Sharma';

  // ── HARDWARE & WEBCAM MEDIA STATES ──
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100 real mic volume
  const userMediaStreamRef = useRef<MediaStream | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const userGalleryVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // ── VIEW & NAVIGATION ──
  const [viewMode, setViewMode] = useState<'speaker' | 'gallery'>('speaker');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSideDrawer, setActiveSideDrawer] = useState<'none' | 'chat' | 'participants' | 'drills'>('none');
  const [showReactionsTray, setShowReactionsTray] = useState(false);

  // ── FLOATING REACTIONS ──
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const reactionTimerRef = useRef<number | null>(null);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const reactionCounterRef = useRef(0);

  // ── REAL SCREEN SHARE ──
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [screenShareType, setScreenShareType] = useState<'browser' | 'tat' | 'wat' | 'piq'>('browser');

  // ── REAL MEDIARECORDER RECORDING ──
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [recordingSavedModal, setRecordingSavedModal] = useState(false);
  const [savedRecordSummary, setSavedRecordSummary] = useState<{ duration: string; timestamp: string } | null>(null);

  // ── INVITE MODAL ──
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ── TACTICAL ASSESSMENT DRILL STATES ──
  const [activeDrillTab, setActiveDrillTab] = useState<'tat' | 'wat' | 'piq'>('tat');
  const [tatTimer, setTatTimer] = useState(30);
  const [tatPhase, setTatPhase] = useState<'observe' | 'write'>('observe');
  const [candidateTatStory, setCandidateTatStory] = useState('');
  const [watIndex, setWatIndex] = useState(0);
  const [watTimer, setWatTimer] = useState(15);
  const [candidateWatSentence, setCandidateWatSentence] = useState('');
  const [savedWatResponses, setSavedWatResponses] = useState<Array<{ word: string; sentence: string }>>([]);

  const watList = ['LEADERSHIP', 'OBSTACLE', 'COURAGE', 'INITIATIVE', 'INTEGRITY', 'SACRIFICE', 'RESPONSIBILITY'];

  // ── CHAT MESSAGES ──
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; isMe: boolean; chest?: string }>>([
    { sender: mentor, text: `Welcome ${candidateName}. Audio and encrypted video uplink established. Let me know when you are ready for the psychological battery review.`, time: '18:01', isMe: false, chest: 'Chest 50' },
    { sender: 'Priya Nair', text: 'Good evening Sir. Audio is clear on my end.', time: '18:02', isMe: false, chest: 'Chest 09' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // ──────────────────────────────────────────────────────────
  // 1. INITIALIZE REAL WEBCAM & AUDIO ANALYSER
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);

    const initWebcam = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true
          });
          userMediaStreamRef.current = stream;

          // Attach to video elements
          if (userVideoRef.current) userVideoRef.current.srcObject = stream;
          if (userGalleryVideoRef.current) userGalleryVideoRef.current.srcObject = stream;

          // Setup real mic audio level analyser
          try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
              const audioCtx = new AudioContextClass();
              audioContextRef.current = audioCtx;
              const source = audioCtx.createMediaStreamSource(stream);
              const analyser = audioCtx.createAnalyser();
              analyser.fftSize = 64;
              source.connect(analyser);
              analyserRef.current = analyser;

              const dataArray = new Uint8Array(analyser.frequencyBinCount);
              const updateAudioLevel = () => {
                if (analyserRef.current && !isMuted) {
                  analyserRef.current.getByteFrequencyData(dataArray);
                  let sum = 0;
                  for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i];
                  }
                  const avg = sum / dataArray.length;
                  setAudioLevel(Math.min(100, Math.round(avg * 1.5)));
                } else {
                  setAudioLevel(0);
                }
                animFrameRef.current = requestAnimationFrame(updateAudioLevel);
              };
              updateAudioLevel();
            }
          } catch (audioErr) {
            console.warn('Audio analyser fallback:', audioErr);
          }
        }
      } catch (err) {
        console.warn('Webcam permission not granted or device not found; using aspirant avatar mode:', err);
      }
    };

    initWebcam();

    // Listen for fullscreen change
    const handleFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreen);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      if (userMediaStreamRef.current) {
        userMediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Sync webcam stream to video element when view toggles
  useEffect(() => {
    if (userMediaStreamRef.current) {
      if (userVideoRef.current) userVideoRef.current.srcObject = userMediaStreamRef.current;
      if (userGalleryVideoRef.current) userGalleryVideoRef.current.srcObject = userMediaStreamRef.current;
    }
  }, [viewMode, isVideoOff]);

  // Sync screen share video
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream, isSharingScreen]);

  // ──────────────────────────────────────────────────────────
  // 2. HARDWARE TOGGLE CONTROLS (MIC & VIDEO)
  // ──────────────────────────────────────────────────────────
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (userMediaStreamRef.current) {
      userMediaStreamRef.current.getAudioTracks().forEach(t => {
        t.enabled = !nextMuted;
      });
    }
  };

  const toggleVideo = () => {
    const nextVideoOff = !isVideoOff;
    setIsVideoOff(nextVideoOff);
    if (userMediaStreamRef.current) {
      userMediaStreamRef.current.getVideoTracks().forEach(t => {
        t.enabled = !nextVideoOff;
      });
    }
  };

  // Fullscreen Handler
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle unavailable:', err);
    }
  };

  // ──────────────────────────────────────────────────────────
  // 3. REAL SCREEN SHARING CONTROLS
  // ──────────────────────────────────────────────────────────
  const startRealScreenShare = async () => {
    setShowShareModal(false);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        setScreenStream(stream);
        setIsSharingScreen(true);
        setScreenShareType('browser');

        const track = stream.getVideoTracks()[0];
        if (track) {
          track.onended = () => stopScreenShare();
        }
      } else {
        startSimulatedDrill('tat');
      }
    } catch (err) {
      console.warn('Screen share dismissed or not supported:', err);
    }
  };

  const startSimulatedDrill = (type: 'tat' | 'wat' | 'piq') => {
    setShowShareModal(false);
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
    setScreenShareType(type);
    setIsSharingScreen(true);
    setActiveDrillTab(type);
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
    setIsSharingScreen(false);
  };

  // ──────────────────────────────────────────────────────────
  // 4. REAL VIDEO & AUDIO MEDIARECORDER
  // ──────────────────────────────────────────────────────────
  const toggleRecording = async () => {
    if (!isRecording) {
      // Start Real Media Recording
      recordedChunksRef.current = [];
      try {
        let recordStream: MediaStream | null = null;

        // Combine user stream or screen stream
        if (screenStream) {
          recordStream = screenStream;
        } else if (userMediaStreamRef.current) {
          recordStream = userMediaStreamRef.current;
        } else {
          // If no media device, capture canvas
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#10141D';
            ctx.fillRect(0, 0, 640, 360);
            ctx.fillStyle = '#E6B980';
            ctx.font = '20px sans-serif';
            ctx.fillText('SSB BRO Live Mentorship Session', 40, 180);
          }
          recordStream = (canvas as any).captureStream ? (canvas as any).captureStream(15) : null;
        }

        if (recordStream && typeof MediaRecorder !== 'undefined') {
          const recorder = new MediaRecorder(recordStream, {
            mimeType: MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : ''
          });

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              recordedChunksRef.current.push(e.data);
            }
          };

          recorder.start(1000);
          mediaRecorderRef.current = recorder;
        }
      } catch (recErr) {
        console.warn('MediaRecorder initialisation notice:', recErr);
      }

      setIsRecording(true);
      setRecordSeconds(0);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'Military Audio/Video Recorder',
          text: `🔴 Live Class recording initiated by Assessor. Audio-video diagnostic stream is archiving to candidate dossier.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          chest: 'SYSTEM'
        }
      ]);
    } else {
      // Stop Recording & Compile Blob
      setIsRecording(false);
      const finalSecs = recordSeconds;
      const durationFormatted = `${Math.floor(finalSecs / 60).toString().padStart(2, '0')}:${(finalSecs % 60).toString().padStart(2, '0')}`;
      const timestampFormatted = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      let createdUrl = '#';
      if (recordedChunksRef.current.length > 0) {
        const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        createdUrl = URL.createObjectURL(videoBlob);
        setRecordedVideoUrl(createdUrl);

        // Auto trigger download for candidate
        const downloadLink = document.createElement('a');
        downloadLink.href = createdUrl;
        downloadLink.download = `SSB-Mentorship-Live-Recording-${new Date().toISOString().substring(0, 10)}.webm`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }

      // Persist to Supabase / LocalStorage
      await saveSessionRecording({
        id: Math.random().toString(36).substring(2, 9),
        room_code: meetingCode.replace(/\s+/g, ''),
        topic,
        mentor_name: mentor,
        candidate_name: candidateName,
        duration_seconds: finalSecs,
        recorded_at: new Date().toISOString(),
        recording_url: createdUrl,
        notes: `Candidate Chest 24 Live Psychological Debrief and TAT Drill review.`
      });

      setSavedRecordSummary({ duration: durationFormatted, timestamp: timestampFormatted });
      setRecordingSavedModal(true);
    }
  };

  // Recording timer
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => setRecordSeconds(p => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // ──────────────────────────────────────────────────────────
  // 5. TACTICAL DRILL TIMERS (TAT & WAT)
  // ──────────────────────────────────────────────────────────
  // TAT countdown
  useEffect(() => {
    let timer: any = null;
    if (activeSideDrawer === 'drills' && activeDrillTab === 'tat') {
      timer = setInterval(() => {
        setTatTimer(prev => {
          if (prev <= 1) {
            setTatPhase(prevPhase => {
              return prevPhase === 'observe' ? 'write' : 'observe';
            });
            return tatPhase === 'observe' ? 240 : 30; // 30s observe, 240s write
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeSideDrawer, activeDrillTab]);

  // WAT countdown
  useEffect(() => {
    let timer: any = null;
    if (activeSideDrawer === 'drills' && activeDrillTab === 'wat') {
      timer = setInterval(() => {
        setWatTimer(prev => {
          if (prev <= 1) {
            setWatIndex(idx => (idx + 1) % watList.length);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeSideDrawer, activeDrillTab]);

  const handleSaveWatSentence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateWatSentence.trim()) return;
    setSavedWatResponses(prev => [
      ...prev,
      { word: watList[watIndex], sentence: candidateWatSentence.trim() }
    ]);
    setCandidateWatSentence('');
    setWatIndex(idx => (idx + 1) % watList.length);
    setWatTimer(15);
  };

  // ──────────────────────────────────────────────────────────
  // 6. REACTIONS & CHAT
  // ──────────────────────────────────────────────────────────
  const triggerReaction = (emoji: string) => {
    setActiveReaction(emoji);
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = window.setTimeout(() => setActiveReaction(null), 3500);

    const newItems: FloatingReaction[] = [
      { id: ++reactionCounterRef.current, emoji, left: 45 + Math.random() * 20, delay: 0 },
      { id: ++reactionCounterRef.current, emoji, left: 40 + Math.random() * 30, delay: 0.15 },
      { id: ++reactionCounterRef.current, emoji, left: 50 + Math.random() * 20, delay: 0.3 }
    ];
    setFloatingReactions(prev => [...prev, ...newItems]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => !newItems.some(i => i.id === r.id)));
    }, 2800);
  };

  const handleToggleHandRaise = () => {
    const next = !handRaised;
    setHandRaised(next);
    if (next) {
      triggerReaction('✋');
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            sender: mentor,
            text: `Chest 24 (${candidateName}), unmuting approved. Share your lead character deduction for this TAT card.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
            chest: 'Chest 50'
          }
        ]);
      }, 1200);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      {
        sender: candidateName,
        text: chatInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        chest: 'Chest 24'
      }
    ]);
    setChatInput('');
  };

  const shareUrl = `${window.location.origin}/student/live-meeting?code=${meetingCode.replace(/\s+/g, '')}&passcode=${passcode}&topic=${encodeURIComponent(topic)}`;

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const copyFullInvite = () => {
    const fullText = `SSB BRO Live Mentorship Studio
Session: ${topic}
Assessor: ${mentor} (AIR 34 · CDS 2 2019)

Join Live Class Link:
${shareUrl}

Class Code / Meeting ID: ${meetingCode}
Passcode: ${passcode}`;
    copyToClipboard(fullText, 'full');
  };

  const handleLeaveClass = async () => {
    if (userMediaStreamRef.current) {
      userMediaStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
    }
    if (document.fullscreenElement && document.exitFullscreen) {
      try {
        await document.exitFullscreen();
      } catch {}
    }
    navigate('/student/sessions');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0E17] text-gray-100 flex flex-col justify-between overflow-hidden select-none font-sans antialiased">

      {/* ── 1. MODERN MILITARY COMMAND TOP NAVIGATION (48px) ── */}
      <header className="h-12 px-3 sm:px-6 bg-[#0E1422] border-b border-[#1E293B] flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Branding & Session Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-heading font-bold text-xs sm:text-sm tracking-wider text-brand-gold uppercase">
              SSB BRO LIVE STUDIO
            </span>
          </div>

          <span className="text-gray-600 hidden md:inline">|</span>

          <div className="hidden md:flex items-center gap-2 text-xs text-gray-300">
            <span className="font-medium text-white truncate max-w-xs">{topic}</span>
            <span className="px-2 py-0.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-[10px] font-mono text-brand-gold">
              Lt. Vamshi E. (AIR 34)
            </span>
          </div>

          {/* Recording Badge */}
          {isRecording && (
            <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500 text-[11px] font-mono text-red-300 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-bold">REC</span>
              <span>{`${Math.floor(recordSeconds / 60).toString().padStart(2, '0')}:${(recordSeconds % 60).toString().padStart(2, '0')}`}</span>
            </div>
          )}
        </div>

        {/* Center: Meeting Code Pill (1-Click Copy) */}
        <button
          onClick={() => setShowInviteModal(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#162033] hover:bg-[#1E2B45] border border-[#2D3E5D] text-xs font-mono text-gray-200 transition-colors shadow-sm"
          title="Click to copy invitation details"
        >
          <span className="text-brand-steelLight">CODE:</span>
          <span className="font-bold text-brand-gold tracking-wide">{meetingCode}</span>
          <Copy className="w-3 h-3 text-gray-400" />
        </button>

        {/* Right: Layout Switcher + Fullscreen + Leave Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Invite Pill on Mobile */}
          <button
            onClick={() => setShowInviteModal(true)}
            className="sm:hidden p-1.5 rounded-lg bg-[#162033] text-brand-gold border border-brand-gold/30"
            title="Invite & Code"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {/* Segmented Layout Switcher (Speaker vs Gallery) */}
          <div className="bg-[#162033] p-0.5 rounded-lg border border-[#2D3E5D] flex items-center text-xs">
            <button
              onClick={() => setViewMode('speaker')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                viewMode === 'speaker'
                  ? 'bg-brand-gold text-brand-dark font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Speaker</span>
            </button>
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                viewMode === 'gallery'
                  ? 'bg-brand-gold text-brand-dark font-bold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Gallery</span>
            </button>
          </div>

          {/* One-Click Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-[#162033] hover:bg-[#202E49] text-gray-300 hover:text-white border border-[#2D3E5D] transition-colors"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-brand-gold" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Leave Session */}
          <button
            onClick={handleLeaveClass}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow-md flex items-center gap-1.5"
          >
            <span>Leave</span>
          </button>
        </div>
      </header>

      {/* ── 2. CENTRAL HIGH-DEFINITION VIDEO STAGE ── */}
      <main className="flex-1 relative bg-[#070A10] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        
        {/* Floating Animated Reaction Particles */}
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {floatingReactions.map(r => (
            <div
              key={r.id}
              style={{ left: `${r.left}%`, animationDelay: `${r.delay}s` }}
              className="absolute bottom-16 text-3xl sm:text-4xl animate-float-up pointer-events-none filter drop-shadow-lg"
            >
              {r.emoji}
            </div>
          ))}
        </div>

        {/* ── SCENARIO A: ACTIVE SCREEN SHARING ── */}
        {isSharingScreen ? (
          <div className="relative w-full h-full max-w-7xl rounded-2xl overflow-hidden bg-[#0C121E] border-2 border-emerald-500/70 shadow-2xl flex flex-col">
            
            {/* Screen Share Status Bar */}
            <div className="h-10 px-4 bg-emerald-950/80 border-b border-emerald-500/40 flex items-center justify-between text-xs text-emerald-200">
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {screenShareType === 'browser' && 'Live Computer Screen Broadcast (Shared via DisplayMedia)'}
                  {screenShareType === 'tat' && 'SSB Thematic Apperception Test (TAT) Interactive Slide Deck'}
                  {screenShareType === 'wat' && 'Word Association Test (WAT) 15-Second Flashcard Battery'}
                  {screenShareType === 'piq' && 'Candidate Personal Information Questionnaire (PIQ Dossier)'}
                </span>
              </div>
              <button
                onClick={stopScreenShare}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
              >
                Stop Share
              </button>
            </div>

            {/* Screen Content Viewport */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden p-2 sm:p-6">
              {screenShareType === 'browser' ? (
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain rounded-xl shadow-2xl"
                />
              ) : screenShareType === 'tat' ? (
                <div className="w-full max-w-3xl flex flex-col items-center text-center p-4">
                  <span className="text-xs font-mono uppercase text-brand-gold tracking-widest font-semibold mb-1">
                    Psychological Battery · Picture 3 of 12
                  </span>
                  <div className="relative my-2 w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-900">
                    <img
                      src="/images/hero-defence.jpg"
                      alt="SSB Psychological Stimulus"
                      className="w-full h-full object-cover filter contrast-125 brightness-90 grayscale"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-brand-gold text-brand-gold text-xs font-mono font-bold">
                      Observe: {tatTimer}s
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-2 font-mono">
                    Observe the characters, setting, past circumstances, present action, and future outcome.
                  </p>
                </div>
              ) : screenShareType === 'wat' ? (
                <div className="w-full max-w-xl p-8 rounded-2xl bg-[#141E30] border-2 border-brand-gold/60 text-center space-y-6 shadow-2xl">
                  <span className="text-xs font-mono uppercase text-brand-steelLight tracking-widest">
                    Word {watIndex + 1} of {watList.length} (15 Seconds Each)
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-brand-gold animate-pulse">
                    {watList[watIndex]}
                  </h2>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-gold h-full transition-all duration-1000"
                      style={{ width: `${(watTimer / 15) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 font-mono">Formulate an authentic, active, OLQ-aligned sentence immediately.</p>
                </div>
              ) : (
                <div className="w-full max-w-3xl p-6 rounded-2xl bg-[#121A29] border border-[#2D3E5D] text-left text-xs font-mono space-y-4">
                  <div className="border-b border-[#2D3E5D] pb-3 flex justify-between items-center">
                    <span className="text-sm font-bold text-brand-gold">PERSONAL INFORMATION QUESTIONNAIRE (PIQ)</span>
                    <span className="text-gray-400">Chest 24: {candidateName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded bg-[#0D1422] border border-white/5">
                      <span className="text-gray-400 block text-[10px]">Education Background:</span>
                      <span className="text-white font-semibold">B.Tech Mechanical (CGPA 8.4) · CDS 2 Entry</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#0D1422] border border-white/5">
                      <span className="text-gray-400 block text-[10px]">Sports & Extra-Curriculars:</span>
                      <span className="text-white font-semibold">Cross-Country Captain · NCC 'C' Certificate</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#0D1422] border border-white/5">
                      <span className="text-gray-400 block text-[10px]">Previous SSB Attempts:</span>
                      <span className="text-white font-semibold">1 Attempt (Screened Out 1 AFSB Dehradun)</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#0D1422] border border-white/5">
                      <span className="text-gray-400 block text-[10px]">Interview Cross-Question Focus:</span>
                      <span className="text-brand-gold font-semibold">Why repeater turnaround & physical transformation</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Corner PIP of Mentor while screen is shared */}
            <div className="absolute bottom-4 right-4 w-40 sm:w-52 aspect-video rounded-xl overflow-hidden border-2 border-brand-gold/80 shadow-2xl bg-[#101624] z-20">
              <img
                src="/images/mentor-portrait.jpg"
                alt="Lt. Vamshi E."
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{mentor}</span>
              </div>
            </div>
          </div>
        ) : viewMode === 'speaker' ? (
          /* ── SCENARIO B: SPEAKER VIEW (MENTOR SPOTLIGHT + REAL ASPIRANT WEBCAM PIP) ── */
          <div className="relative w-full h-full max-w-6xl rounded-2xl overflow-hidden bg-[#0C121E] border border-[#1E293B] shadow-2xl flex items-center justify-center">
            
            {/* Mentor Spotlight Visual */}
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#111827] via-[#0C121E] to-[#080D16]">
              <img
                src="/images/mentor-portrait.jpg"
                alt="Lt. Vamshi E."
                className="w-full h-full object-cover md:object-contain object-top brightness-95 filter"
              />

              {/* Ambient Active Speaker Glow */}
              <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-2xl pointer-events-none" />

              {/* Mentor Active Speaker Badge & Insignia */}
              <div className="absolute bottom-4 left-4 bg-[#0B1220]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-brand-gold/40 shadow-2xl flex items-center gap-3">
                <div className="relative">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block animate-ping absolute" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block relative" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-sm text-white">{mentor}</span>
                    <span className="px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold text-[10px] font-mono font-bold">
                      AIR 34 · CDS 2 2019
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 font-mono">Assessor & Founder · 3 AFSB Recommended</p>
                </div>
              </div>
            </div>

            {/* Aspirant PIP with REAL WEBCAM (Top Right Corner) */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-36 sm:w-56 aspect-[3/4] sm:aspect-video rounded-xl overflow-hidden bg-[#162033] border-2 border-brand-gold/70 shadow-2xl flex flex-col justify-end z-20">
              
              {!isVideoOff ? (
                /* Real Live Candidate Webcam Stream */
                <div className="w-full h-full relative bg-black flex items-center justify-center">
                  <video
                    ref={userVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  {/* Floating active reaction on PIP */}
                  {activeReaction && (
                    <div className="absolute top-2 right-2 text-2xl bg-black/70 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center border border-white/20 animate-bounce">
                      {activeReaction}
                    </div>
                  )}
                </div>
              ) : (
                /* Avatar Fallback when Camera is Off */
                <div className="w-full h-full bg-[#121A2A] flex flex-col items-center justify-center relative">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    AS
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 font-mono">Camera Off</span>
                  {activeReaction && (
                    <div className="absolute top-2 right-2 text-2xl bg-black/70 rounded-full w-8 h-8 flex items-center justify-center">
                      {activeReaction}
                    </div>
                  )}
                </div>
              )}

              {/* Real Audio Volume Visualizer Bar & Nameplate */}
              <div className="p-2 bg-[#0B101D]/90 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  {handRaised && <span className="text-yellow-400">✋</span>}
                  <span className="text-white font-semibold truncate">{candidateName} (You)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Real Dynamic Audio Level Bar */}
                  {!isMuted && audioLevel > 5 ? (
                    <div className="flex items-end gap-0.5 h-3">
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${Math.max(20, audioLevel)}%` }} />
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${Math.max(40, audioLevel * 0.8)}%` }} />
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${Math.max(15, audioLevel * 0.5)}%` }} />
                    </div>
                  ) : isMuted ? (
                    <MicOff className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  ) : (
                    <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── SCENARIO C: GALLERY VIEW (2x2 BALANCED GRID) ── */
          <div className="w-full h-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-1">
            
            {/* Tile 1: Lt. Vamshi E. */}
            <div className="relative rounded-2xl overflow-hidden bg-[#121A2A] border-2 border-emerald-500/60 shadow-2xl flex items-center justify-center">
              <img
                src="/images/mentor-portrait.jpg"
                alt="Lt. Vamshi E."
                className="w-full h-full object-cover object-top brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 bg-[#0B101D]/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-sans text-white flex items-center gap-2 border border-brand-gold/30">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold">{mentor}</span>
                <span className="text-[10px] text-brand-gold font-mono">(Host · AIR 34)</span>
              </div>
            </div>

            {/* Tile 2: Arjun Sharma (Me) with REAL WEBCAM */}
            <div className="relative rounded-2xl overflow-hidden bg-[#121A2A] border border-brand-gold/60 shadow-2xl flex flex-col justify-end">
              {!isVideoOff ? (
                <div className="w-full h-full relative bg-black flex items-center justify-center">
                  <video
                    ref={userGalleryVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  {activeReaction && (
                    <div className="absolute top-4 right-4 text-3xl bg-black/70 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center border border-white/20 animate-bounce">
                      {activeReaction}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-[#0D1422] flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xl shadow-xl mb-2">
                    AS
                  </div>
                  <span className="text-xs text-gray-400 font-mono">Camera Off</span>
                </div>
              )}

              <div className="p-3 bg-[#0B101D]/90 backdrop-blur-md text-xs font-sans text-gray-200 flex items-center justify-between border-t border-white/10">
                <span className="font-semibold flex items-center gap-1.5">
                  {handRaised && <span className="text-yellow-400">✋</span>}
                  {candidateName} (Chest 24 · You)
                </span>
                <div className="flex items-center gap-2">
                  {!isMuted && audioLevel > 5 ? (
                    <div className="flex items-end gap-0.5 h-3.5">
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${Math.max(20, audioLevel)}%` }} />
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${Math.max(40, audioLevel * 0.8)}%` }} />
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${Math.max(15, audioLevel * 0.5)}%` }} />
                    </div>
                  ) : isMuted ? (
                    <MicOff className="w-4 h-4 text-red-500" />
                  ) : (
                    <Mic className="w-4 h-4 text-emerald-400" />
                  )}
                  {isVideoOff ? <VideoOff className="w-4 h-4 text-red-500" /> : <Video className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>
            </div>

            {/* Tile 3: Priya Nair (Aspirant Peer) */}
            <div className="relative rounded-2xl overflow-hidden bg-[#121A2A] border border-white/10 shadow-2xl flex flex-col justify-end">
              <div className="w-full h-full bg-[#0D1422] flex flex-col items-center justify-center text-gray-300">
                <div className="w-16 h-16 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-xl shadow-xl mb-2">
                  PN
                </div>
                <span className="text-xs text-gray-400 font-mono">Priya Nair · Chest 09</span>
              </div>
              <div className="p-3 bg-[#0B101D]/90 text-xs font-sans text-gray-200 flex items-center justify-between border-t border-white/10">
                <span className="font-semibold">Priya Nair (Chest 09)</span>
                <div className="flex items-center gap-2">
                  <MicOff className="w-4 h-4 text-red-500" />
                  <Video className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Tile 4: Rohit Verma (Aspirant Peer) */}
            <div className="relative rounded-2xl overflow-hidden bg-[#121A2A] border border-white/10 shadow-2xl flex flex-col justify-end">
              <div className="w-full h-full bg-[#0D1422] flex flex-col items-center justify-center text-gray-300">
                <div className="w-16 h-16 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xl shadow-xl mb-2">
                  RV
                </div>
                <span className="text-xs text-gray-400 font-mono">Rohit Verma · Chest 18</span>
              </div>
              <div className="p-3 bg-[#0B101D]/90 text-xs font-sans text-gray-200 flex items-center justify-between border-t border-white/10">
                <span className="font-semibold">Rohit Verma (Chest 18)</span>
                <div className="flex items-center gap-2">
                  <MicOff className="w-4 h-4 text-red-500" />
                  <VideoOff className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── 3. COLLAPSIBLE RIGHT-SIDE COMMAND DRAWERS (CHAT / ATTENDEES / DRILLS) ── */}
        
        {/* DRAWER 1: IN-CALL REAL-TIME CHAT */}
        {activeSideDrawer === 'chat' && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-[#0E1524] border-l border-[#1E293B] flex flex-col z-30 shadow-2xl animate-fadeIn">
            <div className="h-12 px-4 border-b border-[#1E293B] flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-brand-gold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Live Mentorship Chat
              </span>
              <button onClick={() => setActiveSideDrawer('none')} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${m.isMe ? 'bg-[#1A263D] border-[#2E4166] ml-6' : 'bg-[#131B2C] border-[#1E293B] mr-6'}`}>
                  <div className="flex items-center justify-between text-[10px] text-brand-steelLight font-mono mb-1">
                    <span className="font-bold text-brand-gold">{m.sender} {m.chest && `(${m.chest})`}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="leading-relaxed text-gray-200">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#1E293B] flex gap-2 bg-[#0A0F1A]">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type query or deduction to mentor..."
                className="flex-1 bg-[#141E30] border border-[#23334F] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
              />
              <button type="submit" className="px-3.5 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-bold text-xs transition-colors shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* DRAWER 2: ATTENDEES DIRECTORY */}
        {activeSideDrawer === 'participants' && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-[#0E1524] border-l border-[#1E293B] flex flex-col z-30 shadow-2xl animate-fadeIn">
            <div className="h-12 px-4 border-b border-[#1E293B] flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-brand-gold flex items-center gap-2">
                <Users className="w-4 h-4" /> Studio Attendees (4)
              </span>
              <button onClick={() => setActiveSideDrawer('none')} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs flex-1 overflow-y-auto">
              {/* Mentor */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131B2C] border border-brand-gold/30">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-gold text-brand-dark font-bold flex items-center justify-center text-xs">
                    LV
                  </div>
                  <div>
                    <p className="font-semibold text-white">{mentor}</p>
                    <p className="text-[10px] text-brand-steelLight font-mono">Assessor · AIR 34 (Host)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Mic className="w-4 h-4" />
                  <Video className="w-4 h-4" />
                </div>
              </div>

              {/* Arjun Sharma */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1A263D] border border-brand-gold/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    AS
                  </div>
                  <div>
                    <p className="font-semibold text-white">{candidateName} (You)</p>
                    <p className="text-[10px] text-gray-400 font-mono">Candidate · Chest 24</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {handRaised && <span className="text-yellow-400 text-xs">✋</span>}
                  {isMuted ? <MicOff className="w-4 h-4 text-red-500" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                  {isVideoOff ? <VideoOff className="w-4 h-4 text-red-500" /> : <Video className="w-4 h-4 text-emerald-400" />}
                </div>
              </div>

              {/* Priya Nair */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131B2C] border border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-xs">
                    PN
                  </div>
                  <div>
                    <p className="font-semibold text-white">Priya Nair</p>
                    <p className="text-[10px] text-gray-400 font-mono">Candidate · Chest 09</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MicOff className="w-4 h-4 text-red-500" />
                  <Video className="w-4 h-4 text-emerald-400" />
                </div>
              </div>

              {/* Rohit Verma */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131B2C] border border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                    RV
                  </div>
                  <div>
                    <p className="font-semibold text-white">Rohit Verma</p>
                    <p className="text-[10px] text-gray-400 font-mono">Candidate · Chest 18</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MicOff className="w-4 h-4 text-red-500" />
                  <VideoOff className="w-4 h-4 text-red-500" />
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveSideDrawer('none');
                  setShowInviteModal(true);
                }}
                className="w-full mt-4 py-2.5 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold text-brand-gold text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <LinkIcon className="w-3.5 h-3.5" /> Invite More Aspirants
              </button>
            </div>
          </div>
        )}

        {/* DRAWER 3: TACTICAL SSB ASSESSMENT SUITE (TAT, WAT, PIQ) */}
        {activeSideDrawer === 'drills' && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-[440px] bg-[#0E1524] border-l border-[#1E293B] flex flex-col z-30 shadow-2xl animate-fadeIn">
            <div className="h-12 px-4 border-b border-[#1E293B] flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-brand-gold flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-gold" /> Tactical Assessment Suite
              </span>
              <button onClick={() => setActiveSideDrawer('none')} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drill Tabs */}
            <div className="grid grid-cols-3 p-2 bg-[#0A0F1A] border-b border-[#1E293B] text-xs font-mono">
              <button
                onClick={() => setActiveDrillTab('tat')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  activeDrillTab === 'tat' ? 'bg-brand-gold text-brand-dark shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                TAT Drill
              </button>
              <button
                onClick={() => setActiveDrillTab('wat')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  activeDrillTab === 'wat' ? 'bg-brand-gold text-brand-dark shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                WAT Drill
              </button>
              <button
                onClick={() => setActiveDrillTab('piq')}
                className={`py-1.5 rounded-lg font-semibold transition-all ${
                  activeDrillTab === 'piq' ? 'bg-brand-gold text-brand-dark shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                PIQ Audit
              </button>
            </div>

            {/* Drill Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              
              {/* TAB 1: TAT */}
              {activeDrillTab === 'tat' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#141E30] border border-brand-gold/30 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-brand-steelLight font-mono uppercase">Current Phase</span>
                      <p className="font-bold text-white text-sm">
                        {tatPhase === 'observe' ? '30s Picture Observation' : '4-Minute Story Formulation'}
                      </p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-lg font-bold text-brand-gold">{tatTimer}s</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold block">Candidate Story Draft (Chest 24):</label>
                    <textarea
                      rows={7}
                      value={candidateTatStory}
                      onChange={(e) => setCandidateTatStory(e.target.value)}
                      placeholder="Identify main hero, past situation leading to crisis, concrete action taken, and positive outcome..."
                      className="w-full bg-[#121A2A] border border-[#23334F] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-xs leading-relaxed"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-gray-400">
                      <span>Words: {candidateTatStory.trim() ? candidateTatStory.trim().split(/\s+/).length : 0}</span>
                      <span>Target: ~100–120 words</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setChatMessages(prev => [
                        ...prev,
                        {
                          sender: candidateName,
                          text: `[TAT Story Submission]: ${candidateTatStory}`,
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          isMe: true,
                          chest: 'Chest 24'
                        }
                      ]);
                      setCandidateTatStory('');
                      setActiveSideDrawer('chat');
                    }}
                    disabled={!candidateTatStory.trim()}
                    className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-bold text-xs disabled:opacity-50 transition-colors shadow"
                  >
                    Submit Story to Assessor
                  </button>
                </div>
              )}

              {/* TAB 2: WAT */}
              {activeDrillTab === 'wat' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#141E30] border-2 border-brand-gold/60 text-center space-y-3 shadow-xl">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Flash Word ({watIndex + 1}/7)</span>
                    <h3 className="text-3xl font-black font-mono tracking-wider text-brand-gold">{watList[watIndex]}</h3>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-gold h-full transition-all duration-1000" style={{ width: `${(watTimer / 15) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">{watTimer}s remaining</span>
                  </div>

                  <form onSubmit={handleSaveWatSentence} className="space-y-2">
                    <label className="text-gray-300 font-semibold block">Your Spontaneous Association:</label>
                    <input
                      value={candidateWatSentence}
                      onChange={(e) => setCandidateWatSentence(e.target.value)}
                      placeholder="Type active, authentic response sentence..."
                      className="w-full bg-[#121A2A] border border-[#23334F] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-xs"
                    />
                    <button
                      type="submit"
                      disabled={!candidateWatSentence.trim()}
                      className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-bold text-xs disabled:opacity-50 transition-colors shadow"
                    >
                      Save Sentence & Next Word
                    </button>
                  </form>

                  {savedWatResponses.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-mono uppercase text-gray-400">Recorded Drill Sentences:</span>
                      {savedWatResponses.map((r, i) => (
                        <div key={i} className="p-2 rounded-lg bg-[#0E1524] border border-[#1E293B] text-[11px] flex justify-between">
                          <span className="font-bold text-brand-gold">{r.word}:</span>
                          <span className="text-gray-300 truncate max-w-[220px]">{r.sentence}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PIQ */}
              {activeDrillTab === 'piq' && (
                <div className="space-y-3 font-mono text-[11px]">
                  <div className="p-3 rounded-xl bg-[#141E30] border border-[#2D3E5D] space-y-2">
                    <span className="text-xs font-bold text-brand-gold block font-sans">Aspirant Profile Summary</span>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-semibold">{candidateName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Chest No:</span>
                      <span className="text-brand-gold font-bold">24</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/5">
                      <span className="text-gray-400">Entry:</span>
                      <span className="text-white">CDS 2 2026 (IMA Preference)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Diagnostic Focus:</span>
                      <span className="text-emerald-400 font-semibold">Self-Awareness & OLQ 4</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── REACTIONS DOCK (POPUP) ── */}
        {showReactionsTray && (
          <div className="absolute bottom-20 right-4 sm:right-32 w-72 bg-[#101726] border border-[#2E4166] rounded-2xl p-4 shadow-2xl z-40 text-white animate-fadeIn">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-yellow-400" />
                Military Reactions
              </span>
              <button onClick={() => setShowReactionsTray(false)} className="text-gray-400 hover:text-white p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2 mb-3">
              {['👏', '👍', '❤️', '😂', '😮', '🎉'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    triggerReaction(emoji);
                    setShowReactionsTray(false);
                  }}
                  className="aspect-square flex items-center justify-center text-2xl rounded-xl hover:bg-white/10 active:scale-90 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                handleToggleHandRaise();
                setShowReactionsTray(false);
              }}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow ${
                handRaised
                  ? 'bg-yellow-400 text-black'
                  : 'bg-[#1C283F] hover:bg-[#253554] text-white border border-[#34486E]'
              }`}
            >
              <Hand className={`w-4 h-4 ${handRaised ? 'fill-black' : ''}`} />
              <span>{handRaised ? 'Lower Hand (Chest 24)' : 'Raise Hand (Chest 24)'}</span>
            </button>
          </div>
        )}

      </main>

      {/* ── 4. MODERN ARRANGEABLE BOTTOM DOCK (LOGICAL ISLANDS) ── */}
      <footer className="h-16 px-3 sm:px-8 bg-[#0E1422] border-t border-[#1E293B] flex items-center justify-between shrink-0 z-30">
        
        {/* ISLAND 1: AUDIO / VIDEO CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#141C2E] px-2.5 py-1.5 rounded-2xl border border-[#23324C]">
          
          {/* Mute / Unmute */}
          <button
            onClick={toggleMute}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMuted ? 'Unmute' : 'Muted'}</span>
          </button>

          {/* Video Start / Stop */}
          <button
            onClick={toggleVideo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isVideoOff
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            <span className="hidden sm:inline">{isVideoOff ? 'Start Video' : 'Stop Video'}</span>
          </button>
        </div>

        {/* ISLAND 2: CONTENT & DRILL TOOLS */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#141C2E] px-2.5 py-1.5 rounded-2xl border border-[#23324C]">
          
          {/* Real Screen Share */}
          <button
            onClick={() => {
              if (isSharingScreen) {
                stopScreenShare();
              } else {
                setShowShareModal(true);
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isSharingScreen
                ? 'bg-emerald-600 text-white shadow-lg animate-pulse'
                : 'text-gray-200 hover:bg-[#202C45]'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{isSharingScreen ? 'Stop Share' : 'Share Screen'}</span>
          </button>

          {/* Real MediaRecorder Recording */}
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isRecording
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-gray-200 hover:bg-[#202C45]'
            }`}
          >
            <Disc className={`w-4 h-4 ${isRecording ? 'animate-spin' : 'text-red-400'}`} />
            <span className="hidden sm:inline">{isRecording ? 'Stop Rec' : 'Record'}</span>
          </button>

          {/* Tactical Drills Drawer */}
          <button
            onClick={() => {
              setActiveSideDrawer(activeSideDrawer === 'drills' ? 'none' : 'drills');
              setShowReactionsTray(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSideDrawer === 'drills'
                ? 'bg-brand-gold text-brand-dark shadow'
                : 'text-brand-gold hover:bg-brand-gold/15'
            }`}
          >
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">SSB Drills</span>
          </button>
        </div>

        {/* ISLAND 3: INTERACTION & PARTICIPANTS */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#141C2E] px-2.5 py-1.5 rounded-2xl border border-[#23324C]">
          
          {/* Reactions */}
          <button
            onClick={() => {
              setShowReactionsTray(!showReactionsTray);
              if (activeSideDrawer !== 'none') setActiveSideDrawer('none');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              showReactionsTray ? 'text-yellow-400' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span className="hidden sm:inline">Reactions</span>
          </button>

          {/* Chat Drawer */}
          <button
            onClick={() => {
              setActiveSideDrawer(activeSideDrawer === 'chat' ? 'none' : 'chat');
              setShowReactionsTray(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSideDrawer === 'chat' ? 'text-brand-gold bg-brand-gold/10' : 'text-gray-300 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
          </button>

          {/* Attendees Drawer */}
          <button
            onClick={() => {
              setActiveSideDrawer(activeSideDrawer === 'participants' ? 'none' : 'participants');
              setShowReactionsTray(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeSideDrawer === 'participants' ? 'text-brand-gold bg-brand-gold/10' : 'text-gray-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">(4)</span>
          </button>
        </div>

      </footer>

      {/* ── 5. CONTENT SHARING MODAL ── */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-[#121A2A] border border-[#2E4166] max-w-lg w-full rounded-2xl p-6 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#23334F] pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-heading font-bold text-base text-white">Share Content to Stage</h3>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={startRealScreenShare}
                className="w-full p-4 rounded-xl bg-[#182338] hover:bg-[#202E4A] border border-emerald-500/30 text-left flex items-start gap-3.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white group-hover:text-emerald-400 transition-colors">
                    Share Real Computer Screen / Chrome Tab
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Broadcast your live desktop screen, notes, or written story directly via native display capture.
                  </p>
                </div>
              </button>

              <button
                onClick={() => startSimulatedDrill('tat')}
                className="w-full p-4 rounded-xl bg-[#182338] hover:bg-[#202E4A] border border-brand-gold/30 text-left flex items-start gap-3.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white group-hover:text-brand-gold transition-colors">
                    TAT Psychological Drill Slide Deck
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Launch official 30-second stimulus card with live 4-minute candidate story formulation.
                  </p>
                </div>
              </button>

              <button
                onClick={() => startSimulatedDrill('wat')}
                className="w-full p-4 rounded-xl bg-[#182338] hover:bg-[#202E4A] border border-blue-500/30 text-left flex items-start gap-3.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors">
                    WAT 15-Second Rapid Flashcard Battery
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Display continuous psychological stimulus words for rapid candidate association.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. INVITE ASPIRANTS & CODE MODAL ── */}
      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-[#121A2A] border border-[#2E4166] max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#23334F] pb-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-brand-gold" />
                <h3 className="font-heading font-bold text-base text-white">Invite to Live Mentorship</h3>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#0D1422] border border-[#1E293B] space-y-1">
                <p className="text-[10px] font-mono uppercase text-brand-gold font-semibold">Active Session Topic</p>
                <p className="text-sm font-semibold text-white">{topic}</p>
                <p className="text-xs text-brand-steelLight font-mono">Assessor: {mentor} · AIR 34</p>
              </div>

              {/* Code */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#162033] border border-[#253554]">
                <div>
                  <p className="text-[10px] text-gray-400 font-mono uppercase">Meeting ID / Code</p>
                  <p className="text-base font-mono font-bold text-brand-gold tracking-wider">{meetingCode}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(meetingCode, 'code')}
                  className="px-3 py-1.5 rounded-lg bg-[#202E48] hover:bg-[#2C3E61] text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'code' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Passcode */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#162033] border border-[#253554]">
                <div>
                  <p className="text-[10px] text-gray-400 font-mono uppercase">Security Passcode</p>
                  <p className="text-sm font-mono font-bold text-white tracking-wider">{passcode}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(passcode, 'passcode')}
                  className="px-3 py-1.5 rounded-lg bg-[#202E48] hover:bg-[#2C3E61] text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'passcode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'passcode' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Direct Link */}
              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-mono uppercase">Direct Join Link</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-[#0D1422] border border-[#23334F] rounded-lg px-3 py-2 text-xs font-mono text-gray-300 truncate focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(shareUrl, 'url')}
                    className="px-3 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-bold text-xs flex items-center gap-1.5 transition-all shadow"
                  >
                    {copiedKey === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'url' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={copyFullInvite}
              className="w-full py-3 rounded-xl bg-[#1C283F] hover:bg-[#253554] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-[#34486E] shadow"
            >
              {copiedKey === 'full' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-brand-gold" />}
              <span>{copiedKey === 'full' ? 'Invitation Copied!' : 'Copy Full WhatsApp / Telegram Invitation'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 7. RECORDING SAVED & DOWNLOAD CONFIRMATION MODAL ── */}
      {recordingSavedModal && savedRecordSummary && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setRecordingSavedModal(false)}
        >
          <div
            className="bg-[#121A2A] border border-emerald-500/60 max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-white">Live Class Recording Saved!</h3>
              <p className="text-xs text-gray-400 mt-1">
                Your video session was captured and saved to your Dossier Archive and downloaded to your computer.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D1422] border border-[#23334F] text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400">Class Topic:</span>
                <span className="text-white font-semibold truncate max-w-[200px]">{topic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-brand-gold font-bold">{savedRecordSummary.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Archived At:</span>
                <span className="text-gray-300">{savedRecordSummary.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setRecordingSavedModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1C283F] hover:bg-[#253554] text-gray-200 text-xs font-semibold"
              >
                Continue Class
              </button>
              <button
                onClick={() => {
                  setRecordingSavedModal(false);
                  navigate('/student/sessions');
                }}
                className="flex-1 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-dark text-xs font-bold shadow"
              >
                View Dossier Archive
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
