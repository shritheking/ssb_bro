import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, Mic, MicOff, Video, VideoOff, 
  Share2, Users, MessageSquare, Hand, X, Send, 
  Smile, LayoutGrid, Maximize, Minimize, Check, 
  ChevronDown, UserCheck, Monitor
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
  const topic = searchParams.get('topic') || 'SSB Psychology & Diagnostic Debrief';
  const mentor = searchParams.get('mentor') || 'Lt. Vamshi E.';

  // In-Call States
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'chat' | 'participants'>('none');
  const [showReactionsTray, setShowReactionsTray] = useState(false);

  // View & Fullscreen States
  const [viewMode, setViewMode] = useState<'speaker' | 'gallery'>('speaker');
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Active Reaction badge on User PIP (lasts 4 seconds)
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const reactionTimerRef = useRef<number | null>(null);

  // Floating animated emoji particles
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);
  const reactionCounterRef = useRef(0);

  // Meeting Chat Messages
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; isMe: boolean }>>([
    { sender: mentor, text: 'Welcome Arjun. Let me know when you have your TAT Story #3 draft ready.', time: '18:01', isMe: false }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Auto scroll to top on mount & Listen to Fullscreen changes
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

  // Fullscreen Toggle Handler (HTML5 Fullscreen API)
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
      console.warn('Fullscreen request could not be completed:', err);
    }
  };

  // Trigger floating reaction animation & self-tile badge
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
            text: 'I see your hand raised, Arjun. Please unmute and share your psychological observation.', 
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
      
      {/* ── 1. LIVE CLASS TOP BAR (WITH VIEW & FULLSCREEN CONTROLS) ── */}
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
        </div>

        {/* View Options & Fullscreen Controls */}
        <div className="flex items-center gap-2 sm:gap-3 relative">
          
          {/* Zoom-Style View Menu (Speaker / Gallery / Fullscreen) */}
          <div className="relative">
            <button
              onClick={() => setShowViewMenu(!showViewMenu)}
              className="px-2.5 py-1 rounded bg-[#2D2D2D] hover:bg-[#3D3D3D] text-gray-200 text-xs font-medium flex items-center gap-1.5 transition-colors border border-white/10"
              title="View Options"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-gray-300" />
              <span className="hidden sm:inline">View</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* View Dropdown Popover */}
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

      {/* ── 2. MAIN STAGE (SPEAKER OR GALLERY VIEW) ── */}
      <main className="flex-1 relative bg-black flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        
        {/* ── A. SPEAKER VIEW (Default Focus on Assessor + PIP Self-View) ── */}
        {viewMode === 'speaker' ? (
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

            {/* Floating Picture-in-Picture Self-View */}
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
          /* ── B. GALLERY VIEW (Side-by-Side Multi-Tile Grid) ── */
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

        {/* ── FLOATING PARTICLES EFFECT ── */}
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
      <footer className="h-16 px-3 sm:px-8 bg-[#1A1A1A] border-t border-[#2A2A2A] flex items-center justify-around sm:justify-center gap-1 sm:gap-7 shrink-0 z-20">
        
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

        {/* Share Screen */}
        <button
          onClick={() => alert('Screen sharing simulated in prototype.')}
          className="flex flex-col items-center justify-center gap-1 p-1 text-gray-300 hover:text-white"
        >
          <Share2 className="w-5 h-5 text-green-500" />
          <span className="text-[10px] text-green-400">Share</span>
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

        {/* Quick Fullscreen Toggle on Mobile Dock */}
        <button
          onClick={toggleFullscreen}
          className="flex sm:hidden flex-col items-center justify-center gap-1 p-1 text-gray-300 hover:text-white"
        >
          {isFullscreen ? <Minimize className="w-5 h-5 text-yellow-400" /> : <Maximize className="w-5 h-5 text-white" />}
          <span className="text-[10px]">{isFullscreen ? 'Exit' : 'Full'}</span>
        </button>

      </footer>

    </div>
  );
};
