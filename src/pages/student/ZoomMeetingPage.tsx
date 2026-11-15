import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, Mic, MicOff, Video, VideoOff, 
  Share2, Users, MessageSquare, Hand, X, Send, 
  Smile, LayoutGrid, Maximize, Minimize, Check, 
  ChevronDown, UserCheck, Monitor, Disc, Pause, 
  Play, Copy, Link as LinkIcon, Download, Clock, 
  FileText, Sparkles, ExternalLink, HelpCircle,
  MoreHorizontal, PhoneOff, AlertCircle, Camera, 
  Target, Award, Radio
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

  // Hardware states
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // View & UI states
  const [viewMode, setViewMode] = useState<'speaker' | 'gallery'>('speaker');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'chat' | 'participants' | 'drills'>('none');
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [showMobileMoreSheet, setShowMobileMoreSheet] = useState(false);
  const [showShareOptionsModal, setShowShareOptionsModal] = useState(false);

  // Media Streams
  const userMediaStreamRef = useRef<MediaStream | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const userGalleryVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Screen Share (Real Browser or Interactive Presentations)
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenShareType, setScreenShareType] = useState<'native' | 'tat' | 'wat' | 'piq'>('native');
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);

  // Recording
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [recordingSavedModal, setRecordingSavedModal] = useState(false);
  const [savedRecordSummary, setSavedRecordSummary] = useState<{ duration: string; timestamp: string } | null>(null);

  // Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Floating Reactions
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const reactionCounterRef = useRef(0);

  // Drills States
  const [drillTab, setDrillTab] = useState<'tat' | 'wat' | 'piq'>('tat');
  const [tatCountdown, setTatCountdown] = useState(30);
  const [tatPhase, setTatPhase] = useState<'observe' | 'write'>('observe');
  const [candidateStory, setCandidateStory] = useState('');
  const [watIndex, setWatIndex] = useState(0);
  const [watTimer, setWatTimer] = useState(15);
  const [watInput, setWatInput] = useState('');
  const [watHistory, setWatHistory] = useState<Array<{ word: string; sentence: string }>>([]);

  const watWords = ['LEADERSHIP', 'OBSTACLE', 'COURAGE', 'INITIATIVE', 'INTEGRITY', 'SACRIFICE', 'RESPONSIBILITY'];

  // Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; isMe: boolean; tag?: string }>>([
    { sender: mentor, text: `Welcome ${candidateName}. We will begin with your TAT psychological deduction. Keep your microphone unmuted when presenting.`, time: '18:00', isMe: false, tag: 'Host' },
    { sender: 'Priya Nair', text: 'Good evening Sir. Video and audio feed connected.', time: '18:01', isMe: false, tag: 'Chest 09' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // ──────────────────────────────────────────────────────────
  // 1. HARDWARE WEBCAM & MIC INITIALIZATION
  // ──────────────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);

    const initDevices = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: true
          });
          userMediaStreamRef.current = stream;

          if (userVideoRef.current) userVideoRef.current.srcObject = stream;
          if (userGalleryVideoRef.current) userGalleryVideoRef.current.srcObject = stream;

          try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
              const ctx = new AudioContextClass();
              audioContextRef.current = ctx;
              const source = ctx.createMediaStreamSource(stream);
              const analyser = ctx.createAnalyser();
              analyser.fftSize = 64;
              source.connect(analyser);
              analyserRef.current = analyser;

              const dataArray = new Uint8Array(analyser.frequencyBinCount);
              const loop = () => {
                if (analyserRef.current && !isMuted) {
                  analyserRef.current.getByteFrequencyData(dataArray);
                  let sum = 0;
                  for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
                  const avg = sum / dataArray.length;
                  setAudioLevel(Math.min(100, Math.round(avg * 1.5)));
                } else {
                  setAudioLevel(0);
                }
                animFrameRef.current = requestAnimationFrame(loop);
              };
              loop();
            }
          } catch {}
        }
      } catch (err) {
        console.warn('Camera/mic access not granted:', err);
      }
    };

    initDevices();

    const handleFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close().catch(() => {});
      if (userMediaStreamRef.current) userMediaStreamRef.current.getTracks().forEach(t => t.stop());
      if (screenStream) screenStream.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Sync streams when views update
  useEffect(() => {
    if (userMediaStreamRef.current) {
      if (userVideoRef.current) userVideoRef.current.srcObject = userMediaStreamRef.current;
      if (userGalleryVideoRef.current) userGalleryVideoRef.current.srcObject = userMediaStreamRef.current;
    }
  }, [viewMode, isVideoOff]);

  useEffect(() => {
    if (screenVideoRef.current && screenStream && screenShareType === 'native') {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.play().catch(() => {});
    }
  }, [screenStream, isSharingScreen, screenShareType]);

  // Hardware toggles
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (userMediaStreamRef.current) {
      userMediaStreamRef.current.getAudioTracks().forEach(t => (t.enabled = !next));
    }
  };

  const toggleVideo = async () => {
    const next = !isVideoOff;
    setIsVideoOff(next);
    if (userMediaStreamRef.current) {
      userMediaStreamRef.current.getVideoTracks().forEach(t => (t.enabled = !next));
    } else if (!next) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        userMediaStreamRef.current = stream;
        if (userVideoRef.current) userVideoRef.current.srcObject = stream;
        if (userGalleryVideoRef.current) userGalleryVideoRef.current.srcObject = stream;
      } catch {}
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {}
  };

  // ──────────────────────────────────────────────────────────
  // 2. SCREEN SHARE CONTROLS (NATIVE & INTERACTIVE DECKS)
  // ──────────────────────────────────────────────────────────
  const startNativeScreenShare = async () => {
    setShowShareOptionsModal(false);
    setShowMobileMoreSheet(false);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        setScreenShareType('native');
        setIsSharingScreen(true);

        const track = stream.getVideoTracks()[0];
        if (track) {
          track.onended = () => stopScreenShare();
        }

        setTimeout(() => {
          if (screenVideoRef.current) {
            screenVideoRef.current.srcObject = stream;
            screenVideoRef.current.play().catch(() => {});
          }
        }, 150);
      } else {
        // Fallback to interactive slide deck if browser blocks getDisplayMedia on mobile
        startDeckPresentation('tat');
      }
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') {
        startDeckPresentation('tat');
      }
    }
  };

  const startDeckPresentation = (type: 'tat' | 'wat' | 'piq') => {
    setShowShareOptionsModal(false);
    setShowMobileMoreSheet(false);
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
    setScreenShareType(type);
    setIsSharingScreen(true);
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
    setIsSharingScreen(false);
  };

  // ──────────────────────────────────────────────────────────
  // 3. RECORDING
  // ──────────────────────────────────────────────────────────
  const toggleRecording = async () => {
    setShowMobileMoreSheet(false);
    if (!isRecording) {
      recordedChunksRef.current = [];
      try {
        let stream = screenStream || userMediaStreamRef.current;
        if (!stream) {
          const canvas = document.createElement('canvas');
          canvas.width = 640;
          canvas.height = 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#1A1A1A';
            ctx.fillRect(0, 0, 640, 360);
            ctx.fillStyle = '#E6B980';
            ctx.font = '20px sans-serif';
            ctx.fillText('SSB BRO Live Mentorship Studio', 40, 180);
          }
          stream = (canvas as any).captureStream ? (canvas as any).captureStream(15) : null;
        }

        if (stream && typeof MediaRecorder !== 'undefined') {
          const recorder = new MediaRecorder(stream, {
            mimeType: MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : ''
          });
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
          };
          recorder.start(1000);
          mediaRecorderRef.current = recorder;
        }
      } catch {}

      setIsRecording(true);
      setRecordSeconds(0);
    } else {
      setIsRecording(false);
      const totalSecs = recordSeconds;
      const duration = `${Math.floor(totalSecs / 60).toString().padStart(2, '0')}:${(totalSecs % 60).toString().padStart(2, '0')}`;
      const timestamp = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      let url = '#';
      if (recordedChunksRef.current.length > 0) {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SSB-Live-Class-${new Date().toISOString().substring(0, 10)}.webm`;
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
        recording_url: url
      });

      setSavedRecordSummary({ duration, timestamp });
      setRecordingSavedModal(true);
    }
  };

  useEffect(() => {
    let t: any = null;
    if (isRecording) t = setInterval(() => setRecordSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [isRecording]);

  // Reactions
  const triggerReaction = (emoji: string) => {
    setShowReactionsMenu(false);
    setShowMobileMoreSheet(false);
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
    setShowReactionsMenu(false);
    setShowMobileMoreSheet(false);
    const next = !handRaised;
    setHandRaised(next);
    if (next) {
      triggerReaction('✋');
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            sender: mentor,
            text: `Chest 24 (${candidateName}), unmuting approved. Please state your deduction.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
            tag: 'Host'
          }
        ]);
      }, 1000);
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
        tag: 'You'
      }
    ]);
    setChatInput('');
  };

  const handleLeave = () => {
    if (userMediaStreamRef.current) userMediaStreamRef.current.getTracks().forEach(t => t.stop());
    if (screenStream) screenStream.getTracks().forEach(t => t.stop());
    navigate('/student/sessions');
  };

  const shareUrl = `${window.location.origin}/student/live-meeting?code=${meetingCode.replace(/\s+/g, '')}&passcode=${passcode}&topic=${encodeURIComponent(topic)}`;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0F0F0F] text-white flex flex-col justify-between overflow-hidden select-none font-sans">

      {/* ── 1. RESPONSIVE ZOOM-STYLE TOP NAVIGATION (44px) ── */}
      <header className="h-11 px-3 sm:px-4 bg-[#181818] border-b border-[#262626] flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Live Indicator & Meeting ID Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-xs tracking-wide text-gray-200 hidden sm:inline">
              Live Mentorship
            </span>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#242424] hover:bg-[#303030] text-gray-300 text-xs font-mono transition-colors"
          >
            <span className="text-gray-400 text-[10px]">ID:</span>
            <span className="font-semibold text-brand-gold text-xs">{meetingCode}</span>
            <Copy className="w-3 h-3 text-gray-400" />
          </button>

          {isRecording && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500 text-[10px] font-mono text-red-300">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              <span>REC</span>
            </div>
          )}
        </div>

        {/* Center: Topic (Desktop) */}
        <span className="text-xs text-gray-400 hidden lg:inline truncate max-w-xs">
          {topic}
        </span>

        {/* Right: View Mode Toggle & End Call Button */}
        <div className="flex items-center gap-2">
          
          {/* View Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'speaker' ? 'gallery' : 'speaker')}
            className="px-2 py-1 rounded-md bg-[#242424] hover:bg-[#303030] text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Toggle Speaker / Gallery View"
          >
            {viewMode === 'speaker' ? <LayoutGrid className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{viewMode === 'speaker' ? 'Gallery' : 'Speaker'}</span>
          </button>

          {/* Fullscreen (Desktop) */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-1.5 rounded-md bg-[#242424] hover:bg-[#303030] text-gray-300 transition-colors"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          {/* Red End Call Button (Always accessible at top right on Mobile & Desktop) */}
          <button
            onClick={handleLeave}
            className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center gap-1"
          >
            <span>End</span>
          </button>
        </div>
      </header>

      {/* ── 2. CENTRAL VIDEO STAGE + MOBILE/DESKTOP SLIDE DRAWER ── */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Main Video Viewport (Edge-to-Edge) */}
        <main className="flex-1 relative bg-black flex items-center justify-center p-1 sm:p-3 overflow-hidden">
          
          {/* Floating Reaction Particles */}
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

          {/* ── A: ACTIVE SCREEN SHARING VIEW (MOBILE & DESKTOP) ── */}
          {isSharingScreen ? (
            <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#262626] shadow-2xl flex flex-col">
              
              {/* Screen Share Status Bar */}
              <div className="h-8 sm:h-9 px-3 bg-[#181818] border-b border-[#2A2A2A] flex items-center justify-between text-xs text-emerald-400 shrink-0 z-10">
                <div className="flex items-center gap-1.5 font-medium truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate">
                    {screenShareType === 'native' && 'Live Screen Broadcast'}
                    {screenShareType === 'tat' && 'TAT Psychological Slide Deck'}
                    {screenShareType === 'wat' && 'WAT 15s Rapid Flashcard Battery'}
                    {screenShareType === 'piq' && 'PIQ Candidate Dossier Audit'}
                  </span>
                </div>
                <button
                  onClick={stopScreenShare}
                  className="px-2.5 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] shrink-0"
                >
                  Stop Share
                </button>
              </div>

              {/* Screen Content Stage */}
              <div className="flex-1 relative bg-black flex items-center justify-center p-1 overflow-hidden">
                {screenShareType === 'native' ? (
                  <video
                    ref={screenVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-contain"
                  />
                ) : screenShareType === 'tat' ? (
                  <div className="w-full max-w-2xl h-full flex flex-col items-center justify-center text-center p-3">
                    <span className="text-[10px] font-mono text-brand-gold uppercase tracking-widest font-semibold mb-1">
                      Observation Phase (30s)
                    </span>
                    <div className="relative w-full aspect-[4/3] max-h-[60vh] rounded-xl overflow-hidden border border-white/20 bg-neutral-900 shadow-xl">
                      <img
                        src="/images/hero-defence.jpg"
                        alt="TAT Psychological Stimulus"
                        className="w-full h-full object-cover filter contrast-125 brightness-90 grayscale"
                      />
                    </div>
                    <p className="text-[11px] text-gray-300 mt-2 font-mono">
                      Formulate story: Past cause → Present action → Future resolution.
                    </p>
                  </div>
                ) : screenShareType === 'wat' ? (
                  <div className="w-full max-w-md p-6 rounded-2xl bg-[#181818] border border-brand-gold/50 text-center space-y-4 shadow-2xl">
                    <span className="text-[10px] font-mono text-gray-400">Word 1 of 7</span>
                    <h2 className="text-3xl sm:text-4xl font-black font-mono text-brand-gold tracking-widest">
                      LEADERSHIP
                    </h2>
                    <p className="text-xs text-gray-400 font-mono">Formulate an authentic, active, OLQ-aligned sentence.</p>
                  </div>
                ) : (
                  <div className="w-full max-w-lg p-4 rounded-xl bg-[#141414] border border-[#2D2D2D] text-left text-xs font-mono space-y-2">
                    <p className="font-bold text-brand-gold text-sm">CANDIDATE DOSSIER (PIQ)</p>
                    <p className="text-gray-300">Name: Arjun Sharma · Chest 24</p>
                    <p className="text-gray-300">Entry: CDS 2 2026 · IMA Preference</p>
                    <p className="text-emerald-400">Diagnostic: Physical transformation & OLQ consistency</p>
                  </div>
                )}
              </div>

              {/* Floating Speaker PIP (Corner overlay during share) */}
              <div className="absolute bottom-3 right-3 w-28 sm:w-44 aspect-video rounded-lg sm:rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-[#141414] z-20">
                <img
                  src="/images/mentor-portrait.jpg"
                  alt="Lt. Vamshi E."
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-1 left-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{mentor}</span>
                </div>
              </div>
            </div>
          ) : viewMode === 'speaker' ? (
            /* ── B: SPEAKER VIEW (MENTOR MAIN + CANDIDATE PIP) ── */
            <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#141414] border border-[#222] shadow-2xl flex items-center justify-center">
              
              {/* Mentor Video Feed */}
              <div className="relative w-full h-full flex items-center justify-center bg-[#111]">
                <img
                  src="/images/mentor-portrait.jpg"
                  alt="Lt. Vamshi E."
                  className="w-full h-full object-cover sm:object-contain object-top"
                />

                {/* Mentor Nameplate */}
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-medium text-white flex items-center gap-2 shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-xs">{mentor}</span>
                  <span className="text-[10px] px-1 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-mono hidden sm:inline">
                    Host · AIR 34
                  </span>
                </div>
              </div>

              {/* Candidate PIP (Top Right Corner - Compact on Mobile) */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 w-24 sm:w-48 aspect-[3/4] sm:aspect-video rounded-xl overflow-hidden bg-[#1E1E1E] border-2 border-[#333] shadow-2xl flex flex-col justify-end z-20">
                {!isVideoOff ? (
                  <div className="w-full h-full relative bg-black flex items-center justify-center">
                    <video
                      ref={userVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#181818] flex flex-col items-center justify-center text-gray-400">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow">
                      AS
                    </div>
                    <span className="text-[9px] text-gray-500 mt-0.5 font-mono">Off</span>
                  </div>
                )}

                {/* Candidate Nameplate */}
                <div className="p-1.5 bg-black/85 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-[10px]">
                  <span className="font-medium truncate">{candidateName.split(' ')[0]} (You)</span>
                  <div>
                    {!isMuted && audioLevel > 5 ? (
                      <div className="flex items-end gap-0.5 h-2.5">
                        <span className="w-1 bg-emerald-400 rounded-full" style={{ height: `${Math.max(25, audioLevel)}%` }} />
                        <span className="w-1 bg-emerald-400 rounded-full" style={{ height: `${Math.max(45, audioLevel * 0.8)}%` }} />
                      </div>
                    ) : isMuted ? (
                      <MicOff className="w-3 h-3 text-red-500" />
                    ) : (
                      <Mic className="w-3 h-3 text-emerald-400" />
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* ── C: GALLERY VIEW (CLEAN 2x2 GRID RESPONSIVE) ── */
            <div className="w-full h-full max-w-6xl grid grid-cols-2 gap-2 sm:gap-3 p-1">
              
              {/* Tile 1: Mentor */}
              <div className="relative rounded-xl overflow-hidden bg-[#141414] border border-[#252525] shadow-lg flex items-center justify-center">
                <img
                  src="/images/mentor-portrait.jpg"
                  alt="Lt. Vamshi E."
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[10px] font-medium text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="truncate">{mentor}</span>
                </div>
              </div>

              {/* Tile 2: Arjun Sharma (You) */}
              <div className="relative rounded-xl overflow-hidden bg-[#141414] border-2 border-brand-gold/60 shadow-lg flex flex-col justify-end">
                {!isVideoOff ? (
                  <div className="w-full h-full relative bg-black flex items-center justify-center">
                    <video
                      ref={userGalleryVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#181818] flex flex-col items-center justify-center text-gray-400">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-1">
                      AS
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">Camera Off</span>
                  </div>
                )}
                <div className="p-2 bg-black/85 text-[10px] font-medium text-white flex items-center justify-between border-t border-white/10">
                  <span className="truncate">{candidateName.split(' ')[0]} (You)</span>
                  <div className="flex items-center gap-1.5">
                    {isMuted ? <MicOff className="w-3 h-3 text-red-500" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                    {isVideoOff ? <VideoOff className="w-3 h-3 text-red-500" /> : <Video className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>
              </div>

              {/* Tile 3: Priya Nair */}
              <div className="relative rounded-xl overflow-hidden bg-[#141414] border border-[#252525] shadow-lg flex flex-col justify-end">
                <div className="w-full h-full bg-[#181818] flex flex-col items-center justify-center text-gray-400">
                  <div className="w-10 h-10 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-sm mb-1">
                    PN
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">Priya Nair</span>
                </div>
                <div className="p-2 bg-black/85 text-[10px] font-medium text-white flex items-center justify-between border-t border-white/10">
                  <span className="truncate">Priya (09)</span>
                  <MicOff className="w-3 h-3 text-red-500" />
                </div>
              </div>

              {/* Tile 4: Rohit Verma */}
              <div className="relative rounded-xl overflow-hidden bg-[#141414] border border-[#252525] shadow-lg flex flex-col justify-end">
                <div className="w-full h-full bg-[#181818] flex flex-col items-center justify-center text-gray-400">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-sm mb-1">
                    RV
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">Rohit Verma</span>
                </div>
                <div className="p-2 bg-black/85 text-[10px] font-medium text-white flex items-center justify-between border-t border-white/10">
                  <span className="truncate">Rohit (18)</span>
                  <MicOff className="w-3 h-3 text-red-500" />
                </div>
              </div>

            </div>
          )}

        </main>

        {/* ── 3. RESPONSIVE SIDE DRAWER (CHAT / ATTENDEES / DRILLS) ── */}
        {activeDrawer !== 'none' && (
          <aside className="fixed sm:static inset-0 sm:inset-auto sm:w-80 md:w-96 bg-[#161616] border-l border-[#262626] flex flex-col z-50 shadow-2xl">
            
            {/* Drawer Header Tabs */}
            <div className="h-12 px-3 border-b border-[#262626] flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setActiveDrawer('chat')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeDrawer === 'chat' ? 'bg-[#2A2A2A] text-white font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveDrawer('participants')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeDrawer === 'participants' ? 'bg-[#2A2A2A] text-white font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  People (4)
                </button>
                <button
                  onClick={() => setActiveDrawer('drills')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeDrawer === 'drills' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-brand-gold hover:text-white'
                  }`}
                >
                  SSB Drills
                </button>
              </div>

              <button 
                onClick={() => setActiveDrawer('none')} 
                className="p-1 rounded-md text-gray-400 hover:text-white bg-[#222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB: CHAT */}
            {activeDrawer === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 text-xs">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border ${m.isMe ? 'bg-[#222] border-[#333] ml-4' : 'bg-[#1A1A1A] border-[#2A2A2A] mr-4'}`}>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                        <span className="font-semibold text-white">{m.sender} {m.tag && `(${m.tag})`}</span>
                        <span>{m.time}</span>
                      </div>
                      <p className="text-gray-200 leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-[#262626] flex gap-2 bg-[#121212]">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 bg-[#1E1E1E] border border-[#303030] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
                  />
                  <button type="submit" className="px-3.5 py-2 rounded-lg bg-brand-gold text-brand-dark font-bold text-xs shrink-0">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB: PARTICIPANTS */}
            {activeDrawer === 'participants' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5 text-xs">
                {/* Mentor */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#202020] border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-dark font-bold flex items-center justify-center text-xs">
                      LV
                    </div>
                    <div>
                      <p className="font-semibold text-white">{mentor}</p>
                      <p className="text-[10px] text-gray-400">Host, Assessor · AIR 34</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Mic className="w-4 h-4" />
                    <Video className="w-4 h-4" />
                  </div>
                </div>

                {/* Candidate */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#202020] border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      AS
                    </div>
                    <div>
                      <p className="font-semibold text-white">{candidateName} (You)</p>
                      <p className="text-[10px] text-gray-400">Candidate · Chest 24</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {handRaised && <span className="text-yellow-400 text-xs">✋</span>}
                    {isMuted ? <MicOff className="w-4 h-4 text-red-500" /> : <Mic className="w-4 h-4 text-emerald-400" />}
                    {isVideoOff ? <VideoOff className="w-4 h-4 text-red-500" /> : <Video className="w-4 h-4 text-emerald-400" />}
                  </div>
                </div>

                {/* Priya */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#202020] border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-xs">
                      PN
                    </div>
                    <div>
                      <p className="font-semibold text-white">Priya Nair</p>
                      <p className="text-[10px] text-gray-400">Candidate · Chest 09</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MicOff className="w-4 h-4 text-red-500" />
                    <Video className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>

                {/* Rohit */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#202020] border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
                      RV
                    </div>
                    <div>
                      <p className="font-semibold text-white">Rohit Verma</p>
                      <p className="text-[10px] text-gray-400">Candidate · Chest 18</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MicOff className="w-4 h-4 text-red-500" />
                    <VideoOff className="w-4 h-4 text-red-500" />
                  </div>
                </div>

                <button
                  onClick={() => setShowInviteModal(true)}
                  className="w-full mt-4 py-2 rounded-xl bg-[#2A2A2A] hover:bg-[#333] text-brand-gold text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-brand-gold/30"
                >
                  <LinkIcon className="w-3.5 h-3.5" /> Invite Candidates via Link
                </button>
              </div>
            )}

            {/* TAB: SSB DRILLS */}
            {activeDrawer === 'drills' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="grid grid-cols-3 p-2 bg-[#121212] border-b border-[#262626] text-xs font-semibold">
                  <button
                    onClick={() => setDrillTab('tat')}
                    className={`py-1 rounded-md ${drillTab === 'tat' ? 'bg-brand-gold text-brand-dark' : 'text-gray-400 hover:text-white'}`}
                  >
                    TAT Drill
                  </button>
                  <button
                    onClick={() => setDrillTab('wat')}
                    className={`py-1 rounded-md ${drillTab === 'wat' ? 'bg-brand-gold text-brand-dark' : 'text-gray-400 hover:text-white'}`}
                  >
                    WAT Drill
                  </button>
                  <button
                    onClick={() => setDrillTab('piq')}
                    className={`py-1 rounded-md ${drillTab === 'piq' ? 'bg-brand-gold text-brand-dark' : 'text-gray-400 hover:text-white'}`}
                  >
                    PIQ Audit
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                  {drillTab === 'tat' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-[#202020] border border-[#333] flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-mono">Phase</span>
                          <p className="font-bold text-white">30s Observation Phase</p>
                        </div>
                        <span className="text-base font-bold text-brand-gold font-mono">{tatCountdown}s</span>
                      </div>

                      <div>
                        <label className="text-gray-300 font-medium block mb-1">Your Story Formulation:</label>
                        <textarea
                          rows={6}
                          value={candidateStory}
                          onChange={(e) => setCandidateStory(e.target.value)}
                          placeholder="Type main hero, background action, crisis resolution, and outcome..."
                          className="w-full bg-[#1E1E1E] border border-[#303030] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-xs leading-relaxed"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                          <span>Words: {candidateStory.trim() ? candidateStory.trim().split(/\s+/).length : 0}</span>
                          <span>Target: 100-120</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setChatMessages(prev => [
                            ...prev,
                            {
                              sender: candidateName,
                              text: `[TAT Story Submission]: ${candidateStory}`,
                              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              isMe: true,
                              tag: 'Chest 24'
                            }
                          ]);
                          setCandidateStory('');
                          setActiveDrawer('chat');
                        }}
                        disabled={!candidateStory.trim()}
                        className="w-full py-2.5 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-bold text-xs disabled:opacity-40 transition-colors shadow"
                      >
                        Submit to Assessor
                      </button>
                    </div>
                  )}

                  {drillTab === 'wat' && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-[#202020] border border-brand-gold/40 text-center space-y-2">
                        <span className="text-[10px] font-mono text-gray-400">Word ({watIndex + 1}/7)</span>
                        <h4 className="text-2xl font-black font-mono tracking-widest text-brand-gold">{watWords[watIndex]}</h4>
                        <span className="text-xs font-mono text-emerald-400">{watTimer}s</span>
                      </div>

                      <div className="space-y-2">
                        <input
                          value={watInput}
                          onChange={(e) => setWatInput(e.target.value)}
                          placeholder="Type active OLQ association sentence..."
                          className="w-full bg-[#1E1E1E] border border-[#303030] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
                        />
                        <button
                          onClick={() => {
                            if (!watInput.trim()) return;
                            setWatHistory(prev => [...prev, { word: watWords[watIndex], sentence: watInput.trim() }]);
                            setWatInput('');
                            setWatIndex(idx => (idx + 1) % watWords.length);
                            setWatTimer(15);
                          }}
                          disabled={!watInput.trim()}
                          className="w-full py-2 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs disabled:opacity-40"
                        >
                          Next Word
                        </button>
                      </div>
                    </div>
                  )}

                  {drillTab === 'piq' && (
                    <div className="p-3 rounded-xl bg-[#202020] border border-white/5 space-y-2 text-xs font-mono">
                      <span className="text-brand-gold font-bold block font-sans">Aspirant Dossier (Chest 24)</span>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white font-medium">{candidateName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-white/5">
                        <span className="text-gray-400">Entry:</span>
                        <span className="text-white">CDS 2 2026 (IMA Preference)</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400">Interview Focus:</span>
                        <span className="text-emerald-400">Self-Transformation & OLQs</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </aside>
        )}

      </div>

      {/* ── 4. MODERN RESPONSIVE CONTROLS DOCK ── */}
      <footer className="h-16 px-2 sm:px-6 bg-[#181818] border-t border-[#262626] flex items-center justify-between shrink-0 z-30">
        
        {/* Desktop Left Brand */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Mentorship Session</span>
        </div>

        {/* ── MOBILE 5-ICON DOCK (SCREEN WIDTH < 640px) ── */}
        <div className="flex sm:hidden items-center justify-around w-full">
          {/* 1. Mute */}
          <button
            onClick={toggleMute}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
              isMuted ? 'text-red-500' : 'text-gray-300'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-[10px] mt-0.5">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* 2. Video */}
          <button
            onClick={toggleVideo}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
              isVideoOff ? 'text-red-500' : 'text-gray-300'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            <span className="text-[10px] mt-0.5">{isVideoOff ? 'Start' : 'Stop'}</span>
          </button>

          {/* 3. Share Content (PROMINENT GREEN BUTTON ON MOBILE) */}
          <button
            onClick={() => {
              if (isSharingScreen) stopScreenShare();
              else setShowShareOptionsModal(true);
            }}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
              isSharingScreen ? 'text-emerald-400 font-bold' : 'text-emerald-500'
            }`}
          >
            <Share2 className={`w-5 h-5 ${isSharingScreen ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] mt-0.5">{isSharingScreen ? 'Stop' : 'Share'}</span>
          </button>

          {/* 4. Chat */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'chat' ? 'none' : 'chat')}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors ${
              activeDrawer === 'chat' ? 'text-brand-gold' : 'text-gray-300'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Chat</span>
          </button>

          {/* 5. More Sheet */}
          <button
            onClick={() => setShowMobileMoreSheet(true)}
            className="flex flex-col items-center justify-center p-1.5 rounded-lg text-gray-300"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">More</span>
          </button>
        </div>

        {/* ── DESKTOP COMPLETE DOCK (SCREEN WIDTH >= 640px) ── */}
        <div className="hidden sm:flex items-center gap-2 md:gap-3 mx-auto">
          {/* Mute */}
          <button
            onClick={toggleMute}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              isMuted ? 'bg-red-500/20 text-red-500' : 'bg-[#242424] hover:bg-[#303030] text-gray-200'
            }`}
            title="Mute / Unmute"
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-[9px] mt-0.5">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* Video */}
          <button
            onClick={toggleVideo}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              isVideoOff ? 'bg-red-500/20 text-red-500' : 'bg-[#242424] hover:bg-[#303030] text-gray-200'
            }`}
            title="Start / Stop Video"
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            <span className="text-[9px] mt-0.5">{isVideoOff ? 'Start' : 'Stop'}</span>
          </button>

          {/* Share Screen */}
          <button
            onClick={() => {
              if (isSharingScreen) stopScreenShare();
              else setShowShareOptionsModal(true);
            }}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              isSharingScreen ? 'bg-emerald-600 text-white animate-pulse' : 'bg-[#242424] hover:bg-[#303030] text-emerald-400'
            }`}
            title="Share Screen"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">{isSharingScreen ? 'Stop' : 'Share'}</span>
          </button>

          {/* Record */}
          <button
            onClick={toggleRecording}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-[#242424] hover:bg-[#303030] text-red-400'
            }`}
            title="Record Class"
          >
            <Disc className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">{isRecording ? 'Stop' : 'Record'}</span>
          </button>

          {/* Reactions */}
          <button
            onClick={() => setShowReactionsMenu(!showReactionsMenu)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              showReactionsMenu || handRaised ? 'bg-yellow-400/20 text-yellow-400' : 'bg-[#242424] hover:bg-[#303030] text-gray-200'
            }`}
            title="Reactions"
          >
            <Smile className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">React</span>
          </button>

          {/* Chat */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'chat' ? 'none' : 'chat')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              activeDrawer === 'chat' ? 'bg-[#333] text-brand-gold' : 'bg-[#242424] hover:bg-[#303030] text-gray-200'
            }`}
            title="Chat"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Chat</span>
          </button>

          {/* People */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'participants' ? 'none' : 'participants')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              activeDrawer === 'participants' ? 'bg-[#333] text-brand-gold' : 'bg-[#242424] hover:bg-[#303030] text-gray-200'
            }`}
            title="Participants"
          >
            <Users className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">People</span>
          </button>

          {/* SSB Drills */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'drills' ? 'none' : 'drills')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              activeDrawer === 'drills' ? 'bg-brand-gold text-brand-dark font-bold' : 'bg-[#242424] hover:bg-[#303030] text-brand-gold'
            }`}
            title="SSB Drills"
          >
            <Target className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Drills</span>
          </button>
        </div>

        {/* Desktop Right End Button */}
        <div className="hidden sm:block">
          <button
            onClick={handleLeave}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow flex items-center gap-1.5"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>End Class</span>
          </button>
        </div>

      </footer>

      {/* ── 5. SHARE CONTENT OPTIONS MODAL (MOBILE & DESKTOP) ── */}
      {showShareOptionsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowShareOptionsModal(false)}
        >
          <div
            className="bg-[#1C1C1C] border border-[#333] max-w-sm w-full rounded-2xl p-5 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Share Content to Stage</h3>
              </div>
              <button onClick={() => setShowShareOptionsModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Native Screen Share */}
              <button
                onClick={startNativeScreenShare}
                className="w-full p-3.5 rounded-xl bg-[#262626] hover:bg-[#303030] border border-emerald-500/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Live Computer / Mobile Screen</h4>
                  <p className="text-[10px] text-gray-400">Share your live screen, window, or browser tab</p>
                </div>
              </button>

              {/* TAT Deck */}
              <button
                onClick={() => startDeckPresentation('tat')}
                className="w-full p-3.5 rounded-xl bg-[#262626] hover:bg-[#303030] border border-brand-gold/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">TAT Psychological Picture Deck</h4>
                  <p className="text-[10px] text-gray-400">Broadcast official 30s observation stimulus</p>
                </div>
              </button>

              {/* WAT Deck */}
              <button
                onClick={() => startDeckPresentation('wat')}
                className="w-full p-3.5 rounded-xl bg-[#262626] hover:bg-[#303030] border border-blue-500/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">WAT 15s Rapid Word Battery</h4>
                  <p className="text-[10px] text-gray-400">Display timed psychological keywords</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. MOBILE "MORE" BOTTOM SHEET ── */}
      {showMobileMoreSheet && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center animate-fadeIn sm:hidden"
          onClick={() => setShowMobileMoreSheet(false)}
        >
          <div
            className="bg-[#1C1C1C] border-t border-[#333] w-full rounded-t-3xl p-5 space-y-4 shadow-2xl relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-1" />

            <div className="flex items-center justify-between border-b border-[#2E2E2E] pb-2">
              <span className="font-bold text-sm text-white">More Class Options</span>
              <button onClick={() => setShowMobileMoreSheet(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Reactions Grid */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-gray-400 uppercase font-mono">Quick Reactions</span>
              <div className="flex items-center justify-between py-1">
                {['👏', '👍', '❤️', '😂', '😮', '🎉'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => triggerReaction(emoji)}
                    className="w-10 h-10 flex items-center justify-center text-2xl rounded-xl bg-[#262626] active:scale-90"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons List */}
            <div className="space-y-2 pt-2 border-t border-[#2A2A2A] text-xs">
              {/* Raise Hand */}
              <button
                onClick={handleToggleHandRaise}
                className={`w-full p-3 rounded-xl flex items-center justify-between font-semibold ${
                  handRaised ? 'bg-yellow-400 text-black' : 'bg-[#252525] text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Hand className="w-4 h-4" />
                  <span>{handRaised ? 'Lower Hand' : 'Raise Hand (✋)'}</span>
                </div>
                {handRaised && <span className="text-[10px] uppercase font-mono">Raised</span>}
              </button>

              {/* Record Toggle */}
              <button
                onClick={toggleRecording}
                className="w-full p-3 rounded-xl bg-[#252525] text-white flex items-center justify-between font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Disc className={`w-4 h-4 ${isRecording ? 'text-red-500 animate-spin' : 'text-gray-400'}`} />
                  <span>{isRecording ? 'Stop Recording' : 'Record Live Class'}</span>
                </div>
                {isRecording && <span className="text-red-400 text-[10px] font-mono">REC ON</span>}
              </button>

              {/* SSB Drills */}
              <button
                onClick={() => {
                  setShowMobileMoreSheet(false);
                  setActiveDrawer('drills');
                }}
                className="w-full p-3 rounded-xl bg-[#252525] text-brand-gold flex items-center justify-between font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Target className="w-4 h-4" />
                  <span>Tactical SSB Drills (TAT / WAT / PIQ)</span>
                </div>
              </button>

              {/* Attendees List */}
              <button
                onClick={() => {
                  setShowMobileMoreSheet(false);
                  setActiveDrawer('participants');
                }}
                className="w-full p-3 rounded-xl bg-[#252525] text-white flex items-center justify-between font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Studio Attendees (4)</span>
                </div>
              </button>

              {/* Invite Link Details */}
              <button
                onClick={() => {
                  setShowMobileMoreSheet(false);
                  setShowInviteModal(true);
                }}
                className="w-full p-3 rounded-xl bg-[#252525] text-brand-steelLight flex items-center justify-between font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <LinkIcon className="w-4 h-4 text-brand-gold" />
                  <span>Class Code & Invite Link</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. DESKTOP REACTIONS POPOVER ── */}
      {showReactionsMenu && (
        <div className="hidden sm:block absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#202020] border border-[#3A3A3A] rounded-2xl p-3 shadow-2xl z-40 animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            {['👏', '👍', '❤️', '😂', '😮', '🎉'].map(emoji => (
              <button
                key={emoji}
                onClick={() => triggerReaction(emoji)}
                className="w-10 h-10 flex items-center justify-center text-2xl rounded-xl hover:bg-white/10 active:scale-90 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
          <button
            onClick={handleToggleHandRaise}
            className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              handRaised ? 'bg-yellow-400 text-black' : 'bg-[#2E2E2E] hover:bg-[#3E3E3E] text-white'
            }`}
          >
            <Hand className={`w-4 h-4 ${handRaised ? 'fill-black' : ''}`} />
            <span>{handRaised ? 'Lower Hand' : 'Raise Hand (✋)'}</span>
          </button>
        </div>
      )}

      {/* ── 8. INVITE & CLASS CODE MODAL ── */}
      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-[#1E1E1E] border border-[#333] max-w-sm w-full rounded-2xl p-5 space-y-3.5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#2E2E2E] pb-2.5">
              <h3 className="font-bold text-sm text-white">Class Invitation Details</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#141414] border border-[#282828]">
                <p className="text-[10px] text-brand-gold uppercase">Topic</p>
                <p className="font-sans font-semibold text-white text-xs mt-0.5 truncate">{topic}</p>
                <p className="text-gray-400 text-[10px]">Mentor: {mentor} · AIR 34</p>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#242424] border border-[#333]">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">Meeting ID</p>
                  <p className="text-sm font-bold text-brand-gold">{meetingCode}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(meetingCode);
                    setCopiedKey('code');
                    setTimeout(() => setCopiedKey(null), 2000);
                  }}
                  className="px-2.5 py-1 rounded bg-[#333] hover:bg-[#444] text-xs font-semibold"
                >
                  {copiedKey === 'code' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#242424] border border-[#333]">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase">Passcode</p>
                  <p className="text-xs font-bold text-white">{passcode}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(passcode);
                    setCopiedKey('pass');
                    setTimeout(() => setCopiedKey(null), 2000);
                  }}
                  className="px-2.5 py-1 rounded bg-[#333] hover:bg-[#444] text-xs font-semibold"
                >
                  {copiedKey === 'pass' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setCopiedKey('link');
                  setTimeout(() => setCopiedKey(null), 2000);
                }}
                className="w-full py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs"
              >
                {copiedKey === 'link' ? 'Direct Link Copied!' : 'Copy Direct Join Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. RECORDING SAVED MODAL ── */}
      {recordingSavedModal && savedRecordSummary && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setRecordingSavedModal(false)}
        >
          <div
            className="bg-[#1C1C1C] border border-emerald-500/50 max-w-sm w-full rounded-2xl p-5 space-y-3.5 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-bold text-sm text-white">Recording Saved</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Saved to your computer and student dossier archive.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-[#141414] border border-[#282828] text-left text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-brand-gold font-bold">{savedRecordSummary.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time:</span>
                <span className="text-gray-300">{savedRecordSummary.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setRecordingSavedModal(false)}
                className="flex-1 py-2 rounded-xl bg-[#2A2A2A] hover:bg-[#333] text-gray-200 text-xs font-semibold"
              >
                Continue
              </button>
              <button
                onClick={() => {
                  setRecordingSavedModal(false);
                  navigate('/student/sessions');
                }}
                className="flex-1 py-2 rounded-xl bg-brand-gold text-brand-dark text-xs font-bold"
              >
                Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
