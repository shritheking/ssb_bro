import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, Mic, MicOff, Video, VideoOff, 
  Share2, Users, MessageSquare, Hand, X, Send, 
  Smile, LayoutGrid, Maximize, Minimize, Check, 
  ChevronDown, UserCheck, Monitor, Disc, Pause, 
  Play, Copy, Link as LinkIcon, Download, Clock, 
  FileText, Sparkles, ExternalLink, HelpCircle
} from 'lucide-react';

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

  // In-Call Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'chat' | 'participants'>('none');
  const [showReactionsTray, setShowReactionsTray] = useState(false);

  // View & Fullscreen
  const [viewMode, setViewMode] = useState<'speaker' | 'gallery'>('speaker');
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reaction badge & particles
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const reactionTimerRef = useRef<number | null>(null);
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const reactionCounterRef = useRef(0);

  // ── 1. SCREEN SHARE STATES (REAL & SIMULATED SSB DRILL DECKS) ──
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenShareType, setScreenShareType] = useState<'browser' | 'tat-drill' | 'wat-drill' | 'piq-audit' | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  // SSB Drill deck countdowns
  const [tatCountdown, setTatCountdown] = useState(30);
  const [watWordIndex, setWatWordIndex] = useState(0);
  const watWords = ['LEADERSHIP', 'OBSTACLE', 'COURAGE', 'INITIATIVE', 'INTEGRITY', 'SACRIFICE', 'RESPONSIBILITY'];

  // ── 2. LIVE RECORDING STATES ──
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordingSavedModal, setRecordingSavedModal] = useState(false);
  const [lastSavedRecordInfo, setLastSavedRecordInfo] = useState<{ duration: string; timestamp: string } | null>(null);

  // ── 3. INVITE & SHARE LINK MODAL ──
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Chat Messages
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; isMe: boolean }>>([
    { sender: mentor, text: 'Welcome Arjun. Let me know when you have your TAT Story #3 draft ready.', time: '18:01', isMe: false }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Auto scroll to top & listen for Fullscreen events
  useEffect(() => {
    window.scrollTo(0, 0);

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Recording Timer Effect
  useEffect(() => {
    let timer: any = null;
    if (isRecording && !isRecordingPaused) {
      timer = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, isRecordingPaused]);

  // Screen Share Video Attachment Effect
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
    }
  }, [screenStream, isSharingScreen, screenShareType]);

  // TAT Drill countdown timer
  useEffect(() => {
    let tTimer: any = null;
    if (isSharingScreen && screenShareType === 'tat-drill') {
      tTimer = setInterval(() => {
        setTatCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(tTimer);
  }, [isSharingScreen, screenShareType]);

  // WAT Drill word rotation timer
  useEffect(() => {
    let wTimer: any = null;
    if (isSharingScreen && screenShareType === 'wat-drill') {
      wTimer = setInterval(() => {
        setWatWordIndex(prev => (prev + 1) % watWords.length);
      }, 5000);
    }
    return () => clearInterval(wTimer);
  }, [isSharingScreen, screenShareType, watWords.length]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      console.warn('Fullscreen action unavailable:', err);
    }
  };

  // ── SCREEN SHARING CONTROLS ──
  const startRealScreenShare = async () => {
    setShowShareModal(false);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        setScreenStream(stream);
        setIsSharingScreen(true);
        setScreenShareType('browser');

        const track = stream.getVideoTracks()[0];
        if (track) {
          track.onended = () => {
            stopScreenShare();
          };
        }
      } else {
        startSimulatedShare('tat-drill');
      }
    } catch (err) {
      console.warn('Browser screen capture dismissed, activating interactive TAT drill:', err);
      startSimulatedShare('tat-drill');
    }
  };

  const startSimulatedShare = (type: 'tat-drill' | 'wat-drill' | 'piq-audit') => {
    setShowShareModal(false);
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
    setScreenShareType(type);
    setIsSharingScreen(true);
    setTatCountdown(30);
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
    setIsSharingScreen(false);
    setScreenShareType(null);
  };

  // ── RECORDING CONTROLS ──
  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setIsRecordingPaused(false);
      setRecordSeconds(0);
      setChatMessages(prev => [
        ...prev,
        { 
          sender: 'System Alert', 
          text: '🔴 Live Class recording initiated by Assessor. Session video will be saved to your Dossier Archive.', 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          isMe: false 
        }
      ]);
    } else {
      // Stop recording
      const finalDuration = formatTimer(recordSeconds);
      const timestamp = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
      setIsRecording(false);
      setIsRecordingPaused(false);
      
      const recordItem = {
        id: Math.random().toString(36).substring(2, 9),
        topic,
        mentor,
        duration: finalDuration,
        timestamp,
        downloadUrl: '#',
      };

      try {
        const existing = JSON.parse(localStorage.getItem('ssb_live_recordings') || '[]');
        localStorage.setItem('ssb_live_recordings', JSON.stringify([recordItem, ...existing]));
      } catch {}

      setLastSavedRecordInfo({ duration: finalDuration, timestamp });
      setRecordingSavedModal(true);
    }
  };

  // ── INVITE LINK COPY HANDLERS ──
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
    const fullText = `SSB BRO Live Mentorship Class
Topic: ${topic}
Mentor: ${mentor} (AIR 34 · CDS 2 2019)

Join Live Class Link:
${shareUrl}

Meeting ID / Class Code: ${meetingCode}
Passcode: ${passcode}`;

    copyToClipboard(fullText, 'full');
  };

  // ── REACTION TRIGGER ──
  const triggerReaction = (emoji: string) => {
    setActiveReaction(emoji);
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = window.setTimeout(() => {
      setActiveReaction(null);
    }, 4000);

    const newItems: FloatingReaction[] = [
      { id: ++reactionCounterRef.current, emoji, left: 45 + Math.random() * 25, delay: 0 },
      { id: ++reactionCounterRef.current, emoji, left: 40 + Math.random() * 30, delay: 0.15 },
      { id: ++reactionCounterRef.current, emoji, left: 50 + Math.random() * 20, delay: 0.3 },
    ];

    setFloatingReactions(prev => [...prev, ...newItems]);

    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => !newItems.some(item => item.id === r.id)));
    }, 3000);
  };

  const handleToggleHandRaise = () => {
    const nextState = !handRaised;
    setHandRaised(nextState);
    if (nextState) {
      triggerReaction('✋');
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          { 
            sender: mentor, 
            text: 'I see your hand raised, Arjun. Please unmute and proceed with your TAT psychological deduction.', 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            isMe: false 
          }
        ]);
      }, 1800);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'You', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: true }
    ]);
    setChatInput('');
  };

  const handleEndMeeting = async () => {
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

  const coreEmojis = [
    { emoji: '👏', label: 'Clap' },
    { emoji: '👍', label: 'Thumbs Up' },
    { emoji: '❤️', label: 'Heart' },
    { emoji: '😂', label: 'Joy' },
    { emoji: '😮', label: 'Surprised' },
    { emoji: '🎉', label: 'Party' },
  ];

  const quickFeedback = [
    { emoji: '✅', label: 'Yes' },
    { emoji: '❌', label: 'No' },
    { emoji: '⏪', label: 'Slower' },
    { emoji: '⏩', label: 'Faster' },
    { emoji: '☕', label: 'Coffee' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-[#121212] flex flex-col justify-between overflow-hidden select-none text-white font-sans">
      
      {/* ── 1. LIVE CLASS TOP BAR ── */}
      <header className="h-12 px-3 sm:px-6 bg-[#1A1A1A] border-b border-[#2A2A2A] flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <ShieldCheck className="w-4 h-4 text-green-500" />
          <div className="flex items-center gap-2 text-xs sm:text-sm font-sans text-gray-200">
            <span className="font-semibold text-white">Live Class</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-mono font-bold animate-pulse">
              ● LIVE
            </span>
            <span className="text-gray-500 hidden sm:inline">|</span>
            <span className="text-xs text-gray-400 hidden sm:inline truncate max-w-xs">{topic}</span>
          </div>

          {/* Active Recording Badge in Top Bar */}
          {isRecording && (
            <div className="ml-2 flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-950/70 border border-red-500/50 text-[11px] font-mono text-red-300">
              <span className={`w-2 h-2 rounded-full bg-red-500 ${isRecordingPaused ? '' : 'animate-ping'}`} />
              <span className="font-bold">{isRecordingPaused ? 'PAUSED' : 'REC'}</span>
              <span>{formatTimer(recordSeconds)}</span>
            </div>
          )}
        </div>

        {/* Top Right Controls (Invite Link + View Mode + Fullscreen + Leave) */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          
          {/* Share Link & Meeting Code Button */}
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-2.5 py-1 rounded bg-[#2D2D2D] hover:bg-[#3D3D3D] text-brand-gold hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-brand-gold/30 shadow-sm"
            title="Invite & Share Meeting Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Invite / Code</span>
          </button>

          {/* View Menu (Speaker / Gallery / Fullscreen) */}
          <div className="relative">
            <button
              onClick={() => setShowViewMenu(!showViewMenu)}
              className="px-2.5 py-1 rounded bg-[#2D2D2D] hover:bg-[#3D3D3D] text-gray-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/10"
              title="View Layout"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-gray-300" />
              <span className="hidden sm:inline">View</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {showViewMenu && (
              <div 
                className="absolute right-0 top-full mt-2 w-48 bg-[#232323] border border-[#3E3E3E] rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-fadeIn"
                onClick={() => setShowViewMenu(false)}
              >
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-gray-400">
                  Select Layout
                </div>
                
                <button
                  onClick={() => setViewMode('speaker')}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-white/10 ${
                    viewMode === 'speaker' ? 'text-brand-gold font-semibold' : 'text-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    Speaker View
                  </span>
                  {viewMode === 'speaker' && <Check className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => setViewMode('gallery')}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-white/10 ${
                    viewMode === 'gallery' ? 'text-brand-gold font-semibold' : 'text-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    Gallery View
                  </span>
                  {viewMode === 'gallery' && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="my-1 border-t border-[#333]" />

                <button
                  onClick={toggleFullscreen}
                  className="w-full px-3 py-2 text-left flex items-center justify-between hover:bg-white/10 text-gray-200"
                >
                  <span className="flex items-center gap-2">
                    {isFullscreen ? <Minimize className="w-4 h-4 text-brand-steelLight" /> : <Maximize className="w-4 h-4 text-brand-gold" />}
                    {isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Quick One-Click Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-[#2D2D2D] hover:bg-[#3D3D3D] text-gray-200 transition-colors border border-white/10"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-yellow-400" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Leave Class Button */}
          <button
            onClick={handleEndMeeting}
            className="px-3.5 py-1 rounded bg-[#E02828] hover:bg-[#C92020] text-white text-xs font-semibold transition-colors shadow"
          >
            Leave Class
          </button>
        </div>
      </header>

      {/* ── 2. MAIN STAGE (SPEAKER / GALLERY / ACTIVE SCREEN SHARE) ── */}
      <main className="flex-1 relative bg-black flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        
        {/* ── SCENARIO A: ACTIVE SCREEN SHARING ── */}
        {isSharingScreen ? (
          <div className="relative w-full h-full max-w-7xl rounded-2xl overflow-hidden bg-[#101010] border-2 border-green-500/80 shadow-2xl flex flex-col">
            
            {/* Top Screen Share Status Banner */}
            <div className="h-10 px-4 bg-green-950/80 border-b border-green-500/40 flex items-center justify-between text-xs text-green-200">
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>
                  {screenShareType === 'browser' && 'You are sharing your live screen / application window'}
                  {screenShareType === 'tat-drill' && 'Active Slide Deck: SSB Thematic Apperception Test (TAT #03)'}
                  {screenShareType === 'wat-drill' && 'Active Slide Deck: Word Association Test (WAT Rapid Drill)'}
                  {screenShareType === 'piq-audit' && 'Candidate Personal Information Questionnaire (PIQ Dossier)'}
                </span>
              </div>
              <button
                onClick={stopScreenShare}
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] shadow transition-colors"
              >
                Stop Share
              </button>
            </div>

            {/* Screen Share Stage Content */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden p-2 sm:p-6">
              
              {/* Mode A1: Real Browser Screen Capture */}
              {screenShareType === 'browser' && (
                <div className="w-full h-full flex items-center justify-center">
                  <video 
                    ref={screenVideoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-contain rounded-xl shadow-2xl" 
                  />
                </div>
              )}

              {/* Mode A2: Interactive TAT Psychological Picture Drill */}
              {screenShareType === 'tat-drill' && (
                <div className="w-full max-w-4xl h-full flex flex-col justify-between items-center text-center p-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase text-brand-gold tracking-widest font-semibold">
                      Psychological Testing Drill · Picture 3 of 12
                    </span>
                    <h3 className="font-heading text-lg sm:text-2xl font-bold text-white">
                      30-Second Observation Phase
                    </h3>
                  </div>

                  {/* Ambiguous TAT Psychological Stimulus Picture */}
                  <div className="relative my-3 w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-900">
                    <img 
                      src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80" 
                      alt="SSB TAT Psychological Stimulus" 
                      className="w-full h-full object-cover filter contrast-125 grayscale"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm border border-white/20 text-xs font-mono text-yellow-400 font-bold">
                      ⏱ {tatCountdown > 0 ? `${tatCountdown}s Observation` : '4:00 Writing Phase'}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 max-w-lg leading-relaxed">
                    Identify the hero, describe the past circumstance, the immediate decisive action taken, and the positive resolution.
                  </p>
                </div>
              )}

              {/* Mode A3: Rapid WAT Drill */}
              {screenShareType === 'wat-drill' && (
                <div className="w-full max-w-2xl text-center space-y-6">
                  <span className="text-xs font-mono uppercase text-brand-gold tracking-widest font-semibold">
                    15-Second Word Association Test
                  </span>
                  <div className="p-12 rounded-3xl bg-neutral-900 border-2 border-brand-gold/50 shadow-2xl">
                    <h2 className="font-heading text-5xl sm:text-7xl font-extrabold text-white tracking-wider animate-fadeIn">
                      {watWords[watWordIndex]}
                    </h2>
                    <p className="text-xs font-mono text-gray-400 mt-6">
                      Word {watWordIndex + 1} of {watWords.length} · Write your immediate instinctual sentence
                    </p>
                  </div>
                </div>
              )}

              {/* Mode A4: Candidate PIQ Audit Form */}
              {screenShareType === 'piq-audit' && (
                <div className="w-full max-w-3xl bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 text-left space-y-4 overflow-y-auto max-h-[500px]">
                  <div className="flex items-center justify-between border-b border-[#333] pb-3">
                    <div>
                      <h4 className="font-heading font-bold text-lg text-white">Personal Information Questionnaire (PIQ)</h4>
                      <p className="text-xs text-brand-steelLight font-mono">Candidate: Arjun Sharma · Chest 24 · CDS 2 2026</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 text-xs font-mono font-bold">
                      Verified Dossier
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                    <div className="p-3 rounded-lg bg-[#242424]">
                      <p className="text-gray-400 text-[10px]">Father's Profession</p>
                      <p className="font-semibold text-white">State Govt Administration</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#242424]">
                      <p className="text-gray-400 text-[10px]">Educational Qualification</p>
                      <p className="font-semibold text-white">B.Tech Mechanical (74%)</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#242424]">
                      <p className="text-gray-400 text-[10px]">Sports & Physical Endurance</p>
                      <p className="font-semibold text-white">Cross-Country 5km, Football Captain</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#242424]">
                      <p className="text-gray-400 text-[10px]">Positions of Responsibility</p>
                      <p className="font-semibold text-white">College Technical Fest Lead</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Speaker PIP (Mentor and Arjun in corner during share) */}
              <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                <div className="w-28 sm:w-36 aspect-video rounded-xl overflow-hidden border border-white/20 bg-black shadow-2xl relative">
                  <img src="/images/mentor-portrait.jpg" alt="Lt. Vamshi E." className="w-full h-full object-cover object-top" />
                  <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-sans">
                    Lt. Vamshi
                  </div>
                </div>
                <div className="w-28 sm:w-36 aspect-video rounded-xl overflow-hidden border border-white/20 bg-[#222] shadow-2xl relative flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    AS
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-sans">
                    You
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* ── SCENARIO B: NORMAL STAGE (SPEAKER OR GALLERY VIEW) ── */
          viewMode === 'speaker' ? (
            <>
              {/* Main Active Speaker Tile: Lt. Vamshi E. */}
              <div className="relative w-full h-full max-w-6xl rounded-2xl overflow-hidden bg-[#181818] flex items-center justify-center shadow-2xl border border-white/5">
                <img
                  src="/images/mentor-portrait.jpg"
                  alt="Lt. Vamshi E."
                  className="w-full h-full object-contain sm:object-cover object-top brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Mentor Active Speaker Badge */}
                <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-lg text-xs font-sans text-white flex items-center gap-2.5 shadow-xl border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-semibold tracking-wide">{mentor}</span>
                  <span className="text-[10px] text-brand-gold font-mono px-1.5 py-0.5 rounded bg-brand-gold/10 border border-brand-gold/20">
                    Host · AIR 34
                  </span>
                </div>
              </div>

              {/* Floating Self-View PIP */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-32 sm:w-48 aspect-[3/4] sm:aspect-video rounded-xl overflow-hidden bg-[#242424] border-2 border-[#3A3A3A] shadow-2xl flex flex-col justify-end z-10">
                {!isVideoOff ? (
                  <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow">
                      AS
                    </div>
                    <span className="text-[10px] text-gray-400 mt-1 font-mono">You (Arjun)</span>
                    
                    {activeReaction && (
                      <div className="absolute top-2 right-2 text-2xl sm:text-3xl bg-black/70 backdrop-blur-sm rounded-full w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center border border-white/20 animate-bounce shadow-xl">
                        {activeReaction}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center text-gray-400 relative">
                    <VideoOff className="w-6 h-6 text-red-500" />
                    <span className="text-[10px] text-gray-500 mt-1">Video Off</span>
                    
                    {activeReaction && (
                      <div className="absolute top-2 right-2 text-2xl bg-black/70 rounded-full w-9 h-9 flex items-center justify-center border border-white/20 animate-bounce">
                        {activeReaction}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-1.5 bg-black/85 text-[10px] font-sans truncate text-gray-300 flex items-center justify-between border-t border-white/10">
                  <span className="truncate font-medium flex items-center gap-1">
                    {handRaised && <span className="text-yellow-400">✋</span>}
                    Arjun Sharma
                  </span>
                  {isMuted ? <MicOff className="w-3.5 h-3.5 text-red-500 shrink-0" /> : <Mic className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                </div>
              </div>
            </>
          ) : (
            /* Gallery View Grid (Side-by-Side) */
            <div className="w-full h-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-1">
              
              {/* Tile 1: Lt. Vamshi E. */}
              <div className="relative rounded-2xl overflow-hidden bg-[#181818] border-2 border-green-500/50 shadow-2xl flex items-center justify-center">
                <img
                  src="/images/mentor-portrait.jpg"
                  alt="Lt. Vamshi E."
                  className="w-full h-full object-contain sm:object-cover object-top brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-sans text-white flex items-center gap-2 border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-semibold">{mentor}</span>
                  <span className="text-[10px] text-brand-gold font-mono">(Host · Assessor)</span>
                </div>
              </div>

              {/* Tile 2: Arjun Sharma (Me) */}
              <div className="relative rounded-2xl overflow-hidden bg-[#1E1E1E] border border-white/10 shadow-2xl flex flex-col justify-end">
                {!isVideoOff ? (
                  <div className="w-full h-full bg-[#181818] flex flex-col items-center justify-center relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xl shadow-xl">
                      AS
                    </div>
                    <span className="text-xs text-gray-400 mt-2 font-mono">Arjun Sharma (Me)</span>
                    
                    {activeReaction && (
                      <div className="absolute top-4 right-4 text-3xl sm:text-4xl bg-black/70 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center border border-white/20 animate-bounce shadow-xl">
                        {activeReaction}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#181818] flex flex-col items-center justify-center text-gray-400">
                    <VideoOff className="w-8 h-8 text-red-500 mb-2" />
                    <span className="text-xs text-gray-500">Camera Off</span>
                  </div>
                )}

                <div className="p-3 bg-black/85 text-xs font-sans text-gray-200 flex items-center justify-between border-t border-white/10">
                  <span className="font-semibold flex items-center gap-1.5">
                    {handRaised && <span className="text-yellow-400">✋</span>}
                    Arjun Sharma (Chest 24)
                  </span>
                  <div className="flex items-center gap-2">
                    {isMuted ? <MicOff className="w-4 h-4 text-red-500" /> : <Mic className="w-4 h-4 text-green-500" />}
                    {isVideoOff ? <VideoOff className="w-4 h-4 text-red-500" /> : <Video className="w-4 h-4 text-green-500" />}
                  </div>
                </div>
              </div>

              {/* Tile 3: Priya Nair (Aspirant Peer) */}
              <div className="relative rounded-2xl overflow-hidden bg-[#1E1E1E] border border-white/10 shadow-2xl flex flex-col justify-end hidden sm:flex">
                <div className="w-full h-full bg-[#161616] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-purple-700 text-white font-bold flex items-center justify-center text-xl shadow">
                    PN
                  </div>
                  <span className="text-xs text-gray-400 mt-2 font-mono">Priya Nair (Aspirant)</span>
                </div>
                <div className="p-3 bg-black/85 text-xs font-sans text-gray-200 flex items-center justify-between border-t border-white/10">
                  <span className="font-semibold">Priya Nair (Chest 09)</span>
                  <div className="flex items-center gap-2">
                    <MicOff className="w-4 h-4 text-red-500" />
                    <Video className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </div>

              {/* Tile 4: Rohit Verma (Aspirant Peer) */}
              <div className="relative rounded-2xl overflow-hidden bg-[#1E1E1E] border border-white/10 shadow-2xl flex flex-col justify-end hidden sm:flex">
                <div className="w-full h-full bg-[#161616] flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xl shadow">
                    RV
                  </div>
                  <span className="text-xs text-gray-400 mt-2 font-mono">Rohit Verma (Aspirant)</span>
                </div>
                <div className="p-3 bg-black/85 text-xs font-sans text-gray-200 flex items-center justify-between border-t border-white/10">
                  <span className="font-semibold">Rohit Verma (Chest 18)</span>
                  <div className="flex items-center gap-2">
                    <MicOff className="w-4 h-4 text-red-500" />
                    <VideoOff className="w-4 h-4 text-red-500" />
                  </div>
                </div>
              </div>

            </div>
          )
        )}

        {/* Hand Raised Top Stage Banner */}
        {handRaised && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-2xl animate-pulse z-20 border border-yellow-300">
            <Hand className="w-4 h-4 fill-black" />
            <span>Hand Raised</span>
            <button 
              onClick={() => setHandRaised(false)}
              className="ml-1 text-black/70 hover:text-black font-mono text-[11px] underline"
            >
              Lower
            </button>
          </div>
        )}

        {/* Floating Particles */}
        {floatingReactions.map(r => (
          <div 
            key={r.id} 
            className="pointer-events-none absolute bottom-20 text-4xl sm:text-5xl animate-float-reaction z-30 select-none drop-shadow-lg"
            style={{ 
              left: `${r.left}%`,
              animationDelay: `${r.delay}s`
            }}
          >
            {r.emoji}
          </div>
        ))}

        {/* ── In-Meeting Chat Drawer ── */}
        {activeDrawer === 'chat' && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-[#1F1F1F] border-l border-[#333] flex flex-col z-30 shadow-2xl animate-fadeIn">
            <div className="h-12 px-4 border-b border-[#333] flex items-center justify-between">
              <span className="font-semibold text-sm">Class Chat</span>
              <button onClick={() => setActiveDrawer('none')} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              {chatMessages.map((m, i) => (
                <div key={i} className={`p-2.5 rounded-lg ${m.isMe ? 'bg-[#0E71EB]/25 ml-6 text-blue-100' : 'bg-[#2A2A2A] mr-6 text-gray-200'}`}>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span className="font-bold text-white">{m.sender}</span>
                    <span>{m.time}</span>
                  </div>
                  <p className="leading-snug">{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#333] flex gap-2 bg-[#1A1A1A]">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message to everyone..."
                className="flex-1 bg-[#282828] border border-[#3E3E3E] rounded px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0E71EB]"
              />
              <button type="submit" className="px-3.5 py-2 rounded bg-[#0E71EB] hover:bg-[#005CE6] text-white font-semibold text-xs shrink-0">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* ── In-Meeting Participants Drawer ── */}
        {activeDrawer === 'participants' && (
          <div className="absolute inset-y-0 right-0 w-full sm:w-96 bg-[#1F1F1F] border-l border-[#333] flex flex-col z-30 shadow-2xl animate-fadeIn">
            <div className="h-12 px-4 border-b border-[#333] flex items-center justify-between">
              <span className="font-semibold text-sm">Attendees (4)</span>
              <button onClick={() => setActiveDrawer('none')} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#282828]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-gold text-brand-dark font-bold flex items-center justify-center text-xs">
                    LV
                  </div>
                  <div>
                    <p className="font-semibold text-white">{mentor}</p>
                    <p className="text-[10px] text-gray-400">Host, Assessor · AIR 34</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <Mic className="w-4 h-4" />
                  <Video className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#282828]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    AS
                  </div>
                  <div>
                    <p className="font-semibold text-white">Arjun Sharma (Me)</p>
                    <p className="text-[10px] text-gray-400">Candidate · Chest 24</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {handRaised && <span className="text-yellow-400 text-xs">✋</span>}
                  {isMuted ? <MicOff className="w-4 h-4 text-red-500" /> : <Mic className="w-4 h-4 text-green-500" />}
                  {isVideoOff ? <VideoOff className="w-4 h-4 text-red-500" /> : <Video className="w-4 h-4 text-green-500" />}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#282828]">
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
                  <Video className="w-4 h-4 text-green-500" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#282828]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
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
                onClick={() => {
                  setActiveDrawer('none');
                  setShowInviteModal(true);
                }}
                className="w-full mt-3 py-2.5 rounded-lg bg-[#333] hover:bg-[#444] text-brand-gold text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-brand-gold/30"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Invite Aspirants with Class Link
              </button>
            </div>
          </div>
        )}

        {/* ── REACTIONS DOCK / TRAY ── */}
        {showReactionsTray && (
          <div className="absolute bottom-20 right-4 sm:right-28 w-80 bg-[#232323] border border-[#3E3E3E] rounded-2xl p-4 shadow-2xl z-40 text-white animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#333] mb-3">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-yellow-400" />
                Class Reactions
              </span>
              <button 
                onClick={() => setShowReactionsTray(false)} 
                className="text-gray-400 hover:text-white p-0.5 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2 mb-3.5">
              {coreEmojis.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    triggerReaction(item.emoji);
                    setShowReactionsTray(false);
                  }}
                  title={item.label}
                  className="aspect-square flex items-center justify-center text-2xl sm:text-3xl rounded-xl hover:bg-white/10 active:scale-90 transform transition-all duration-150"
                >
                  {item.emoji}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-[#333] mb-3">
              {quickFeedback.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    triggerReaction(item.emoji);
                    setShowReactionsTray(false);
                  }}
                  title={item.label}
                  className="py-1 px-1.5 rounded-lg bg-[#2D2D2D] hover:bg-[#3D3D3D] text-center text-xs flex flex-col items-center justify-center gap-0.5 transition-colors"
                >
                  <span className="text-base">{item.emoji}</span>
                  <span className="text-[9px] text-gray-400 truncate">{item.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                handleToggleHandRaise();
                setShowReactionsTray(false);
              }}
              className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                handRaised 
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-black' 
                  : 'bg-[#333333] hover:bg-[#444444] text-white border border-[#4A4A4A]'
              }`}
            >
              <Hand className={`w-4 h-4 ${handRaised ? 'fill-black' : ''}`} />
              <span>{handRaised ? 'Lower Hand' : 'Raise Hand'}</span>
            </button>
          </div>
        )}

      </main>

      {/* ── 3. BOTTOM CONTROLS DOCK ── */}
      <footer className="h-16 px-3 sm:px-8 bg-[#1A1A1A] border-t border-[#2A2A2A] flex items-center justify-around sm:justify-center gap-1 sm:gap-6 shrink-0 z-20">
        
        {/* Mute */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex flex-col items-center justify-center gap-1 p-1 text-gray-300 hover:text-white"
        >
          {isMuted ? <MicOff className="w-5 h-5 text-red-500" /> : <Mic className="w-5 h-5 text-white" />}
          <span className={`text-[10px] ${isMuted ? 'text-red-400 font-semibold' : 'text-gray-300'}`}>
            {isMuted ? 'Unmute' : 'Mute'}
          </span>
        </button>

        {/* Video */}
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className="flex flex-col items-center justify-center gap-1 p-1 text-gray-300 hover:text-white"
        >
          {isVideoOff ? <VideoOff className="w-5 h-5 text-red-500" /> : <Video className="w-5 h-5 text-white" />}
          <span className={`text-[10px] ${isVideoOff ? 'text-red-400 font-semibold' : 'text-gray-300'}`}>
            {isVideoOff ? 'Start Video' : 'Stop Video'}
          </span>
        </button>

        {/* Share Screen (Opens Share Options Modal) */}
        <button
          onClick={() => {
            if (isSharingScreen) {
              stopScreenShare();
            } else {
              setShowShareModal(true);
            }
          }}
          className={`flex flex-col items-center justify-center gap-1 p-1 transition-colors ${
            isSharingScreen ? 'text-green-400 font-bold' : 'text-gray-300 hover:text-white'
          }`}
        >
          <Share2 className={`w-5 h-5 ${isSharingScreen ? 'text-green-400' : 'text-green-500'}`} />
          <span className="text-[10px]">{isSharingScreen ? 'Stop Share' : 'Share'}</span>
        </button>

        {/* Recording Toggle */}
        <button
          onClick={toggleRecording}
          className={`flex flex-col items-center justify-center gap-1 p-1 transition-colors ${
            isRecording ? 'text-red-400 font-bold' : 'text-gray-300 hover:text-white'
          }`}
        >
          <Disc className={`w-5 h-5 ${isRecording ? 'text-red-500 animate-spin' : 'text-gray-300'}`} />
          <span className="text-[10px]">{isRecording ? 'Stop Rec' : 'Record'}</span>
        </button>

        {/* Participants */}
        <button
          onClick={() => {
            setActiveDrawer(activeDrawer === 'participants' ? 'none' : 'participants');
            setShowReactionsTray(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-1 text-gray-300 hover:text-white relative"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] text-gray-300">Attendees (4)</span>
        </button>

        {/* Chat */}
        <button
          onClick={() => {
            setActiveDrawer(activeDrawer === 'chat' ? 'none' : 'chat');
            setShowReactionsTray(false);
          }}
          className="flex flex-col items-center justify-center gap-1 p-1 text-gray-300 hover:text-white relative"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] text-gray-300">Chat</span>
        </button>

        {/* Reactions */}
        <button
          onClick={() => {
            setShowReactionsTray(!showReactionsTray);
            if (activeDrawer !== 'none') setActiveDrawer('none');
          }}
          className={`flex flex-col items-center justify-center gap-1 p-1 transition-colors relative ${
            showReactionsTray ? 'text-yellow-400' : 'text-gray-300 hover:text-white'
          }`}
        >
          <Smile className={`w-5 h-5 ${handRaised ? 'text-yellow-400' : ''}`} />
          <span className="text-[10px]">Reactions</span>
          {handRaised && (
            <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
          )}
        </button>

        {/* Quick Fullscreen on Mobile */}
        <button
          onClick={toggleFullscreen}
          className="flex sm:hidden flex-col items-center justify-center gap-1 p-1 text-gray-300 hover:text-white"
        >
          {isFullscreen ? <Minimize className="w-5 h-5 text-yellow-400" /> : <Maximize className="w-5 h-5 text-white" />}
          <span className="text-[10px]">{isFullscreen ? 'Exit' : 'Full'}</span>
        </button>

      </footer>

      {/* ── 4. SHARE CONTENT MODAL (SCREEN / DRILL DECKS / PIQ) ── */}
      {showShareModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowShareModal(false)}
        >
          <div 
            className="bg-[#202020] border border-[#3E3E3E] max-w-lg w-full rounded-2xl p-6 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#333] pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-green-500" />
                <h3 className="font-heading font-bold text-base text-white">Share Content to Live Class</h3>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Option 1: Real Browser Screen Capture */}
              <button
                onClick={startRealScreenShare}
                className="w-full p-4 rounded-xl bg-[#282828] hover:bg-[#333] border border-white/10 hover:border-green-500/50 text-left flex items-start gap-3.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white group-hover:text-green-400 transition-colors">
                    Share Real Screen / Window / Chrome Tab
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    Broadcast your live computer screen, word document, or psychology notes directly onto the mentor stage.
                  </p>
                </div>
              </button>

              {/* Option 2: SSB TAT Slide Deck */}
              <button
                onClick={() => startSimulatedShare('tat-drill')}
                className="w-full p-4 rounded-xl bg-[#282828] hover:bg-[#333] border border-white/10 hover:border-brand-gold/50 text-left flex items-start gap-3.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white group-hover:text-brand-gold transition-colors">
                    TAT Psychological Picture Drill (Thematic Apperception)
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    Display official 30-second ambiguous stimulus picture with live 4-minute candidate story writing countdown.
                  </p>
                </div>
              </button>

              {/* Option 3: Rapid WAT Drill */}
              <button
                onClick={() => startSimulatedShare('wat-drill')}
                className="w-full p-4 rounded-xl bg-[#282828] hover:bg-[#333] border border-white/10 hover:border-blue-500/50 text-left flex items-start gap-3.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors">
                    WAT Rapid-Fire Flashcards (Word Association)
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    Flash automated 15-second psychology keywords for immediate candidate sentence formulation.
                  </p>
                </div>
              </button>

              {/* Option 4: Candidate PIQ Audit Form */}
              <button
                onClick={() => startSimulatedShare('piq-audit')}
                className="w-full p-4 rounded-xl bg-[#282828] hover:bg-[#333] border border-white/10 hover:border-purple-500/50 text-left flex items-start gap-3.5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white group-hover:text-purple-400 transition-colors">
                    PIQ Dossier Form (Personal Information Questionnaire)
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    Share candidate background form for live mock interview cross-examination and OLQ diagnostics.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. SHARE LINK & MEETING CODE MODAL ── */}
      {showInviteModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowInviteModal(false)}
        >
          <div 
            className="bg-[#202020] border border-[#3E3E3E] max-w-md w-full rounded-2xl p-6 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#333] pb-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-brand-gold" />
                <h3 className="font-heading font-bold text-base text-white">Invite Aspirants to Live Class</h3>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meeting Details Card */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#181818] border border-[#333] space-y-1">
                <p className="text-[10px] font-mono uppercase text-brand-gold tracking-wider font-semibold">Live Mentorship Topic</p>
                <p className="text-sm font-semibold text-white">{topic}</p>
                <p className="text-xs text-brand-steelLight font-mono">Assessor: {mentor} · AIR 34</p>
              </div>

              {/* Meeting Code / Class ID */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#282828] border border-[#3A3A3A]">
                <div>
                  <p className="text-[10px] text-gray-400 font-mono uppercase">Meeting ID / Class Code</p>
                  <p className="text-base font-mono font-bold text-brand-gold tracking-wider">{meetingCode}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(meetingCode, 'code')}
                  className="px-3 py-1.5 rounded-lg bg-[#333] hover:bg-[#444] text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-colors border border-white/10"
                >
                  {copiedKey === 'code' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'code' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Passcode */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#282828] border border-[#3A3A3A]">
                <div>
                  <p className="text-[10px] text-gray-400 font-mono uppercase">Security Passcode</p>
                  <p className="text-sm font-mono font-bold text-white tracking-wider">{passcode}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(passcode, 'passcode')}
                  className="px-3 py-1.5 rounded-lg bg-[#333] hover:bg-[#444] text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-colors border border-white/10"
                >
                  {copiedKey === 'passcode' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'passcode' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Direct Invite URL */}
              <div className="space-y-1.5">
                <p className="text-[10px] text-gray-400 font-mono uppercase">Direct Join Link</p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-[#181818] border border-[#333] rounded-lg px-3 py-2 text-xs font-mono text-gray-300 truncate focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(shareUrl, 'url')}
                    className="px-3 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-semibold text-xs flex items-center gap-1.5 transition-all shadow"
                  >
                    {copiedKey === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'url' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Copy Full Formal Invitation */}
            <button
              onClick={copyFullInvite}
              className="w-full py-3 rounded-xl bg-[#2E2E2E] hover:bg-[#3E3E3E] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-white/10 shadow"
            >
              {copiedKey === 'full' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-brand-gold" />}
              <span>{copiedKey === 'full' ? 'Complete Invitation Copied to Clipboard!' : 'Copy Full Meeting Invitation'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 6. RECORDING SAVED CONFIRMATION MODAL ── */}
      {recordingSavedModal && lastSavedRecordInfo && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setRecordingSavedModal(false)}
        >
          <div 
            className="bg-[#202020] border border-green-500/50 max-w-md w-full rounded-2xl p-6 space-y-4 shadow-2xl relative text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-heading font-bold text-lg text-white">Live Class Recording Saved!</h3>
              <p className="text-xs text-gray-400 mt-1">
                Your video session has been archived in the Student Sessions Dossier.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#181818] border border-[#333] text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400">Class Topic:</span>
                <span className="text-white font-semibold truncate max-w-[200px]">{topic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-brand-gold font-bold">{lastSavedRecordInfo.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Archived At:</span>
                <span className="text-gray-300">{lastSavedRecordInfo.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setRecordingSavedModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#333] hover:bg-[#444] text-gray-200 text-xs font-semibold"
              >
                Continue Class
              </button>
              <button
                onClick={() => {
                  setRecordingSavedModal(false);
                  navigate('/student/sessions');
                }}
                className="flex-1 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-dark text-xs font-semibold shadow"
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
