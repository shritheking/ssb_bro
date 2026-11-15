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
  MoreVertical, PhoneOff
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

  // Layout & UI
  const [viewMode, setViewMode] = useState<'speaker' | 'gallery'>('speaker');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'none' | 'chat' | 'participants' | 'drills'>('none');
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);

  // Hardware Streams
  const userMediaStreamRef = useRef<MediaStream | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const userGalleryVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Screen Share
  const [isSharingScreen, setIsSharingScreen] = useState(false);
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

  // Drills
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

  // 1. Initialise Hardware (Webcam + Mic Analyser)
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

          // Audio Analyser
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
        console.warn('Webcam/mic access not granted:', err);
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
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.play().catch(() => {});
    }
  }, [screenStream, isSharingScreen]);

  // Mic & Video Toggles
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

  // Fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {}
  };

  // Native Screen Sharing
  const startScreenShare = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
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
      }
    } catch (e: any) {
      if (e.name !== 'NotAllowedError') console.warn('Screen share error:', e);
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
    setIsSharingScreen(false);
  };

  // Recording
  const toggleRecording = async () => {
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
    <div className="fixed inset-0 z-[100] bg-[#121212] text-white flex flex-col justify-between overflow-hidden select-none font-sans">

      {/* ── 1. ULTRA-SLEEK TOP NAVIGATION (44px) ── */}
      <header className="h-11 px-4 bg-[#181818] border-b border-[#282828] flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Meeting Info & Live Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-xs tracking-wide text-gray-200">
              Live Mentorship Studio
            </span>
          </div>

          <span className="text-gray-600 hidden sm:inline">|</span>

          <span className="text-xs text-gray-400 hidden md:inline truncate max-w-xs">
            {topic}
          </span>

          {/* Recording Badge */}
          {isRecording && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/60 text-[11px] font-mono text-red-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold">REC</span>
              <span>{`${Math.floor(recordSeconds / 60).toString().padStart(2, '0')}:${(recordSeconds % 60).toString().padStart(2, '0')}`}</span>
            </div>
          )}
        </div>

        {/* Right: Quick Controls (View Mode + Fullscreen + Code) */}
        <div className="flex items-center gap-2">
          
          {/* Meeting Code Badge */}
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#252525] hover:bg-[#303030] text-gray-300 hover:text-white text-xs font-mono transition-colors"
          >
            <span className="text-gray-400 text-[11px]">ID:</span>
            <span className="font-semibold text-brand-gold">{meetingCode}</span>
            <Copy className="w-3 h-3 text-gray-400" />
          </button>

          {/* View Toggle (Speaker vs Gallery) */}
          <button
            onClick={() => setViewMode(viewMode === 'speaker' ? 'gallery' : 'speaker')}
            className="px-2.5 py-1 rounded-md bg-[#252525] hover:bg-[#303030] text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {viewMode === 'speaker' ? <LayoutGrid className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{viewMode === 'speaker' ? 'Gallery View' : 'Speaker View'}</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md bg-[#252525] hover:bg-[#303030] text-gray-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* ── 2. CENTRAL VIDEO STAGE + SLIDE DRAWER ── */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Main Video Viewport */}
        <main className="flex-1 relative bg-black flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          
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

          {/* SCENARIO A: SCREEN SHARE ACTIVE */}
          {isSharingScreen ? (
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#101010] border border-[#2D2D2D] shadow-2xl flex flex-col">
              <div className="h-9 px-4 bg-[#1C1C1C] border-b border-[#2D2D2D] flex items-center justify-between text-xs text-emerald-400">
                <div className="flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>You are sharing your screen</span>
                </div>
                <button
                  onClick={stopScreenShare}
                  className="px-2.5 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors"
                >
                  Stop Sharing
                </button>
              </div>

              <div className="flex-1 relative bg-black flex items-center justify-center p-1">
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-contain"
                />
              </div>

              {/* PIP of Mentor during Screen Share */}
              <div className="absolute bottom-4 right-4 w-44 sm:w-52 aspect-video rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#1A1A1A] z-20">
                <img
                  src="/images/mentor-portrait.jpg"
                  alt="Lt. Vamshi E."
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-1 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-medium text-white flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{mentor}</span>
                </div>
              </div>
            </div>
          ) : viewMode === 'speaker' ? (
            /* SCENARIO B: SPEAKER VIEW (MENTOR MAIN + CANDIDATE PIP) */
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#161616] border border-[#262626] shadow-2xl flex items-center justify-center">
              
              {/* Mentor Video Feed */}
              <div className="relative w-full h-full flex items-center justify-center bg-[#141414]">
                <img
                  src="/images/mentor-portrait.jpg"
                  alt="Lt. Vamshi E."
                  className="w-full h-full object-cover sm:object-contain object-top"
                />

                {/* Mentor Nameplate */}
                <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-medium text-white flex items-center gap-2.5 shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold">{mentor}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-mono">
                    Host · AIR 34
                  </span>
                </div>
              </div>

              {/* Candidate PIP with REAL CAMERA FEED */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-36 sm:w-56 aspect-[3/4] sm:aspect-video rounded-xl overflow-hidden bg-[#202020] border-2 border-[#383838] shadow-2xl flex flex-col justify-end z-20">
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
                  <div className="w-full h-full bg-[#1C1C1C] flex flex-col items-center justify-center text-gray-400">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow">
                      AS
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 font-mono">Camera Off</span>
                  </div>
                )}

                {/* Candidate Nameplate on PIP */}
                <div className="p-2 bg-black/85 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    {handRaised && <span className="text-yellow-400">✋</span>}
                    <span className="font-medium truncate">{candidateName} (You)</span>
                  </div>
                  <div>
                    {!isMuted && audioLevel > 5 ? (
                      <div className="flex items-end gap-0.5 h-3">
                        <span className="w-1 bg-emerald-400 rounded-full" style={{ height: `${Math.max(20, audioLevel)}%` }} />
                        <span className="w-1 bg-emerald-400 rounded-full" style={{ height: `${Math.max(40, audioLevel * 0.8)}%` }} />
                      </div>
                    ) : isMuted ? (
                      <MicOff className="w-3.5 h-3.5 text-red-500" />
                    ) : (
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* SCENARIO C: GALLERY VIEW (CLEAN 2x2 ZOOM-STYLE GRID) */
            <div className="w-full h-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-1">
              
              {/* Tile 1: Mentor */}
              <div className="relative rounded-2xl overflow-hidden bg-[#181818] border border-[#2E2E2E] shadow-2xl flex items-center justify-center">
                <img
                  src="/images/mentor-portrait.jpg"
                  alt="Lt. Vamshi E."
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-2 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{mentor} (Host · AIR 34)</span>
                </div>
              </div>

              {/* Tile 2: Arjun Sharma (Me) with Real Camera */}
              <div className="relative rounded-2xl overflow-hidden bg-[#181818] border-2 border-brand-gold/60 shadow-2xl flex flex-col justify-end">
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
                  <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center text-gray-400">
                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xl shadow-lg mb-2">
                      AS
                    </div>
                    <span className="text-xs text-gray-500 font-mono">Camera Off</span>
                  </div>
                )}
                <div className="p-2.5 bg-black/85 text-xs font-medium text-white flex items-center justify-between border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    {handRaised && <span className="text-yellow-400">✋</span>}
                    {candidateName} (You · Chest 24)
                  </span>
                  <div className="flex items-center gap-2">
                    {isMuted ? <MicOff className="w-3.5 h-3.5 text-red-500" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
                    {isVideoOff ? <VideoOff className="w-3.5 h-3.5 text-red-500" /> : <Video className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </div>
              </div>

              {/* Tile 3: Priya Nair */}
              <div className="relative rounded-2xl overflow-hidden bg-[#181818] border border-[#2E2E2E] shadow-2xl flex flex-col justify-end">
                <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-xl shadow-lg mb-2">
                    PN
                  </div>
                  <span className="text-xs text-gray-500 font-mono">Priya Nair</span>
                </div>
                <div className="p-2.5 bg-black/85 text-xs font-medium text-white flex items-center justify-between border-t border-white/10">
                  <span>Priya Nair (Chest 09)</span>
                  <div className="flex items-center gap-2">
                    <MicOff className="w-3.5 h-3.5 text-red-500" />
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>

              {/* Tile 4: Rohit Verma */}
              <div className="relative rounded-2xl overflow-hidden bg-[#181818] border border-[#2E2E2E] shadow-2xl flex flex-col justify-end">
                <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center text-gray-400">
                  <div className="w-16 h-16 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xl shadow-lg mb-2">
                    RV
                  </div>
                  <span className="text-xs text-gray-500 font-mono">Rohit Verma</span>
                </div>
                <div className="p-2.5 bg-black/85 text-xs font-medium text-white flex items-center justify-between border-t border-white/10">
                  <span>Rohit Verma (Chest 18)</span>
                  <div className="flex items-center gap-2">
                    <MicOff className="w-3.5 h-3.5 text-red-500" />
                    <VideoOff className="w-3.5 h-3.5 text-red-500" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Reactions Menu Popover */}
          {showReactionsMenu && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#202020] border border-[#3A3A3A] rounded-2xl p-3 shadow-2xl z-40 animate-fadeIn">
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

        </main>

        {/* ── 3. CLEAN SLIDE-OVER SIDEBAR (CHAT / ATTENDEES / DRILLS) ── */}
        {activeTab !== 'none' && (
          <aside className="w-full sm:w-80 md:w-96 bg-[#181818] border-l border-[#282828] flex flex-col z-30 shadow-2xl">
            
            {/* Header Tabs */}
            <div className="h-12 px-3 border-b border-[#282828] flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'chat' ? 'bg-[#2C2C2C] text-white font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('participants')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'participants' ? 'bg-[#2C2C2C] text-white font-semibold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Attendees (4)
                </button>
                <button
                  onClick={() => setActiveTab('drills')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'drills' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-brand-gold hover:text-white'
                  }`}
                >
                  SSB Drills
                </button>
              </div>

              <button onClick={() => setActiveTab('none')} className="text-gray-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB 1: CHAT */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border ${m.isMe ? 'bg-[#232323] border-[#383838] ml-4' : 'bg-[#1C1C1C] border-[#2A2A2A] mr-4'}`}>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                        <span className="font-semibold text-white">{m.sender} {m.tag && `(${m.tag})`}</span>
                        <span>{m.time}</span>
                      </div>
                      <p className="text-gray-200 leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-[#282828] flex gap-2 bg-[#141414]">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message to class..."
                    className="flex-1 bg-[#222] border border-[#333] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
                  />
                  <button type="submit" className="px-3.5 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-bold text-xs shrink-0">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: PARTICIPANTS */}
            {activeTab === 'participants' && (
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

                {/* You */}
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
                  className="w-full mt-4 py-2 rounded-xl bg-[#2A2A2A] hover:bg-[#353535] text-brand-gold text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-brand-gold/30"
                >
                  <LinkIcon className="w-3.5 h-3.5" /> Invite Candidates via Link
                </button>
              </div>
            )}

            {/* TAB 3: SSB DRILLS */}
            {activeTab === 'drills' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="grid grid-cols-3 p-2 bg-[#141414] border-b border-[#282828] text-xs">
                  <button
                    onClick={() => setDrillTab('tat')}
                    className={`py-1 rounded-md font-semibold ${drillTab === 'tat' ? 'bg-brand-gold text-brand-dark' : 'text-gray-400 hover:text-white'}`}
                  >
                    TAT Drill
                  </button>
                  <button
                    onClick={() => setDrillTab('wat')}
                    className={`py-1 rounded-md font-semibold ${drillTab === 'wat' ? 'bg-brand-gold text-brand-dark' : 'text-gray-400 hover:text-white'}`}
                  >
                    WAT Drill
                  </button>
                  <button
                    onClick={() => setDrillTab('piq')}
                    className={`py-1 rounded-md font-semibold ${drillTab === 'piq' ? 'bg-brand-gold text-brand-dark' : 'text-gray-400 hover:text-white'}`}
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
                          <p className="font-bold text-white">
                            {tatPhase === 'observe' ? '30s Picture Observation' : '4-Min Story Writing'}
                          </p>
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
                          className="w-full bg-[#1F1F1F] border border-[#333] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-xs leading-relaxed"
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
                          setActiveTab('chat');
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
                          className="w-full bg-[#1F1F1F] border border-[#333] rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
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

      {/* ── 4. MODERN ZOOM-STYLE FLOATING BOTTOM CONTROLS DOCK (72px) ── */}
      <footer className="h-16 px-4 bg-[#181818] border-t border-[#282828] flex items-center justify-between shrink-0 z-30">
        
        {/* Left: Meeting Name / Status (Desktop) */}
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Encrypted Mentorship Session</span>
        </div>

        {/* Center: Main Primary Controls (Zoom Style) */}
        <div className="flex items-center gap-2 sm:gap-3 mx-auto">
          
          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              isMuted
                ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                : 'bg-[#252525] hover:bg-[#323232] text-gray-200'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span className="text-[9px] mt-0.5">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* Video Button */}
          <button
            onClick={toggleVideo}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              isVideoOff
                ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                : 'bg-[#252525] hover:bg-[#323232] text-gray-200'
            }`}
            title={isVideoOff ? 'Start Camera' : 'Stop Camera'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            <span className="text-[9px] mt-0.5">{isVideoOff ? 'Start' : 'Stop'}</span>
          </button>

          {/* Share Screen Button (Direct Native Share) */}
          <button
            onClick={() => {
              if (isSharingScreen) stopScreenShare();
              else startScreenShare();
            }}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              isSharingScreen
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-[#252525] hover:bg-[#323232] text-emerald-400'
            }`}
            title="Share Screen"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">{isSharingScreen ? 'Sharing' : 'Share'}</span>
          </button>

          {/* Record Button */}
          <button
            onClick={toggleRecording}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              isRecording
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-[#252525] hover:bg-[#323232] text-red-400'
            }`}
            title="Record Live Class"
          >
            <Disc className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">{isRecording ? 'Stop' : 'Record'}</span>
          </button>

          {/* Reactions Button */}
          <button
            onClick={() => setShowReactionsMenu(!showReactionsMenu)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              showReactionsMenu || handRaised ? 'bg-yellow-400/20 text-yellow-400' : 'bg-[#252525] hover:bg-[#323232] text-gray-200'
            }`}
            title="Reactions"
          >
            <Smile className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">React</span>
          </button>

          {/* Chat Toggle Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'chat' ? 'none' : 'chat')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              activeTab === 'chat' ? 'bg-[#353535] text-brand-gold' : 'bg-[#252525] hover:bg-[#323232] text-gray-200'
            }`}
            title="Class Chat"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Chat</span>
          </button>

          {/* Attendees Toggle Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'participants' ? 'none' : 'participants')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              activeTab === 'participants' ? 'bg-[#353535] text-brand-gold' : 'bg-[#252525] hover:bg-[#323232] text-gray-200'
            }`}
            title="Participants"
          >
            <Users className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">People</span>
          </button>

          {/* SSB Drills Toggle Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'drills' ? 'none' : 'drills')}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              activeTab === 'drills' ? 'bg-brand-gold text-brand-dark font-bold' : 'bg-[#252525] hover:bg-[#323232] text-brand-gold'
            }`}
            title="SSB Drills"
          >
            <Target className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">Drills</span>
          </button>
        </div>

        {/* Right: End Call Button */}
        <div>
          <button
            onClick={handleLeave}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow flex items-center gap-1.5"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End Class</span>
          </button>
        </div>

      </footer>

      {/* ── 5. INVITE & SHARE MODAL ── */}
      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-[#202020] border border-[#3A3A3A] max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#303030] pb-3">
              <h3 className="font-bold text-sm text-white">Invite Aspirants to Live Studio</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#181818] border border-[#2D2D2D]">
                <p className="text-[10px] text-brand-gold font-mono uppercase">Topic</p>
                <p className="font-semibold text-white mt-0.5">{topic}</p>
                <p className="text-gray-400 mt-0.5 font-mono">Mentor: {mentor} · AIR 34</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#282828] border border-[#383838]">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-mono">Meeting ID</p>
                  <p className="text-base font-bold text-brand-gold font-mono">{meetingCode}</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(meetingCode);
                    setCopiedKey('code');
                    setTimeout(() => setCopiedKey(null), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#333] hover:bg-[#444] text-xs font-semibold text-gray-200 flex items-center gap-1.5"
                >
                  {copiedKey === 'code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'code' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] text-gray-400 uppercase font-mono">Direct Join Link</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-[#181818] border border-[#303030] rounded-lg px-3 py-2 text-xs font-mono text-gray-300 truncate focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      setCopiedKey('url');
                      setTimeout(() => setCopiedKey(null), 2000);
                    }}
                    className="px-3 py-2 rounded-lg bg-brand-gold text-brand-dark font-bold text-xs"
                  >
                    {copiedKey === 'url' ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. RECORDING DOWNLOAD CONFIRMATION MODAL ── */}
      {recordingSavedModal && savedRecordSummary && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setRecordingSavedModal(false)}
        >
          <div
            className="bg-[#202020] border border-emerald-500/60 max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-base text-white">Live Recording Complete</h3>
              <p className="text-xs text-gray-400 mt-1">
                Your video session was saved to your computer and archived in your Student Dossier.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#181818] border border-[#303030] text-left text-xs font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-brand-gold font-bold">{savedRecordSummary.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time:</span>
                <span className="text-gray-300">{savedRecordSummary.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setRecordingSavedModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#303030] hover:bg-[#3E3E3E] text-gray-200 text-xs font-semibold"
              >
                Continue Class
              </button>
              <button
                onClick={() => {
                  setRecordingSavedModal(false);
                  navigate('/student/sessions');
                }}
                className="flex-1 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-dark text-xs font-bold"
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
