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
  Target, Award, Radio, PenTool, Image, Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';
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

  // Screen Share & Presentation States
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenShareType, setScreenShareType] = useState<'native' | 'whiteboard' | 'photo' | 'tat' | 'wat' | 'piq'>('native');
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Interactive Whiteboard Canvas
  const whiteboardCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#E6B980'); // Brand gold
  const [brushSize, setBrushSize] = useState(3);

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

  // Floating Reactions & Tile Badge
  const [activeReactionBadge, setActiveReactionBadge] = useState<string | null>(null);
  const reactionBadgeTimerRef = useRef<number | null>(null);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const reactionCounterRef = useRef(0);

  // Drills States
  const [drillTab, setDrillTab] = useState<'tat' | 'wat' | 'piq'>('tat');
  const [tatCountdown, setTatCountdown] = useState(30);
  const [candidateStory, setCandidateStory] = useState('');
  const [watIndex, setWatIndex] = useState(0);
  const [watTimer, setWatTimer] = useState(15);
  const [watInput, setWatInput] = useState('');

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
        console.warn('Camera/mic access notice:', err);
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

  // Whiteboard Canvas Init
  useEffect(() => {
    if (isSharingScreen && screenShareType === 'whiteboard' && whiteboardCanvasRef.current) {
      const canvas = whiteboardCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#141414';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [isSharingScreen, screenShareType]);

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
  // 2. SCREEN SHARING & PRESENTATION SUITE (MOBILE & DESKTOP)
  // ──────────────────────────────────────────────────────────
  const startNativeScreenShare = async () => {
    setShowShareOptionsModal(false);
    setShowMobileMoreSheet(false);

    // If native display media is supported (Desktop Chrome/Edge/Firefox or Android Chrome)
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
      try {
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
        return;
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
          // User clicked Cancel in browser prompt
          return;
        }
        console.warn('Native screen share error, opening presentation whiteboard:', err);
      }
    }

    // On iOS Safari / unsupported mobile devices, open the Whiteboard presentation seamlessly
    startPresentation('whiteboard');
  };

  const startPresentation = (type: 'whiteboard' | 'photo' | 'tat' | 'wat' | 'piq') => {
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

  // File Upload for Photo Presentation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedPhotoUrl(url);
      startPresentation('photo');
    }
  };

  // Whiteboard Drawing Handlers (Touch & Mouse)
  const startDrawingAction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    drawAction(e);
  };

  const stopDrawingAction = () => {
    setIsDrawing(false);
    const canvas = whiteboardCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const drawAction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = whiteboardCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = brushColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearWhiteboard = () => {
    const canvas = whiteboardCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#141414';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // ──────────────────────────────────────────────────────────
  // 3. FLUID REACTIONS & CELEBRATION EFFECTS
  // ──────────────────────────────────────────────────────────
  const triggerReaction = (emoji: string) => {
    setShowReactionsMenu(false);
    setShowMobileMoreSheet(false);

    // 1. Show spring badge on candidate PIP tile
    setActiveReactionBadge(emoji);
    if (reactionBadgeTimerRef.current) clearTimeout(reactionBadgeTimerRef.current);
    reactionBadgeTimerRef.current = window.setTimeout(() => setActiveReactionBadge(null), 3000);

    // 2. Multiple smooth floating physics particles
    const newItems: FloatingReaction[] = [
      { id: ++reactionCounterRef.current, emoji, left: 35 + Math.random() * 20, delay: 0 },
      { id: ++reactionCounterRef.current, emoji, left: 45 + Math.random() * 25, delay: 0.12 },
      { id: ++reactionCounterRef.current, emoji, left: 55 + Math.random() * 20, delay: 0.25 },
      { id: ++reactionCounterRef.current, emoji, left: 40 + Math.random() * 30, delay: 0.38 }
    ];
    setFloatingReactions(prev => [...prev, ...newItems]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => !newItems.some(i => i.id === r.id)));
    }, 2800);

    // 3. If celebration emoji 🎉, trigger confetti
    if (emoji === '🎉') {
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#E6B980', '#10B981', '#3B82F6', '#EF4444', '#F59E0B']
        });
      } catch {}
    }
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
            text: `Chest 24 (${candidateName}), unmuting approved. Please proceed with your deduction.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: false,
            tag: 'Host'
          }
        ]);
      }, 1000);
    }
  };

  // ──────────────────────────────────────────────────────────
  // 4. RECORDING
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
    <div className="fixed inset-0 z-[100] bg-[#0E0E0E] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      
      {/* Hidden file input for photo/document presentation */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handlePhotoUpload}
      />

      {/* ── 1. TOP HEADER (44px) ── */}
      <header className="h-11 px-3 sm:px-4 bg-[#161616] border-b border-[#242424] flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-xs tracking-wide text-gray-200 hidden sm:inline">
              Live Mentorship
            </span>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#222] hover:bg-[#2D2D2D] text-gray-300 text-xs font-mono transition-colors"
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

        <span className="text-xs text-gray-400 hidden lg:inline truncate max-w-xs">
          {topic}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'speaker' ? 'gallery' : 'speaker')}
            className="px-2 py-1 rounded-md bg-[#222] hover:bg-[#2D2D2D] text-gray-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {viewMode === 'speaker' ? <LayoutGrid className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{viewMode === 'speaker' ? 'Gallery' : 'Speaker'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex p-1.5 rounded-md bg-[#222] hover:bg-[#2D2D2D] text-gray-300"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleLeave}
            className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-sm"
          >
            End
          </button>
        </div>
      </header>

      {/* ── 2. CENTRAL VIDEO STAGE + DRAWERS ── */}
      <div className="flex-1 relative flex overflow-hidden">
        
        {/* Main Stage Viewport */}
        <main className="flex-1 relative bg-black flex items-center justify-center p-1 sm:p-3 overflow-hidden">
          
          {/* Smooth Floating Reaction Particles */}
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            {floatingReactions.map(r => (
              <div
                key={r.id}
                style={{ left: `${r.left}%`, animationDelay: `${r.delay}s` }}
                className="absolute bottom-16 text-3xl sm:text-5xl animate-float-reaction pointer-events-none filter drop-shadow-2xl"
              >
                {r.emoji}
              </div>
            ))}
          </div>

          {/* SCENARIO A: ACTIVE SCREEN / CONTENT SHARE */}
          {isSharingScreen ? (
            <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#0A0A0A] border border-[#222] shadow-2xl flex flex-col">
              
              {/* Share Top Bar */}
              <div className="h-8 sm:h-9 px-3 bg-[#181818] border-b border-[#252525] flex items-center justify-between text-xs text-emerald-400 shrink-0 z-10">
                <div className="flex items-center gap-1.5 font-medium truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate">
                    {screenShareType === 'native' && 'Live Computer / Window Broadcast'}
                    {screenShareType === 'whiteboard' && 'Interactive Tactical Whiteboard Canvas'}
                    {screenShareType === 'photo' && 'Candidate Document & Story Presentation'}
                    {screenShareType === 'tat' && 'TAT Psychological Slide Deck'}
                    {screenShareType === 'wat' && 'WAT 15s Rapid Word Battery'}
                    {screenShareType === 'piq' && 'PIQ Candidate Dossier Form'}
                  </span>
                </div>
                <button
                  onClick={stopScreenShare}
                  className="px-2.5 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] shrink-0"
                >
                  Stop Share
                </button>
              </div>

              {/* Share Content Viewport */}
              <div className="flex-1 relative bg-black flex items-center justify-center p-1 overflow-hidden">
                
                {/* 1. Native Display Media Stream */}
                {screenShareType === 'native' && (
                  <video
                    ref={(el) => {
                      screenVideoRef.current = el;
                      if (el && screenStream) {
                        el.srcObject = screenStream;
                        el.play().catch(() => {});
                      }
                    }}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-contain bg-black"
                  />
                )}

                {/* 2. Interactive Whiteboard Canvas */}
                {screenShareType === 'whiteboard' && (
                  <div className="w-full h-full flex flex-col items-center justify-center relative bg-[#141414]">
                    {/* Whiteboard Toolbar */}
                    <div className="absolute top-3 z-20 flex items-center gap-2 bg-[#202020] px-3 py-1.5 rounded-full border border-[#333] shadow-lg text-xs">
                      <span className="text-gray-400 text-[10px] font-mono">Pen:</span>
                      {['#E6B980', '#FFFFFF', '#10B981', '#3B82F6', '#EF4444'].map(color => (
                        <button
                          key={color}
                          onClick={() => setBrushColor(color)}
                          style={{ backgroundColor: color }}
                          className={`w-5 h-5 rounded-full border transition-transform ${brushColor === color ? 'scale-125 border-white' : 'border-transparent'}`}
                        />
                      ))}
                      <div className="h-4 w-px bg-gray-600 mx-1" />
                      <button
                        onClick={clearWhiteboard}
                        className="flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold"
                        title="Clear whiteboard"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Clear</span>
                      </button>
                    </div>

                    <canvas
                      ref={whiteboardCanvasRef}
                      width={1280}
                      height={720}
                      onMouseDown={startDrawingAction}
                      onMouseUp={stopDrawingAction}
                      onMouseMove={drawAction}
                      onTouchStart={startDrawingAction}
                      onTouchEnd={stopDrawingAction}
                      onTouchMove={drawAction}
                      className="w-full h-full object-contain cursor-crosshair touch-none"
                    />
                  </div>
                )}

                {/* 3. Photo / Handwritten Document Presentation */}
                {screenShareType === 'photo' && (
                  <div className="w-full h-full flex items-center justify-center p-2">
                    {uploadedPhotoUrl ? (
                      <img
                        src={uploadedPhotoUrl}
                        alt="Presented Document"
                        className="w-full h-full object-contain rounded-lg shadow-2xl"
                      />
                    ) : (
                      <div className="text-center p-6 text-gray-400">
                        <Image className="w-12 h-12 mx-auto text-brand-gold mb-2" />
                        <p className="text-xs">Select an image or handwritten TAT story from your device to present.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. TAT Deck */}
                {screenShareType === 'tat' && (
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
                  </div>
                )}

                {/* 5. WAT Deck */}
                {screenShareType === 'wat' && (
                  <div className="w-full max-w-md p-6 rounded-2xl bg-[#161616] border border-brand-gold/50 text-center space-y-4 shadow-2xl">
                    <span className="text-[10px] font-mono text-gray-400">Word 1 of 7</span>
                    <h2 className="text-3xl sm:text-4xl font-black font-mono text-brand-gold tracking-widest">
                      LEADERSHIP
                    </h2>
                    <p className="text-xs text-gray-400 font-mono">Formulate an authentic, active, OLQ-aligned sentence.</p>
                  </div>
                )}

                {/* 6. PIQ Form */}
                {screenShareType === 'piq' && (
                  <div className="w-full max-w-lg p-4 rounded-xl bg-[#121212] border border-[#2B2B2B] text-left text-xs font-mono space-y-2">
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
            /* SCENARIO B: SPEAKER VIEW (MENTOR MAIN + CANDIDATE PIP) */
            <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#121212] border border-[#202020] shadow-2xl flex items-center justify-center">
              
              {/* Mentor Video Feed */}
              <div className="relative w-full h-full flex items-center justify-center bg-[#0F0F0F]">
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

              {/* Candidate PIP with REAL CAMERA & REACTION BADGE */}
              <div className="absolute top-3 right-3 sm:top-5 sm:right-5 w-24 sm:w-48 aspect-[3/4] sm:aspect-video rounded-xl overflow-hidden bg-[#1A1A1A] border-2 border-[#303030] shadow-2xl flex flex-col justify-end z-20">
                {!isVideoOff ? (
                  <div className="w-full h-full relative bg-black flex items-center justify-center">
                    <video
                      ref={userVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                    {/* Spring Reaction Badge on Candidate Tile */}
                    {activeReactionBadge && (
                      <div className="absolute top-2 right-2 text-2xl sm:text-3xl bg-black/80 backdrop-blur-sm rounded-full w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center border border-white/20 animate-bounce shadow-2xl">
                        {activeReactionBadge}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#161616] flex flex-col items-center justify-center text-gray-400 relative">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs sm:text-sm shadow">
                      AS
                    </div>
                    <span className="text-[9px] text-gray-500 mt-0.5 font-mono">Off</span>
                    {activeReactionBadge && (
                      <div className="absolute top-2 right-2 text-2xl bg-black/80 rounded-full w-8 h-8 flex items-center justify-center">
                        {activeReactionBadge}
                      </div>
                    )}
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
            /* SCENARIO C: GALLERY VIEW (CLEAN 2x2 GRID RESPONSIVE) */
            <div className="w-full h-full max-w-6xl grid grid-cols-2 gap-2 sm:gap-3 p-1">
              
              {/* Tile 1: Mentor */}
              <div className="relative rounded-xl overflow-hidden bg-[#121212] border border-[#222] shadow-lg flex items-center justify-center">
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
              <div className="relative rounded-xl overflow-hidden bg-[#121212] border-2 border-brand-gold/60 shadow-lg flex flex-col justify-end">
                {!isVideoOff ? (
                  <div className="w-full h-full relative bg-black flex items-center justify-center">
                    <video
                      ref={userGalleryVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                    {activeReactionBadge && (
                      <div className="absolute top-2 right-2 text-2xl bg-black/80 rounded-full w-9 h-9 flex items-center justify-center border border-white/20 animate-bounce">
                        {activeReactionBadge}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#161616] flex flex-col items-center justify-center text-gray-400">
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
              <div className="relative rounded-xl overflow-hidden bg-[#121212] border border-[#222] shadow-lg flex flex-col justify-end">
                <div className="w-full h-full bg-[#161616] flex flex-col items-center justify-center text-gray-400">
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
              <div className="relative rounded-xl overflow-hidden bg-[#121212] border border-[#222] shadow-lg flex flex-col justify-end">
                <div className="w-full h-full bg-[#161616] flex flex-col items-center justify-center text-gray-400">
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
          <aside className="fixed sm:static inset-0 sm:inset-auto sm:w-80 md:w-96 bg-[#161616] border-l border-[#242424] flex flex-col z-50 shadow-2xl">
            
            {/* Drawer Header Tabs */}
            <div className="h-12 px-3 border-b border-[#242424] flex items-center justify-between">
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
                    <div key={i} className={`p-2.5 rounded-xl border ${m.isMe ? 'bg-[#222] border-[#303030] ml-4' : 'bg-[#181818] border-[#252525] mr-4'}`}>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                        <span className="font-semibold text-white">{m.sender} {m.tag && `(${m.tag})`}</span>
                        <span>{m.time}</span>
                      </div>
                      <p className="text-gray-200 leading-relaxed">{m.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-[#242424] flex gap-2 bg-[#121212]">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type message..."
                    className="flex-1 bg-[#1C1C1C] border border-[#2D2D2D] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
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
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1E1E1E] border border-white/5">
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

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1E1E1E] border border-white/5">
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

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1E1E1E] border border-white/5">
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

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1E1E1E] border border-white/5">
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
                  className="w-full mt-4 py-2 rounded-xl bg-[#252525] hover:bg-[#303030] text-brand-gold text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-brand-gold/30"
                >
                  <LinkIcon className="w-3.5 h-3.5" /> Invite Candidates via Link
                </button>
              </div>
            )}

            {/* TAB: SSB DRILLS */}
            {activeDrawer === 'drills' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="grid grid-cols-3 p-2 bg-[#121212] border-b border-[#242424] text-xs font-semibold">
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
                      <div className="p-3 rounded-xl bg-[#1E1E1E] border border-[#303030] flex justify-between items-center">
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
                          className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-xs leading-relaxed"
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
                      <div className="p-4 rounded-xl bg-[#1E1E1E] border border-brand-gold/40 text-center space-y-2">
                        <span className="text-[10px] font-mono text-gray-400">Word ({watIndex + 1}/7)</span>
                        <h4 className="text-2xl font-black font-mono tracking-widest text-brand-gold">{watWords[watIndex]}</h4>
                        <span className="text-xs font-mono text-emerald-400">{watTimer}s</span>
                      </div>

                      <div className="space-y-2">
                        <input
                          value={watInput}
                          onChange={(e) => setWatInput(e.target.value)}
                          placeholder="Type active OLQ association sentence..."
                          className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
                        />
                        <button
                          onClick={() => {
                            if (!watInput.trim()) return;
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
                    <div className="p-3 rounded-xl bg-[#1E1E1E] border border-white/5 space-y-2 text-xs font-mono">
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

      {/* ── 4. MODERN ZOOM-STYLE CONTROLS DOCK ── */}
      <footer className="h-16 px-2 sm:px-6 bg-[#161616] border-t border-[#242424] flex items-center justify-between shrink-0 z-30">
        
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

          {/* 3. Share Content */}
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
              isMuted ? 'bg-red-500/20 text-red-500' : 'bg-[#222] hover:bg-[#2C2C2C] text-gray-200'
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
              isVideoOff ? 'bg-red-500/20 text-red-500' : 'bg-[#222] hover:bg-[#2C2C2C] text-gray-200'
            }`}
            title="Start / Stop Video"
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            <span className="text-[9px] mt-0.5">{isVideoOff ? 'Start' : 'Stop'}</span>
          </button>

          {/* Share Content */}
          <button
            onClick={() => {
              if (isSharingScreen) stopScreenShare();
              else setShowShareOptionsModal(true);
            }}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              isSharingScreen ? 'bg-emerald-600 text-white animate-pulse' : 'bg-[#222] hover:bg-[#2C2C2C] text-emerald-400'
            }`}
            title="Share Content"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-[9px] mt-0.5">{isSharingScreen ? 'Stop' : 'Share'}</span>
          </button>

          {/* Record */}
          <button
            onClick={toggleRecording}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
              isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-[#222] hover:bg-[#2C2C2C] text-red-400'
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
              showReactionsMenu || handRaised ? 'bg-yellow-400/20 text-yellow-400' : 'bg-[#222] hover:bg-[#2C2C2C] text-gray-200'
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
              activeDrawer === 'chat' ? 'bg-[#303030] text-brand-gold' : 'bg-[#222] hover:bg-[#2C2C2C] text-gray-200'
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
              activeDrawer === 'participants' ? 'bg-[#303030] text-brand-gold' : 'bg-[#222] hover:bg-[#2C2C2C] text-gray-200'
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
              activeDrawer === 'drills' ? 'bg-brand-gold text-brand-dark font-bold' : 'bg-[#222] hover:bg-[#2C2C2C] text-brand-gold'
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

      {/* ── 5. SEAMLESS SHARE CONTENT MODAL (ZERO SECURITY NOTICES) ── */}
      {showShareOptionsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowShareOptionsModal(false)}
        >
          <div
            className="bg-[#1A1A1A] border border-[#2E2E2E] max-w-sm w-full rounded-2xl p-5 space-y-3.5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Share Content to Stage</h3>
              </div>
              <button onClick={() => setShowShareOptionsModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              
              {/* Option 1: Live Screen Capture (Supported on Desktop & Android Chrome) */}
              <button
                onClick={startNativeScreenShare}
                className="w-full p-3 rounded-xl bg-[#222] hover:bg-[#2A2A2A] border border-emerald-500/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Live Computer / Device Screen</h4>
                  <p className="text-[10px] text-gray-400">Broadcast your real screen, window, or browser tab</p>
                </div>
              </button>

              {/* Option 2: Live Finger/Mouse Whiteboard (Works 100% on all mobile & desktop!) */}
              <button
                onClick={() => startPresentation('whiteboard')}
                className="w-full p-3 rounded-xl bg-[#222] hover:bg-[#2A2A2A] border border-brand-gold/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Live Interactive Whiteboard</h4>
                  <p className="text-[10px] text-gray-400">Sketch tactical diagrams & write notes live with finger or mouse</p>
                </div>
              </button>

              {/* Option 3: Upload Photo of Handwritten TAT Story / PIQ (Works 100% on phone gallery!) */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-3 rounded-xl bg-[#222] hover:bg-[#2A2A2A] border border-blue-500/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Image className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Present Photo / Handwritten Story</h4>
                  <p className="text-[10px] text-gray-400">Select a story picture or PIQ document from your phone</p>
                </div>
              </button>

              {/* Option 4: TAT Deck */}
              <button
                onClick={() => startPresentation('tat')}
                className="w-full p-3 rounded-xl bg-[#222] hover:bg-[#2A2A2A] border border-purple-500/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">TAT Psychological Picture Deck</h4>
                  <p className="text-[10px] text-gray-400">Broadcast official 30s stimulus image</p>
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
            className="bg-[#1A1A1A] border-t border-[#2C2C2C] w-full rounded-t-3xl p-5 space-y-4 shadow-2xl relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-1" />

            <div className="flex items-center justify-between border-b border-[#262626] pb-2">
              <span className="font-bold text-sm text-white">More Class Options</span>
              <button onClick={() => setShowMobileMoreSheet(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Reactions Grid with Fluid Physics */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-gray-400 uppercase font-mono">Quick Reactions</span>
              <div className="flex items-center justify-between py-1">
                {['👏', '👍', '❤️', '😂', '😮', '🎉'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => triggerReaction(emoji)}
                    className="w-11 h-11 flex items-center justify-center text-2xl rounded-2xl bg-[#242424] active:scale-90 transition-transform shadow"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons List */}
            <div className="space-y-2 pt-2 border-t border-[#262626] text-xs">
              <button
                onClick={handleToggleHandRaise}
                className={`w-full p-3 rounded-xl flex items-center justify-between font-semibold ${
                  handRaised ? 'bg-yellow-400 text-black' : 'bg-[#222] text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Hand className="w-4 h-4" />
                  <span>{handRaised ? 'Lower Hand' : 'Raise Hand (✋)'}</span>
                </div>
                {handRaised && <span className="text-[10px] uppercase font-mono">Raised</span>}
              </button>

              <button
                onClick={toggleRecording}
                className="w-full p-3 rounded-xl bg-[#222] text-white flex items-center justify-between font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Disc className={`w-4 h-4 ${isRecording ? 'text-red-500 animate-spin' : 'text-gray-400'}`} />
                  <span>{isRecording ? 'Stop Recording' : 'Record Live Class'}</span>
                </div>
                {isRecording && <span className="text-red-400 text-[10px] font-mono">REC ON</span>}
              </button>

              <button
                onClick={() => {
                  setShowMobileMoreSheet(false);
                  setActiveDrawer('drills');
                }}
                className="w-full p-3 rounded-xl bg-[#222] text-brand-gold flex items-center justify-between font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Target className="w-4 h-4" />
                  <span>Tactical SSB Drills (TAT / WAT / PIQ)</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowMobileMoreSheet(false);
                  setActiveDrawer('participants');
                }}
                className="w-full p-3 rounded-xl bg-[#222] text-white flex items-center justify-between font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4" />
                  <span>Studio Attendees (4)</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowMobileMoreSheet(false);
                  setShowInviteModal(true);
                }}
                className="w-full p-3 rounded-xl bg-[#222] text-gray-300 flex items-center justify-between font-semibold"
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
        <div className="hidden sm:block absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#1C1C1C] border border-[#2E2E2E] rounded-2xl p-3 shadow-2xl z-40 animate-fadeIn">
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
              handRaised ? 'bg-yellow-400 text-black' : 'bg-[#282828] hover:bg-[#333] text-white'
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
            className="bg-[#1C1C1C] border border-[#2E2E2E] max-w-sm w-full rounded-2xl p-5 space-y-3.5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
              <h3 className="font-bold text-sm text-white">Class Invitation Details</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#141414] border border-[#222]">
                <p className="text-[10px] text-brand-gold uppercase">Topic</p>
                <p className="font-sans font-semibold text-white text-xs mt-0.5 truncate">{topic}</p>
                <p className="text-gray-400 text-[10px]">Mentor: {mentor} · AIR 34</p>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#222] border border-[#2C2C2C]">
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
                  className="px-2.5 py-1 rounded bg-[#303030] hover:bg-[#3D3D3D] text-xs font-semibold"
                >
                  {copiedKey === 'code' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#222] border border-[#2C2C2C]">
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
                  className="px-2.5 py-1 rounded bg-[#303030] hover:bg-[#3D3D3D] text-xs font-semibold"
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
            className="bg-[#1A1A1A] border border-emerald-500/50 max-w-sm w-full rounded-2xl p-5 space-y-3.5 shadow-2xl relative text-center"
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

            <div className="p-2.5 rounded-xl bg-[#141414] border border-[#222] text-left text-xs font-mono space-y-1">
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
                className="flex-1 py-2 rounded-xl bg-[#262626] hover:bg-[#303030] text-gray-200 text-xs font-semibold"
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
