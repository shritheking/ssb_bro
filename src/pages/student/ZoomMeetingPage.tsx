import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, Mic, MicOff, Video, VideoOff, 
  Share2, Users, MessageSquare, Hand, X, Send, 
  Smile, LayoutGrid, Maximize, Minimize, Check, 
  ChevronDown, UserCheck, Monitor, Disc, Pause, 
  Play, Copy, Link as LinkIcon, Download, Clock, 
  FileText, Sparkles, ExternalLink, HelpCircle,
  Volume2, VolumeX, Settings, Target, Award, AlertCircle,
  Radio, RefreshCw, Pin, Zap
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
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100
  const [isMentorSpeaking, setIsMentorSpeaking] = useState(false);
  const [voiceAssessorEnabled, setVoiceAssessorEnabled] = useState(true);

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
  const [spotlightTarget, setSpotlightTarget] = useState<'mentor' | 'me'>('mentor');

  // ── FLOATING REACTIONS ──
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const reactionTimerRef = useRef<number | null>(null);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const reactionCounterRef = useRef(0);

  // ── 1. REAL NATIVE SCREEN SHARING (ZERO MODALS) ──
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  // ── 2. REAL MEDIARECORDER RECORDING ──
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [recordingSavedModal, setRecordingSavedModal] = useState(false);
  const [savedRecordSummary, setSavedRecordSummary] = useState<{ duration: string; timestamp: string; url?: string } | null>(null);

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

  // ── CHAT & REAL-TIME ASSESSOR RESPONSES ──
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; isMe: boolean; chest?: string }>>([
    { 
      sender: mentor, 
      text: `Good evening ${candidateName}. Encrypted diagnostic uplink active. We will examine your TAT Story #3 and test your rapid WAT association. Keep your audio live.`, 
      time: '18:01', 
      isMe: false, 
      chest: 'Assessor (AIR 34)' 
    },
    { 
      sender: 'Priya Nair', 
      text: 'Good evening Sir. Video and audio feed confirmed.', 
      time: '18:02', 
      isMe: false, 
      chest: 'Chest 09' 
    }
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

          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
            userVideoRef.current.play().catch(() => {});
          }
          if (userGalleryVideoRef.current) {
            userGalleryVideoRef.current.srcObject = stream;
            userGalleryVideoRef.current.play().catch(() => {});
          }

          // Real mic audio level analyser
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
                  setAudioLevel(Math.min(100, Math.round(avg * 1.6)));
                } else {
                  setAudioLevel(0);
                }
                animFrameRef.current = requestAnimationFrame(updateAudioLevel);
              };
              updateAudioLevel();
            }
          } catch (audioErr) {
            console.warn('Audio analyser notice:', audioErr);
          }
        }
      } catch (err) {
        console.warn('Webcam permission pending or not granted:', err);
      }
    };

    initWebcam();

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

  // Sync streams when views update
  useEffect(() => {
    if (userMediaStreamRef.current) {
      if (userVideoRef.current) userVideoRef.current.srcObject = userMediaStreamRef.current;
      if (userGalleryVideoRef.current) userGalleryVideoRef.current.srcObject = userMediaStreamRef.current;
    }
  }, [viewMode, isVideoOff, spotlightTarget]);

  // Sync screen share stream to video element
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.play().catch(e => console.warn('Screen video play:', e));
    }
  }, [screenStream, isSharingScreen]);

  // ──────────────────────────────────────────────────────────
  // 2. HARDWARE TOGGLES (MIC & CAMERA)
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

  const toggleVideo = async () => {
    const nextVideoOff = !isVideoOff;
    setIsVideoOff(nextVideoOff);

    if (userMediaStreamRef.current) {
      userMediaStreamRef.current.getVideoTracks().forEach(t => {
        t.enabled = !nextVideoOff;
      });
    } else if (!nextVideoOff) {
      // Re-request camera if not initialized
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        userMediaStreamRef.current = stream;
        if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        if (userGalleryVideoRef.current) userGalleryVideoRef.current.srcObject = stream;
      } catch (e) {
        console.warn('Could not re-acquire camera:', e);
      }
    }
  };

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
      console.warn('Fullscreen action unavailable:', err);
    }
  };

  // ──────────────────────────────────────────────────────────
  // 3. REAL SCREEN SHARING (DIRECT SYSTEM PICKER)
  // ──────────────────────────────────────────────────────────
  const startRealScreenShare = async () => {
    setShareError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        // Direct native browser screen capture (video only ensures maximum cross-browser success)
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });

        setScreenStream(stream);
        setIsSharingScreen(true);

        // Immediate track cleanup listener
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.onended = () => {
            stopScreenShare();
          };
        }

        // Bind stream directly to video element
        setTimeout(() => {
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = stream;
            screenVideoRef.current.play().catch(() => {});
          }
        }, 150);

        setChatMessages(prev => [
          ...prev,
          {
            sender: 'Broadcast System',
            text: `🖥️ ${candidateName} (Chest 24) is now sharing live computer screen to the mentorship room.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
            chest: 'SYSTEM'
          }
        ]);
      } else {
        setShareError('Native screen sharing is not supported on this device/browser.');
      }
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') {
        console.warn('Screen share error:', err);
        setShareError('Screen sharing could not be started: ' + (err.message || 'Permission denied'));
      }
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
    setIsSharingScreen(false);
  };

  // ──────────────────────────────────────────────────────────
  // 4. REAL MEDIARECORDING WITH INSTANT DOWNLOAD
  // ──────────────────────────────────────────────────────────
  const toggleRecording = async () => {
    if (!isRecording) {
      recordedChunksRef.current = [];
      try {
        let streamToRecord: MediaStream | null = null;
        if (screenStream) {
          streamToRecord = screenStream;
        } else if (userMediaStreamRef.current) {
          streamToRecord = userMediaStreamRef.current;
        } else {
          // Off-screen canvas fallback
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#0B1220';
            ctx.fillRect(0, 0, 640, 360);
            ctx.fillStyle = '#E6B980';
            ctx.font = '22px sans-serif';
            ctx.fillText('SSB BRO Live Mentorship Studio', 40, 180);
          }
          streamToRecord = (canvas as any).captureStream ? (canvas as any).captureStream(15) : null;
        }

        if (streamToRecord && typeof MediaRecorder !== 'undefined') {
          const recorder = new MediaRecorder(streamToRecord, {
            mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
              ? 'video/webm;codecs=vp9'
              : MediaRecorder.isTypeSupported('video/webm')
              ? 'video/webm'
              : ''
          });

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
              recordedChunksRef.current.push(e.data);
            }
          };

          recorder.start(1000);
          mediaRecorderRef.current = recorder;
        }
      } catch (e) {
        console.warn('Recorder init notice:', e);
      }

      setIsRecording(true);
      setRecordSeconds(0);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'Military Video Recorder',
          text: `🔴 Live Class recording initiated. Audio & video stream is archiving to your candidate dossier.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          chest: 'SYSTEM'
        }
      ]);
    } else {
      setIsRecording(false);
      const totalSecs = recordSeconds;
      const durationFormatted = `${Math.floor(totalSecs / 60).toString().padStart(2, '0')}:${(totalSecs % 60).toString().padStart(2, '0')}`;
      const timestampFormatted = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      let videoBlobUrl = '#';
      if (recordedChunksRef.current.length > 0) {
        const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        videoBlobUrl = URL.createObjectURL(videoBlob);

        // Auto trigger video file download
        const a = document.createElement('a');
        a.href = videoBlobUrl;
        a.download = `SSB-Live-Class-Recording-${new Date().toISOString().substring(0, 10)}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      await saveSessionRecording({
        id: Math.random().toString(36).substring(2, 9),
        room_code: meetingCode.replace(/\s+/g, ''),
        topic,
        mentor_name: mentor,
        candidate_name: candidateName,
        duration_seconds: totalSecs,
        recorded_at: new Date().toISOString(),
        recording_url: videoBlobUrl,
        notes: `SSB Psychological Assessment and Real Screen Share Review.`
      });

      setSavedRecordSummary({ duration: durationFormatted, timestamp: timestampFormatted, url: videoBlobUrl });
      setRecordingSavedModal(true);
    }
  };

  useEffect(() => {
    let t: any = null;
    if (isRecording) {
      t = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(t);
  }, [isRecording]);

  // ──────────────────────────────────────────────────────────
  // 5. TACTICAL DRILL TIMERS (TAT & WAT)
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    let t: any = null;
    if (activeSideDrawer === 'drills' && activeDrillTab === 'tat') {
      t = setInterval(() => {
        setTatTimer(prev => {
          if (prev <= 1) {
            setTatPhase(prevPhase => (prevPhase === 'observe' ? 'write' : 'observe'));
            return tatPhase === 'observe' ? 240 : 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
  }, [activeSideDrawer, activeDrillTab, tatPhase]);

  useEffect(() => {
    let t: any = null;
    if (activeSideDrawer === 'drills' && activeDrillTab === 'wat') {
      t = setInterval(() => {
        setWatTimer(prev => {
          if (prev <= 1) {
            setWatIndex(idx => (idx + 1) % watList.length);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(t);
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
  // 6. INTELLIGENT ASSESSOR SPEECH & REAL RESPONSES
  // ──────────────────────────────────────────────────────────
  const speakAssessor = (text: string) => {
    if (!voiceAssessorEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;
      setIsMentorSpeaking(true);
      utterance.onend = () => setIsMentorSpeaking(false);
      utterance.onerror = () => setIsMentorSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {}
  };

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
      speakAssessor(`Chest 24, go ahead. State your deduction for this psychological stimulus.`);
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            sender: mentor,
            text: `Chest 24 (${candidateName}), unmuting approved. State your deduction for this psychological stimulus.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
            chest: 'Assessor (AIR 34)'
          }
        ]);
      }, 800);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages(prev => [
      ...prev,
      {
        sender: candidateName,
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        chest: 'Chest 24'
      }
    ]);
    setChatInput('');

    // Simulated Real-Time Assessor reply
    setTimeout(() => {
      let reply = `Good observation, Chest 24. Ensure your story shows concrete constructive action and natural team leadership rather than pretense.`;
      if (userText.toLowerCase().includes('wat') || userText.toLowerCase().includes('word')) {
        reply = `In WAT, avoid pre-learned generic moral quotes. Formulate an active, OLQ-driven personal reaction showing initiative.`;
      } else if (userText.toLowerCase().includes('tat') || userText.toLowerCase().includes('story')) {
        reply = `For this TAT card, establish: 1) What led to the event, 2) The hero's immediate plan, 3) The positive outcome.`;
      } else if (userText.toLowerCase().includes('interview') || userText.toLowerCase().includes('piq')) {
        reply = `Cross-examination in the interview verifies authenticity between your PIQ claims and your genuine everyday routine.`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: mentor,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          chest: 'Assessor (AIR 34)'
        }
      ]);
      speakAssessor(reply);
    }, 1500);
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
    <div className="fixed inset-0 z-[100] bg-[#070A11] text-gray-100 flex flex-col justify-between overflow-hidden select-none font-sans antialiased">

      {/* ── 1. COMMAND HEADER RIBBON (48px) ── */}
      <header className="h-12 px-3 sm:px-6 bg-[#0B101C] border-b border-[#1A2538] flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Live Beacon & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-heading font-black text-xs sm:text-sm tracking-wider text-brand-gold uppercase">
              SSB BRO LIVE STUDIO
            </span>
          </div>

          <span className="text-gray-600 hidden md:inline">|</span>

          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-300">
            <span className="font-medium text-white truncate max-w-xs">{topic}</span>
            <span className="px-2 py-0.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-[10px] font-mono text-brand-gold">
              Lt. Vamshi E. (AIR 34 CDS 2)
            </span>
          </div>

          {/* Recording Badge */}
          {isRecording && (
            <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-950/90 border border-red-500 text-[11px] font-mono text-red-300 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="font-bold">REC</span>
              <span>{`${Math.floor(recordSeconds / 60).toString().padStart(2, '0')}:${(recordSeconds % 60).toString().padStart(2, '0')}`}</span>
            </div>
          )}
        </div>

        {/* Center: Meeting Code Pill (1-Click Copy) */}
        <button
          onClick={() => setShowInviteModal(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#121B2C] hover:bg-[#1A2740] border border-[#253554] text-xs font-mono text-gray-200 transition-colors shadow-sm"
          title="Click to copy invitation details"
        >
          <span className="text-brand-steelLight">CODE:</span>
          <span className="font-bold text-brand-gold tracking-wide">{meetingCode}</span>
          <Copy className="w-3 h-3 text-gray-400" />
        </button>

        {/* Right: Layout Switcher + Fullscreen + Audio Toggle + Leave */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Assessor Voice Speech Toggle */}
          <button
            onClick={() => setVoiceAssessorEnabled(!voiceAssessorEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              voiceAssessorEnabled 
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                : 'bg-[#121B2C] border-gray-700 text-gray-400'
            }`}
            title={voiceAssessorEnabled ? 'Assessor Voice Audio Active' : 'Assessor Voice Muted'}
          >
            {voiceAssessorEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Segmented Layout Switcher (Speaker vs Gallery) */}
          <div className="bg-[#121B2C] p-0.5 rounded-lg border border-[#253554] flex items-center text-xs">
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

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-[#121B2C] hover:bg-[#1A2740] text-gray-300 hover:text-white border border-[#253554] transition-colors"
            title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-brand-gold" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Leave Session */}
          <button
            onClick={handleLeaveClass}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow-md"
          >
            Leave
          </button>
        </div>
      </header>

      {/* ── 2. CENTRAL HIGH-DEFINITION VIDEO STAGE ── */}
      <main className="flex-1 relative bg-[#05080E] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        
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

        {/* Share Error Alert Banner */}
        {shareError && (
          <div className="absolute top-4 z-50 bg-red-950/90 border border-red-500 text-red-200 px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-2xl animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{shareError}</span>
            <button onClick={() => setShareError(null)} className="ml-2 hover:text-white font-bold">×</button>
          </div>
        )}

        {/* ── SCENARIO A: REAL SCREEN SHARING ACTIVE ── */}
        {isSharingScreen ? (
          <div className="relative w-full h-full max-w-7xl rounded-2xl overflow-hidden bg-black border-2 border-emerald-500/80 shadow-2xl flex flex-col">
            
            {/* Screen Share Status Bar */}
            <div className="h-10 px-4 bg-emerald-950/90 border-b border-emerald-500/40 flex items-center justify-between text-xs text-emerald-200 shrink-0 z-10">
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>You are sharing your live screen / window / tab via native display capture</span>
              </div>
              <button
                onClick={stopScreenShare}
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow"
              >
                Stop Sharing
              </button>
            </div>

            {/* Real Screen Video Canvas (Muted to ensure 100% Autoplay compliance) */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden p-1 sm:p-2">
              <video
                ref={screenVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-contain rounded-lg bg-black"
              />
            </div>

            {/* Corner PIP of Mentor while screen is shared */}
            <div className="absolute bottom-4 right-4 w-44 sm:w-56 aspect-video rounded-xl overflow-hidden border-2 border-brand-gold/80 shadow-2xl bg-[#0B101D] z-20">
              <img
                src="/images/mentor-portrait.jpg"
                alt="Lt. Vamshi E."
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-1 left-2 bg-black/85 px-2 py-0.5 rounded text-[10px] font-mono text-white flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isMentorSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'}`} />
                <span>{mentor} (Assessor)</span>
              </div>
            </div>
          </div>
        ) : viewMode === 'speaker' ? (
          /* ── SCENARIO B: SPEAKER VIEW (MENTOR SPOTLIGHT + REAL ASPIRANT WEBCAM PIP) ── */
          <div className="relative w-full h-full max-w-6xl rounded-2xl overflow-hidden bg-[#0C121E] border border-[#1A2538] shadow-2xl flex items-center justify-center">
            
            {/* Mentor Spotlight Visual */}
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[#111927] via-[#0C121E] to-[#070B12]">
              <img
                src="/images/mentor-portrait.jpg"
                alt="Lt. Vamshi E."
                className="w-full h-full object-cover md:object-contain object-top brightness-95 filter"
              />

              {/* Active Speaker Border Glow */}
              <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
                isMentorSpeaking ? 'border-4 border-emerald-500/70 shadow-[inset_0_0_40px_rgba(16,185,129,0.3)]' : 'border border-white/5'
              }`} />

              {/* Mentor Active Speaker Badge */}
              <div className="absolute bottom-4 left-4 bg-[#0A0F1C]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-brand-gold/40 shadow-2xl flex items-center gap-3">
                <div className="relative">
                  <span className={`w-3 h-3 rounded-full ${isMentorSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'} inline-block absolute`} />
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
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-36 sm:w-56 aspect-[3/4] sm:aspect-video rounded-xl overflow-hidden bg-[#121B2C] border-2 border-brand-gold/70 shadow-2xl flex flex-col justify-end z-20">
              
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
                  {activeReaction && (
                    <div className="absolute top-2 right-2 text-2xl bg-black/70 backdrop-blur-sm rounded-full w-9 h-9 flex items-center justify-center border border-white/20 animate-bounce">
                      {activeReaction}
                    </div>
                  )}
                </div>
              ) : (
                /* Avatar Fallback */
                <div className="w-full h-full bg-[#0D1524] flex flex-col items-center justify-center relative">
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

              {/* Dynamic Sound-Wave Bar Visualizer & Nameplate */}
              <div className="p-2 bg-[#0A0E1A]/95 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  {handRaised && <span className="text-yellow-400">✋</span>}
                  <span className="text-white font-semibold truncate">{candidateName} (You)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {!isMuted && audioLevel > 5 ? (
                    <div className="flex items-end gap-0.5 h-3">
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${Math.max(20, audioLevel)}%` }} />
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${Math.max(45, audioLevel * 0.9)}%` }} />
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
            <div className="relative rounded-2xl overflow-hidden bg-[#0F1726] border-2 border-emerald-500/60 shadow-2xl flex items-center justify-center">
              <img
                src="/images/mentor-portrait.jpg"
                alt="Lt. Vamshi E."
                className="w-full h-full object-cover object-top brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 bg-[#0A0E1A]/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-sans text-white flex items-center gap-2 border border-brand-gold/30">
                <span className={`w-2.5 h-2.5 rounded-full ${isMentorSpeaking ? 'bg-emerald-400 animate-ping' : 'bg-emerald-400'}`} />
                <span className="font-semibold">{mentor}</span>
                <span className="text-[10px] text-brand-gold font-mono">(Host · AIR 34)</span>
              </div>
            </div>

            {/* Tile 2: Arjun Sharma (Me) with REAL WEBCAM */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0F1726] border border-brand-gold/60 shadow-2xl flex flex-col justify-end">
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
                <div className="w-full h-full bg-[#080D16] flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xl shadow-xl mb-2">
                    AS
                  </div>
                  <span className="text-xs text-gray-400 font-mono">Camera Off</span>
                </div>
              )}

              <div className="p-3 bg-[#0A0E1A]/90 backdrop-blur-md text-xs font-sans text-gray-200 flex items-center justify-between border-t border-white/10">
                <span className="font-semibold flex items-center gap-1.5">
                  {handRaised && <span className="text-yellow-400">✋</span>}
                  {candidateName} (Chest 24 · You)
                </span>
                <div className="flex items-center gap-2">
                  {!isMuted && audioLevel > 5 ? (
                    <div className="flex items-end gap-0.5 h-3.5">
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${Math.max(20, audioLevel)}%` }} />
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse" style={{ height: `${Math.max(45, audioLevel * 0.9)}%` }} />
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
            <div className="relative rounded-2xl overflow-hidden bg-[#0F1726] border border-white/10 shadow-2xl flex flex-col justify-end">
              <div className="w-full h-full bg-[#080D16] flex flex-col items-center justify-center text-gray-300">
                <div className="w-16 h-16 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-xl shadow-xl mb-2">
                  PN
                </div>
                <span className="text-xs text-gray-400 font-mono">Priya Nair · Chest 09</span>
              </div>
              <div className="p-3 bg-[#0A0E1A]/90 text-xs font-sans text-gray-200 flex items-center justify-between border-t border-white/10">
                <span className="font-semibold">Priya Nair (Chest 09)</span>
                <div className="flex items-center gap-2">
                  <MicOff className="w-4 h-4 text-red-500" />
                  <Video className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Tile 4: Rohit Verma (Aspirant Peer) */}
            <div className="relative rounded-2xl overflow-hidden bg-[#0F1726] border border-white/10 shadow-2xl flex flex-col justify-end">
              <div className="w-full h-full bg-[#080D16] flex flex-col items-center justify-center text-gray-300">
                <div className="w-16 h-16 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xl shadow-xl mb-2">
                  RV
                </div>
                <span className="text-xs text-gray-400 font-mono">Rohit Verma · Chest 18</span>
              </div>
              <div className="p-3 bg-[#0A0E1A]/90 text-xs font-sans text-gray-200 flex items-center justify-between border-t border-white/10">
                <span className="font-semibold">Rohit Verma (Chest 18)</span>
                <div className="flex items-center gap-2">
                  <MicOff className="w-4 h-4 text-red-500" />
                  <VideoOff className="w-4 h-4 text-red-500" />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── 3. COLLAPSIBLE RIGHT-SIDE DRAWERS ── */}
        
        {/* DRAWER 1: IN-CALL CHAT & REAL-TIME ASSESSOR REPLIES */}
        {activeSideDrawer === 'chat' && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-[#0B101C] border-l border-[#1A2538] flex flex-col z-30 shadow-2xl animate-fadeIn">
            <div className="h-12 px-4 border-b border-[#1A2538] flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-brand-gold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Live Mentorship Chat
              </span>
              <button onClick={() => setActiveSideDrawer('none')} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`p-3 rounded-xl border ${m.isMe ? 'bg-[#152033] border-[#253554] ml-6' : 'bg-[#0E1524] border-[#1A2538] mr-6'}`}>
                  <div className="flex items-center justify-between text-[10px] text-brand-steelLight font-mono mb-1">
                    <span className="font-bold text-brand-gold">{m.sender} {m.chest && `(${m.chest})`}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="leading-relaxed text-gray-200">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#1A2538] flex gap-2 bg-[#080D16]">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask Lt. Vamshi E. (Assessor)..."
                className="flex-1 bg-[#121B2C] border border-[#202E48] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
              />
              <button type="submit" className="px-3.5 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-bold text-xs transition-colors shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* DRAWER 2: ATTENDEES DIRECTORY */}
        {activeSideDrawer === 'participants' && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-[#0B101C] border-l border-[#1A2538] flex flex-col z-30 shadow-2xl animate-fadeIn">
            <div className="h-12 px-4 border-b border-[#1A2538] flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-brand-gold flex items-center gap-2">
                <Users className="w-4 h-4" /> Studio Attendees (4)
              </span>
              <button onClick={() => setActiveSideDrawer('none')} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs flex-1 overflow-y-auto">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0E1524] border border-brand-gold/30">
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

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#152033] border border-brand-gold/50">
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

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0E1524] border border-[#1A2538]">
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

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0E1524] border border-[#1A2538]">
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
                <LinkIcon className="w-3.5 h-3.5" /> Invite Candidates via Link
              </button>
            </div>
          </div>
        )}

        {/* DRAWER 3: TACTICAL SSB ASSESSMENT SUITE (TAT, WAT, PIQ) */}
        {activeSideDrawer === 'drills' && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-[440px] bg-[#0B101C] border-l border-[#1A2538] flex flex-col z-30 shadow-2xl animate-fadeIn">
            <div className="h-12 px-4 border-b border-[#1A2538] flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-brand-gold flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-gold" /> Tactical Assessment Suite
              </span>
              <button onClick={() => setActiveSideDrawer('none')} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 p-2 bg-[#080D16] border-b border-[#1A2538] text-xs font-mono">
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

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              {activeDrillTab === 'tat' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#121B2C] border border-brand-gold/30 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-brand-steelLight font-mono uppercase">Phase Status</span>
                      <p className="font-bold text-white text-sm">
                        {tatPhase === 'observe' ? '30s Picture Observation' : '4-Minute Story Formulation'}
                      </p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-lg font-bold text-brand-gold">{tatTimer}s</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold block">Candidate Story Formulation (Chest 24):</label>
                    <textarea
                      rows={7}
                      value={candidateTatStory}
                      onChange={(e) => setCandidateTatStory(e.target.value)}
                      placeholder="Identify main hero, past situation leading to crisis, concrete action taken, and positive outcome..."
                      className="w-full bg-[#0E1524] border border-[#1E2B42] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-xs leading-relaxed"
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

              {activeDrillTab === 'wat' && (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#121B2C] border-2 border-brand-gold/60 text-center space-y-3 shadow-xl">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Flash Word ({watIndex + 1}/7)</span>
                    <h3 className="text-3xl font-black font-mono tracking-wider text-brand-gold">{watList[watIndex]}</h3>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-brand-gold h-full transition-all duration-1000" style={{ width: `${(watTimer / 15) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">{watTimer}s remaining</span>
                  </div>

                  <form onSubmit={handleSaveWatSentence} className="space-y-2">
                    <label className="text-gray-300 font-semibold block">Spontaneous Association:</label>
                    <input
                      value={candidateWatSentence}
                      onChange={(e) => setCandidateWatSentence(e.target.value)}
                      placeholder="Type active, authentic reaction sentence..."
                      className="w-full bg-[#0E1524] border border-[#1E2B42] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-xs"
                    />
                    <button
                      type="submit"
                      disabled={!candidateWatSentence.trim()}
                      className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-bold text-xs disabled:opacity-50 transition-colors shadow"
                    >
                      Save Sentence & Next Word
                    </button>
                  </form>
                </div>
              )}

              {activeDrillTab === 'piq' && (
                <div className="space-y-3 font-mono text-[11px]">
                  <div className="p-3 rounded-xl bg-[#121B2C] border border-[#202E48] space-y-2">
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

        {/* ── REACTIONS DOCK ── */}
        {showReactionsTray && (
          <div className="absolute bottom-20 right-4 sm:right-32 w-72 bg-[#0E1524] border border-[#253554] rounded-2xl p-4 shadow-2xl z-40 text-white animate-fadeIn">
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
                  : 'bg-[#182338] hover:bg-[#202E48] text-white border border-[#2D3E5D]'
              }`}
            >
              <Hand className={`w-4 h-4 ${handRaised ? 'fill-black' : ''}`} />
              <span>{handRaised ? 'Lower Hand (Chest 24)' : 'Raise Hand (Chest 24)'}</span>
            </button>
          </div>
        )}

      </main>

      {/* ── 4. MODERN ARRANGEABLE BOTTOM CONTROL DECK ── */}
      <footer className="h-16 px-3 sm:px-8 bg-[#0B101C] border-t border-[#1A2538] flex items-center justify-between shrink-0 z-30">
        
        {/* ISLAND 1: AUDIO / VIDEO CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#111A2C] px-2.5 py-1.5 rounded-2xl border border-[#1E2B42]">
          
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
            <span className="hidden sm:inline">{isMuted ? 'Unmute' : 'Mute'}</span>
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

        {/* ISLAND 2: REAL SCREEN SHARE & RECORD & DRILLS */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#111A2C] px-2.5 py-1.5 rounded-2xl border border-[#1E2B42]">
          
          {/* Real Native Screen Share (Direct 1-Click Launch) */}
          <button
            onClick={() => {
              if (isSharingScreen) {
                stopScreenShare();
              } else {
                startRealScreenShare();
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isSharingScreen
                ? 'bg-emerald-600 text-white shadow-lg animate-pulse'
                : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30'
            }`}
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">{isSharingScreen ? 'Stop Screen Share' : 'Share Screen'}</span>
          </button>

          {/* Real Video Recording */}
          <button
            onClick={toggleRecording}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isRecording
                ? 'bg-red-600 text-white shadow-lg animate-pulse'
                : 'text-gray-200 hover:bg-[#1A263D]'
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
        <div className="flex items-center gap-2 sm:gap-3 bg-[#111A2C] px-2.5 py-1.5 rounded-2xl border border-[#1E2B42]">
          
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

      {/* ── 5. INVITE ASPIRANTS MODAL ── */}
      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-[#0F1726] border border-[#253554] max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1E2B42] pb-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-brand-gold" />
                <h3 className="font-heading font-bold text-base text-white">Invite Aspirants to Live Studio</h3>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#090E18] border border-[#1A2538] space-y-1">
                <p className="text-[10px] font-mono uppercase text-brand-gold font-semibold">Active Session Topic</p>
                <p className="text-sm font-semibold text-white">{topic}</p>
                <p className="text-xs text-brand-steelLight font-mono">Assessor: {mentor} · AIR 34</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121B2C] border border-[#1E2B42]">
                <div>
                  <p className="text-[10px] text-gray-400 font-mono uppercase">Meeting ID / Code</p>
                  <p className="text-base font-mono font-bold text-brand-gold tracking-wider">{meetingCode}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(meetingCode, 'code')}
                  className="px-3 py-1.5 rounded-lg bg-[#1A263D] hover:bg-[#23334F] text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'code' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#121B2C] border border-[#1E2B42]">
                <div>
                  <p className="text-[10px] text-gray-400 font-mono uppercase">Security Passcode</p>
                  <p className="text-sm font-mono font-bold text-white tracking-wider">{passcode}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(passcode, 'passcode')}
                  className="px-3 py-1.5 rounded-lg bg-[#1A263D] hover:bg-[#23334F] text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'passcode' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'passcode' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 font-mono uppercase">Direct Join Link</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-[#090E18] border border-[#1E2B42] rounded-lg px-3 py-2 text-xs font-mono text-gray-300 truncate focus:outline-none"
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
          </div>
        </div>
      )}

      {/* ── 6. RECORDING SAVED & DOWNLOAD MODAL ── */}
      {recordingSavedModal && savedRecordSummary && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setRecordingSavedModal(false)}
        >
          <div
            className="bg-[#0F1726] border border-emerald-500/60 max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-white">Live Class Recording Saved!</h3>
              <p className="text-xs text-gray-400 mt-1">
                Your video session was recorded live, downloaded to your computer, and archived in your Student Dossier.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090E18] border border-[#1E2B42] text-left text-xs font-mono space-y-1.5">
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
                className="flex-1 py-2.5 rounded-xl bg-[#1A263D] hover:bg-[#23334F] text-gray-200 text-xs font-semibold"
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
                View in Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
