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
  Target, Award, Radio, PenTool, Image, Trash2,
  RotateCcw, Volume2, VolumeX, Sliders, ChevronLeft, ChevronRight, CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveSessionRecording } from '../../lib/supabase';

// ──────────────────────────────────────────────────────────
// SSB PSYCHOLOGY TESTING SIMULATOR DATASETS
// ──────────────────────────────────────────────────────────
export interface TatSlide {
  id: number;
  title: string;
  context: string;
  imageUrl: string;
  sampleOlqs: string[];
}

export const ssbTatSlides: TatSlide[] = [
  {
    id: 1,
    title: "Slide 1: Rural Rescue & First Aid",
    context: "Group gathered around an injured villager near a broken road in heavy rains.",
    imageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    sampleOlqs: ["Initiative", "Effective Intelligence", "Sense of Responsibility"]
  },
  {
    id: 2,
    title: "Slide 2: Late Night Examination / Research",
    context: "Young person at a study desk with open books under a desk lamp while others rest.",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    sampleOlqs: ["Determination", "Stamina", "Self Confidence"]
  },
  {
    id: 3,
    title: "Slide 3: Tactical Planning in Camp",
    context: "Two youths examining an open topographical map with flashlights in a tent.",
    imageUrl: "https://images.unsplash.com/photo-1579208575657-c595a053b977?auto=format&fit=crop&w=1200&q=80",
    sampleOlqs: ["Reasoning Ability", "Organizing Ability", "Cooperation"]
  },
  {
    id: 4,
    title: "Slide 4: Factory / Machine Crisis",
    context: "An engineer in protective gear observing abnormal pressure reading on a pipeline.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    sampleOlqs: ["Speed of Decision", "Courage", "Liveliness"]
  },
  {
    id: 5,
    title: "Slide 5: Mountain Ascent & Team Support",
    context: "A leader reaching back on a steep rock face extending a hand to an exhausted teammate.",
    imageUrl: "https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=1200&q=80",
    sampleOlqs: ["Ability to Influence Group", "Social Adaptability", "Courage"]
  },
  {
    id: 6,
    title: "Slide 6: Village Reconstruction & Panchayat",
    context: "A young person presenting a water canal blueprint to village elders in a council.",
    imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
    sampleOlqs: ["Initiative", "Power of Expression", "Group Influence"]
  },
  {
    id: 7,
    title: "Slide 7: Inter-College Tournament Halftime",
    context: "Sports team gathered in a circle behind on points, captain giving decisive instructions.",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80",
    sampleOlqs: ["Leadership", "Liveliness", "Determination"]
  },
  {
    id: 8,
    title: "Slide 8: Rural Medical Relief Camp",
    context: "Doctor and volunteer administering vaccine doses during an epidemic outbreak.",
    imageUrl: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
    sampleOlqs: ["Sense of Responsibility", "Social Adaptability", "Compassion"]
  },
  {
    id: 9,
    title: "Slide 9: Technical Prototype Testing",
    context: "Two college students working on an autonomous drone project before competition deadline.",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    sampleOlqs: ["Effective Intelligence", "Organizing Ability", "Persistence"]
  },
  {
    id: 10,
    title: "Slide 10: Highway Breakdown at Dusk",
    context: "Two individuals inspecting a stalled bus engine with stranded passengers looking on.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    sampleOlqs: ["Speed of Decision", "Practical Intelligence", "Responsibility"]
  },
  {
    id: 11,
    title: "Slide 11: Youth Innovation Meeting",
    context: "A team around a conference table engaged in an animated debate on disaster relief.",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    sampleOlqs: ["Cooperation", "Power of Expression", "Group Cohesion"]
  },
  {
    id: 12,
    title: "Slide 12: OFFICIAL SSB BLANK SLIDE",
    context: "Authentic blank slide. Conceive your own positive hero, realistic crisis, action, and triumph.",
    imageUrl: "",
    sampleOlqs: ["Self Concept", "Natural Spontaneity", "High Officer Potential"]
  }
];

export const ssbWatWords = [
  "LEADERSHIP", "OBSTACLE", "COURAGE", "INITIATIVE", "INTEGRITY",
  "SACRIFICE", "RESPONSIBILITY", "TEAM", "ATTEMPT", "DISCIPLINE",
  "FEAR", "PEACE", "DETERMINATION", "DUTY", "ALERT",
  "CHALLENGE", "SUCCESS", "FAILURE", "ORDER", "VICTORY",
  "ENEMY", "FRIEND", "CONFIDENCE", "RESOLVE", "COOPERATION",
  "HONOUR", "WAR", "SPEED", "DIFFICULTY", "CALM",
  "WORK", "COUNTRY", "DECISION", "STAMINA", "REASON",
  "HELP", "RISK", "BLOOD", "SMILE", "WEAPON",
  "PATRIOT", "FUTURE", "PLAN", "ATTACK", "DEFEAT",
  "ACTION", "PROGRESS", "TRUTH", "TIME", "STRENGTH",
  "HOPE", "CRISIS", "COMPASSION", "ENERGY", "LOYALTY",
  "PRESSURE", "RULE", "MISSION", "ACHIEVE", "CHARACTER"
];

export const ssbSrtSituations = [
  { id: 1, text: "He was traveling in a sleeper train at night when a fire broke out in the adjacent bogie and panic ensued. He..." },
  { id: 2, text: "While trekking in a remote forest, his buddy slipped into a 20-foot gorge and fractured his leg with a storm approaching. He..." },
  { id: 3, text: "His sister's wedding was in two days, but his unit was urgently mobilized for active border deployment. He..." },
  { id: 4, text: "During the Command Task, the bridging plank broke midway and his subordinate froze in fear. He..." },
  { id: 5, text: "In a crowded market, he noticed an unattended bag emitting a ticking sound near an electrical transformer. He..." },
  { id: 6, text: "During flood relief, the rescue motorboat engine failed in high current with 8 villagers on board. He..." },
  { id: 7, text: "He was preparing for his final SSB attempt when his wallet with all original certificates was stolen 5 days before reporting. He..." },
  { id: 8, text: "On a deserted highway at night, he witnessed an overturned jeep with fuel leaking and passengers trapped inside. He..." },
  { id: 9, text: "During a crucial inter-college football final, the captain was injured in the first 10 minutes and team morale collapsed. He..." },
  { id: 10, text: "In a group discussion, two candidates became aggressive and turned it into a shouting match. He..." },
  { id: 11, text: "His village was cut off due to a sudden cloudburst and the local primary health center ran out of life-saving oxygen. He..." },
  { id: 12, text: "He was walking along a railway track when he spotted a large fishplate missing with a train whistle approaching in the distance. He..." },
  { id: 13, text: "While conducting an obstacle run, an opponent deliberately pushed his teammate to gain an unfair advantage. He..." },
  { id: 14, text: "His parents wanted him to take a high-paying corporate desk job, but his dream was the Indian Military Academy. He..." },
  { id: 15, text: "In an SSB interview, the Board President questioned the integrity of his academic records based on a typo. He..." }
];

export const ssbSdtPillars = [
  { id: 1, title: "1. Parents' Opinion", question: "What do your parents think of you? (Responsibilities, temperament, trust, obedience)" },
  { id: 2, title: "2. Teachers' & Mentors' Opinion", question: "What do your teachers or professors think of you? (Academics, discipline, punctuality, extra-curriculars)" },
  { id: 3, title: "3. Friends' & Peers' Opinion", question: "What do your close friends think of you? (Reliability in crisis, camaraderie, helpfulness, loyalty)" },
  { id: 4, title: "4. Self Assessment", question: "What kind of person do you consider yourself to be? (Your core strengths and 2 genuine areas of self-improvement)" },
  { id: 5, title: "5. Aim in Life & Future Persona", question: "What kind of person and officer do you wish to develop into? (Values, career goals, personal standards)" }
];

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
  const [showMobileScreenNoticeModal, setShowMobileScreenNoticeModal] = useState(false);

  // Media Streams
  const userMediaStreamRef = useRef<MediaStream | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const userGalleryVideoRef = useRef<HTMLVideoElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Screen Share & Presentation States
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenShareType, setScreenShareType] = useState<'native' | 'whiteboard' | 'photo' | 'tat' | 'wat' | 'srt' | 'sdt' | 'piq' | 'camera'>('native');
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

  // ──────────────────────────────────────────────────────────
  // SSB SIMULATION ENGINE STATES (WITH CHANGEABLE TIMERS)
  // ──────────────────────────────────────────────────────────
  const [drillTab, setDrillTab] = useState<'tat' | 'wat' | 'srt' | 'sdt' | 'piq'>('tat');
  const [simIsRunning, setSimIsRunning] = useState(true);
  const [simSoundEnabled, setSimSoundEnabled] = useState(true);

  // 1. TAT State (12 Real Slides: 30s Observe + 4m Write)
  const [tatSlideIndex, setTatSlideIndex] = useState(0); // 0 to 11
  const [tatPhase, setTatPhase] = useState<'observe' | 'write'>('observe');
  const [tatObserveDuration, setTatObserveDuration] = useState(30); // 15, 30, 45, 60
  const [tatWriteDuration, setTatWriteDuration] = useState(240); // 60, 120, 180, 240
  const [tatTimeRemaining, setTatTimeRemaining] = useState(30);
  const [tatStories, setTatStories] = useState<Record<number, string>>({});
  const [tatCurrentStory, setTatCurrentStory] = useState('');
  const [showTatSettings, setShowTatSettings] = useState(false);

  // 2. WAT State (60 Real SSB Words: 15s Per Word)
  const [watIndex, setWatIndex] = useState(0); // 0 to 59
  const [watDuration, setWatDuration] = useState(15); // 10, 12, 15, 20
  const [watTimeRemaining, setWatTimeRemaining] = useState(15);
  const [watResponses, setWatResponses] = useState<Record<number, string>>({});
  const [watCurrentInput, setWatCurrentInput] = useState('');
  const [showWatSettings, setShowWatSettings] = useState(false);

  // 3. SRT State (15 Real SSB Crisis Scenarios: 30s Per Situation)
  const [srtIndex, setSrtIndex] = useState(0); // 0 to 14
  const [srtDuration, setSrtDuration] = useState(30); // 20, 30, 45, 60
  const [srtTimeRemaining, setSrtTimeRemaining] = useState(30);
  const [srtResponses, setSrtResponses] = useState<Record<number, string>>({});
  const [srtCurrentInput, setSrtCurrentInput] = useState('');
  const [showSrtSettings, setShowSrtSettings] = useState(false);

  // 4. SDT State (5 Official Pillars: 15 Minutes Total)
  const [sdtSection, setSdtSection] = useState(0); // 0 to 4
  const [sdtDuration, setSdtDuration] = useState(900); // 900s = 15m
  const [sdtTimeRemaining, setSdtTimeRemaining] = useState(900);
  const [sdtResponses, setSdtResponses] = useState<Record<number, string>>({});
  const [showSdtSettings, setShowSdtSettings] = useState(false);

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
    if (screenVideoRef.current && screenStream && (screenShareType === 'native' || screenShareType === 'camera')) {
      screenVideoRef.current.muted = true;
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

    // Check if user is on mobile/tablet browser
    const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobileDevice) {
      setShowMobileScreenNoticeModal(true);
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      alert('Screen sharing is not supported by your current browser. Please open on Desktop Google Chrome, Microsoft Edge, or Firefox.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
        },
        audio: false
      });

      if (screenStream) {
        screenStream.getTracks().forEach(t => t.stop());
      }

      setScreenStream(stream);
      setScreenShareType('native');
      setIsSharingScreen(true);

      const track = stream.getVideoTracks()[0];
      if (track) {
        track.onended = () => stopScreenShare();
      }

      setTimeout(() => {
        if (screenVideoRef.current) {
          screenVideoRef.current.muted = true;
          screenVideoRef.current.srcObject = stream;
          screenVideoRef.current.play().catch(e => console.warn('Video play notice:', e));
        }
      }, 100);
    } catch (err: any) {
      console.warn('Native screen share error:', err);
      if (err.name === 'NotAllowedError') {
        // User clicked cancel in browser screen selection dialog
        return;
      }
      alert('Could not start screen sharing: ' + (err.message || 'Please check browser screen permissions.'));
    }
  };

  const startDocumentCamera = async () => {
    setShowShareOptionsModal(false);
    setShowMobileMoreSheet(false);
    setShowMobileScreenNoticeModal(false);

    try {
      if (screenStream) {
        screenStream.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      setScreenStream(stream);
      setScreenShareType('camera');
      setIsSharingScreen(true);

      const track = stream.getVideoTracks()[0];
      if (track) {
        track.onended = () => stopScreenShare();
      }

      setTimeout(() => {
        if (screenVideoRef.current) {
          screenVideoRef.current.muted = true;
          screenVideoRef.current.srcObject = stream;
          screenVideoRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (err: any) {
      console.warn('Document camera error, falling back to whiteboard:', err);
      startPresentation('whiteboard');
    }
  };

  const playAudioCue = (type: 'bell' | 'tick') => {
    if (!simSoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'bell') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch {}
  };

  // Active Timer for SSB Simulations (TAT, WAT, SRT, SDT)
  useEffect(() => {
    if (!simIsRunning) return;

    const interval = setInterval(() => {
      // 1. TAT Timer (active on stage or in drawer)
      if (screenShareType === 'tat' || (activeDrawer === 'drills' && drillTab === 'tat')) {
        setTatTimeRemaining(prev => {
          if (prev <= 1) {
            playAudioCue('bell');
            if (tatPhase === 'observe') {
              setTatPhase('write');
              return tatWriteDuration;
            } else {
              setTatPhase('observe');
              setTatSlideIndex(curr => (curr + 1) % 12);
              return tatObserveDuration;
            }
          }
          if (prev <= 4 && prev > 1 && tatPhase === 'observe') {
            playAudioCue('tick');
          }
          return prev - 1;
        });
      }

      // 2. WAT Timer (active on stage or in drawer)
      if (screenShareType === 'wat' || (activeDrawer === 'drills' && drillTab === 'wat')) {
        setWatTimeRemaining(prev => {
          if (prev <= 1) {
            playAudioCue('bell');
            setWatIndex(curr => (curr + 1) % ssbWatWords.length);
            return watDuration;
          }
          if (prev <= 4 && prev > 1) {
            playAudioCue('tick');
          }
          return prev - 1;
        });
      }

      // 3. SRT Timer (active on stage or in drawer)
      if (screenShareType === 'srt' || (activeDrawer === 'drills' && drillTab === 'srt')) {
        setSrtTimeRemaining(prev => {
          if (prev <= 1) {
            playAudioCue('bell');
            setSrtIndex(curr => (curr + 1) % ssbSrtSituations.length);
            return srtDuration;
          }
          if (prev <= 4 && prev > 1) {
            playAudioCue('tick');
          }
          return prev - 1;
        });
      }

      // 4. SDT Timer
      if (screenShareType === 'sdt' || (activeDrawer === 'drills' && drillTab === 'sdt')) {
        setSdtTimeRemaining(prev => Math.max(0, prev - 1));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [simIsRunning, screenShareType, activeDrawer, drillTab, tatPhase, tatObserveDuration, tatWriteDuration, watDuration, srtDuration, simSoundEnabled]);

  const startPresentation = (type: 'whiteboard' | 'photo' | 'tat' | 'wat' | 'srt' | 'sdt' | 'piq') => {
    setShowShareOptionsModal(false);
    setShowMobileMoreSheet(false);
    setShowMobileScreenNoticeModal(false);
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
      setScreenStream(null);
    }
    setScreenShareType(type);
    setIsSharingScreen(true);
    setSimIsRunning(true);
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
    <div className="fixed inset-0 z-[100] bg-[#0E0E0E] text-white flex flex-col justify-between overflow-hidden font-sans">
      
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
      <div className="flex-1 relative flex overflow-hidden w-full">
        
        {/* Main Stage Viewport (Fluid Touch-Scroll on Mobile) */}
        <main className="flex-1 relative bg-black flex flex-col sm:items-center sm:justify-center p-1 sm:p-3 overflow-y-auto overscroll-contain touch-scroll">
          
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
            <div className="relative w-full min-h-full sm:h-full rounded-xl sm:rounded-2xl bg-[#0A0A0A] border border-[#222] shadow-2xl flex flex-col overflow-y-auto sm:overflow-hidden touch-scroll">
              
              {/* Share Top Bar (Sticky on mobile scroll) */}
              <div className="h-8 sm:h-9 px-3 bg-[#181818] border-b border-[#252525] flex items-center justify-between text-xs text-emerald-400 shrink-0 z-20 sticky top-0">
                <div className="flex items-center gap-1.5 font-medium truncate">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate">
                    {screenShareType === 'native' && 'Live Computer Screen Broadcast (Full Screen)'}
                    {screenShareType === 'camera' && 'Live Document & Desk Camera Presenter'}
                    {screenShareType === 'whiteboard' && 'Interactive Tactical Whiteboard Canvas'}
                    {screenShareType === 'photo' && 'Candidate Document & Story Presentation'}
                    {screenShareType === 'tat' && 'TAT Psychological Slide Deck (12 Slides)'}
                    {screenShareType === 'wat' && 'WAT Word Association (60 Words)'}
                    {screenShareType === 'srt' && 'SRT Situation Reaction (15 Scenarios)'}
                    {screenShareType === 'sdt' && 'SDT Self Description (5 Pillars)'}
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

              {/* Share Content Viewport (Fluid Touch-Scroll) */}
              <div className="flex-1 relative bg-black flex flex-col items-center justify-start sm:justify-center p-1 sm:p-3 overflow-y-auto overscroll-contain touch-scroll w-full">
                
                {/* 1. Native Display Media Stream or Live Document Camera */}
                {(screenShareType === 'native' || screenShareType === 'camera') && (
                  <video
                    ref={(el) => {
                      screenVideoRef.current = el;
                      if (el && screenStream) {
                        el.muted = true;
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

                {/* 4. REAL INTERACTIVE TAT SIMULATION (12 SLIDES WITH CHANGEABLE TIMERS) */}
                {screenShareType === 'tat' && (
                  <div className="w-full max-w-4xl min-h-full flex flex-col justify-start p-2 sm:p-4 text-center overflow-y-auto overscroll-contain touch-scroll space-y-3 pb-16 sm:pb-4">
                    
                    {/* Top Controls Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-[#181818] border border-[#2B2B2B] text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-gold font-mono text-sm">
                          Slide {tatSlideIndex + 1}/12
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                          tatPhase === 'observe' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {tatPhase === 'observe' ? `Observation (${tatTimeRemaining}s)` : `Writing (${Math.floor(tatTimeRemaining / 60)}m ${tatTimeRemaining % 60}s)`}
                        </span>
                      </div>

                      {/* Simulation Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSimIsRunning(!simIsRunning)}
                          className="px-2.5 py-1 rounded-lg bg-[#252525] hover:bg-[#303030] text-gray-200 text-xs font-semibold flex items-center gap-1 border border-white/10"
                        >
                          {simIsRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>{simIsRunning ? 'Pause' : 'Resume'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setTatTimeRemaining(tatPhase === 'observe' ? tatObserveDuration : tatWriteDuration);
                            setSimIsRunning(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#252525] hover:bg-[#303030] text-gray-300 border border-white/10"
                          title="Restart Slide Timer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setSimSoundEnabled(!simSoundEnabled)}
                          className={`p-1.5 rounded-lg border ${simSoundEnabled ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/40' : 'bg-[#252525] text-gray-400 border-white/10'}`}
                          title="Buzzer Sound Chime"
                        >
                          {simSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => setShowTatSettings(!showTatSettings)}
                          className="px-2.5 py-1 rounded-lg bg-brand-gold text-brand-dark font-bold text-xs flex items-center gap-1 shadow"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Change Time</span>
                        </button>
                      </div>
                    </div>

                    {/* Changeable Timing Dropdown/Settings Drawer */}
                    {showTatSettings && (
                      <div className="p-3 my-2 rounded-xl bg-[#202020] border border-brand-gold/50 text-left text-xs space-y-2.5 animate-fadeIn">
                        <div className="flex items-center justify-between font-bold text-brand-gold">
                          <span>SSB Psychological Timing Settings</span>
                          <button onClick={() => setShowTatSettings(false)} className="text-gray-400 hover:text-white">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-gray-300 font-medium block mb-1">Observation Time (Per Picture):</label>
                            <div className="flex gap-1.5">
                              {[15, 30, 45, 60].map(sec => (
                                <button
                                  key={sec}
                                  onClick={() => {
                                    setTatObserveDuration(sec);
                                    if (tatPhase === 'observe') setTatTimeRemaining(sec);
                                  }}
                                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-mono font-semibold transition-colors ${
                                    tatObserveDuration === sec 
                                      ? 'bg-brand-gold text-brand-dark' 
                                      : 'bg-[#2A2A2A] text-gray-300 hover:text-white'
                                  }`}
                                >
                                  {sec}s {sec === 30 && '(SSB)'}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-gray-300 font-medium block mb-1">Story Formulation Time:</label>
                            <div className="flex gap-1.5">
                              {[60, 120, 180, 240].map(sec => (
                                <button
                                  key={sec}
                                  onClick={() => {
                                    setTatWriteDuration(sec);
                                    if (tatPhase === 'write') setTatTimeRemaining(sec);
                                  }}
                                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-mono font-semibold transition-colors ${
                                    tatWriteDuration === sec 
                                      ? 'bg-brand-gold text-brand-dark' 
                                      : 'bg-[#2A2A2A] text-gray-300 hover:text-white'
                                  }`}
                                >
                                  {sec / 60}m {sec === 240 && '(SSB)'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stage Presentation Viewport */}
                    <div className="flex-1 my-2 flex items-center justify-center relative min-h-[40vh] max-h-[55vh]">
                      {tatSlideIndex === 11 ? (
                        /* Slide 12: Blank Canvas */
                        <div className="w-full h-full max-w-2xl aspect-[4/3] rounded-2xl bg-[#090909] border-2 border-dashed border-brand-gold/40 flex flex-col items-center justify-center p-6 text-center shadow-2xl">
                          <span className="text-3xl font-black font-mono text-brand-gold mb-2">OFFICIAL SSB BLANK SLIDE</span>
                          <p className="text-xs text-gray-400 max-w-md leading-relaxed">
                            Conceive your own active protagonist, realistic crisis/situation, practical action taken, and positive outcome.
                          </p>
                          <span className="mt-4 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-gold font-mono text-[10px]">
                            Slide 12 of 12 · Self-Actualization Test
                          </span>
                        </div>
                      ) : (
                        /* Slides 1 to 11 */
                        <div className="relative w-full h-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl">
                          <img
                            src={ssbTatSlides[tatSlideIndex].imageUrl}
                            alt={ssbTatSlides[tatSlideIndex].title}
                            className={`w-full h-full object-cover filter contrast-125 brightness-95 grayscale transition-transform duration-700 ${
                              tatPhase === 'observe' ? 'scale-105' : 'scale-100 opacity-70'
                            }`}
                          />

                          {/* Phase Overlay */}
                          {tatPhase === 'write' && (
                            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm p-4 flex flex-col justify-center items-center text-center">
                              <span className="text-brand-gold font-mono text-xs uppercase font-bold tracking-widest mb-1">
                                Story Formulation Phase
                              </span>
                              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                Write Your Psychological Story
                              </h3>
                              <div className="bg-[#181818]/90 p-3 rounded-xl border border-white/10 text-left text-xs max-w-md space-y-1.5 font-mono text-gray-300">
                                <p><strong className="text-brand-gold">1. Hero:</strong> Age, Gender, Mood (P/N/N)</p>
                                <p><strong className="text-brand-gold">2. Past:</strong> What led up to the situation?</p>
                                <p><strong className="text-brand-gold">3. Present:</strong> What is happening right now?</p>
                                <p><strong className="text-brand-gold">4. Future:</strong> Logical positive resolution?</p>
                              </div>
                            </div>
                          )}

                          {/* Live Observation Timer Watermark */}
                          <div className="absolute bottom-2 right-2 bg-black/80 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-brand-gold border border-white/10 flex items-center gap-1.5 shadow-xl">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{tatTimeRemaining}s</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Slide Navigation Bar */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <button
                          onClick={() => {
                            setTatSlideIndex(prev => (prev === 0 ? 11 : prev - 1));
                            setTatPhase('observe');
                            setTatTimeRemaining(tatObserveDuration);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#202020] hover:bg-[#2C2C2C] text-gray-200 flex items-center gap-1 font-semibold border border-white/10"
                        >
                          <ChevronLeft className="w-4 h-4" /> Previous Slide
                        </button>

                        {/* Slide Selector Pills (1 to 12) */}
                        <div className="hidden sm:flex items-center gap-1">
                          {ssbTatSlides.map((slide, idx) => (
                            <button
                              key={slide.id}
                              onClick={() => {
                                setTatSlideIndex(idx);
                                setTatPhase('observe');
                                setTatTimeRemaining(tatObserveDuration);
                              }}
                              className={`w-7 h-7 rounded-lg text-[10px] font-mono font-bold transition-all ${
                                tatSlideIndex === idx
                                  ? 'bg-brand-gold text-brand-dark scale-110 shadow-lg'
                                  : 'bg-[#202020] text-gray-400 hover:text-white'
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setTatSlideIndex(prev => (prev === 11 ? 0 : prev + 1));
                            setTatPhase('observe');
                            setTatTimeRemaining(tatObserveDuration);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-brand-gold text-brand-dark flex items-center gap-1 font-bold shadow"
                        >
                          Next Slide <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {/* 5. REAL INTERACTIVE WAT SIMULATION (60 WORDS WITH CHANGEABLE TIMERS) */}
                {screenShareType === 'wat' && (
                  <div className="w-full max-w-2xl min-h-full flex flex-col justify-start p-3 sm:p-5 text-center overflow-y-auto overscroll-contain touch-scroll space-y-4 pb-16 sm:pb-4">
                    
                    {/* Top Control Bar */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#181818] border border-[#2B2B2B] text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-gold font-mono text-sm">
                          Word {watIndex + 1}/60
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-[10px]">
                          15s Rapid OLQ Flash
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSimIsRunning(!simIsRunning)}
                          className="px-2.5 py-1 rounded-lg bg-[#252525] hover:bg-[#303030] text-gray-200 text-xs font-semibold flex items-center gap-1 border border-white/10"
                        >
                          {simIsRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>{simIsRunning ? 'Pause' : 'Resume'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setWatTimeRemaining(watDuration);
                            setSimIsRunning(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#252525] hover:bg-[#303030] text-gray-300 border border-white/10"
                          title="Restart Word Timer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setSimSoundEnabled(!simSoundEnabled)}
                          className={`p-1.5 rounded-lg border ${simSoundEnabled ? 'bg-brand-gold/20 text-brand-gold border-brand-gold/40' : 'bg-[#252525] text-gray-400 border-white/10'}`}
                        >
                          {simSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => setShowWatSettings(!showWatSettings)}
                          className="px-2.5 py-1 rounded-lg bg-brand-gold text-brand-dark font-bold text-xs flex items-center gap-1 shadow"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Timer</span>
                        </button>
                      </div>
                    </div>

                    {/* Change Timing Bar */}
                    {showWatSettings && (
                      <div className="p-3 my-2 rounded-xl bg-[#202020] border border-brand-gold/50 text-left text-xs space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between font-bold text-brand-gold">
                          <span>Change Word Flash Duration</span>
                          <button onClick={() => setShowWatSettings(false)} className="text-gray-400 hover:text-white">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          {[10, 12, 15, 20].map(sec => (
                            <button
                              key={sec}
                              onClick={() => {
                                setWatDuration(sec);
                                setWatTimeRemaining(sec);
                              }}
                              className={`flex-1 py-1.5 rounded-xl font-mono text-xs font-semibold ${
                                watDuration === sec 
                                  ? 'bg-brand-gold text-brand-dark' 
                                  : 'bg-[#2A2A2A] text-gray-300 hover:text-white'
                              }`}
                            >
                              {sec}s {sec === 15 ? '(SSB Standard)' : sec === 10 ? '(Rapid)' : ''}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Central Word Stimulus Card */}
                    <div className="my-auto py-8 sm:py-12 px-6 rounded-3xl bg-[#141414] border-2 border-brand-gold/40 flex flex-col items-center justify-center space-y-5 shadow-2xl relative">
                      
                      {/* Circular Timer Ring Indicator */}
                      <div className="relative w-20 h-20 flex items-center justify-center">
                        <div className="text-3xl font-black font-mono text-brand-gold">
                          {watTimeRemaining}s
                        </div>
                      </div>

                      {/* Display Word */}
                      <h2 className="text-4xl sm:text-6xl font-black font-mono text-brand-gold tracking-widest drop-shadow-md">
                        {ssbWatWords[watIndex]}
                      </h2>

                      <p className="text-xs text-gray-400 font-mono max-w-sm">
                        Formulate an active, original, character-driven sentence demonstrating Officer Like Qualities.
                      </p>

                      {/* Fast Sentence Input on Stage */}
                      <div className="w-full max-w-md pt-2">
                        <input
                          value={watCurrentInput}
                          onChange={(e) => setWatCurrentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && watCurrentInput.trim()) {
                              setWatResponses(prev => ({ ...prev, [watIndex]: watCurrentInput.trim() }));
                              setWatCurrentInput('');
                              setWatIndex(curr => (curr + 1) % ssbWatWords.length);
                              setWatTimeRemaining(watDuration);
                            }
                          }}
                          placeholder={`Type response for "${ssbWatWords[watIndex]}" (Press Enter)...`}
                          className="w-full bg-[#1F1F1F] border border-[#3A3A3A] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-center font-medium"
                        />
                      </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="flex items-center justify-between text-xs pt-2">
                      <button
                        onClick={() => {
                          setWatIndex(prev => (prev === 0 ? ssbWatWords.length - 1 : prev - 1));
                          setWatTimeRemaining(watDuration);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#202020] hover:bg-[#2C2C2C] text-gray-200 flex items-center gap-1 font-semibold border border-white/10"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </button>

                      <div className="text-[11px] font-mono text-gray-400">
                        Completed: {Object.keys(watResponses).length} / 60
                      </div>

                      <button
                        onClick={() => {
                          if (watCurrentInput.trim()) {
                            setWatResponses(prev => ({ ...prev, [watIndex]: watCurrentInput.trim() }));
                            setWatCurrentInput('');
                          }
                          setWatIndex(prev => (prev + 1) % ssbWatWords.length);
                          setWatTimeRemaining(watDuration);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-gold text-brand-dark flex items-center gap-1 font-bold shadow"
                      >
                        Next Word <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}

                {/* 6. REAL INTERACTIVE SRT SIMULATION (15 SITUATIONS WITH CHANGEABLE TIMERS) */}
                {screenShareType === 'srt' && (
                  <div className="w-full max-w-2xl min-h-full flex flex-col justify-start p-3 sm:p-5 text-center overflow-y-auto overscroll-contain touch-scroll space-y-4 pb-16 sm:pb-4">
                    {/* Top Control Bar */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#181818] border border-[#2B2B2B] text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-gold font-mono text-sm">
                          Situation {srtIndex + 1}/15
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono text-[10px]">
                          30s Crisis Reaction
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSimIsRunning(!simIsRunning)}
                          className="px-2.5 py-1 rounded-lg bg-[#252525] hover:bg-[#303030] text-gray-200 text-xs font-semibold flex items-center gap-1 border border-white/10"
                        >
                          {simIsRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                          <span>{simIsRunning ? 'Pause' : 'Resume'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setSrtTimeRemaining(srtDuration);
                            setSimIsRunning(true);
                          }}
                          className="p-1.5 rounded-lg bg-[#252525] text-gray-300 border border-white/10"
                          title="Restart Situation Timer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setShowSrtSettings(!showSrtSettings)}
                          className="px-2.5 py-1 rounded-lg bg-brand-gold text-brand-dark font-bold text-xs flex items-center gap-1"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>Timer</span>
                        </button>
                      </div>
                    </div>

                    {/* Change SRT Timing */}
                    {showSrtSettings && (
                      <div className="p-3 my-2 rounded-xl bg-[#202020] border border-brand-gold/50 text-left text-xs space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between font-bold text-brand-gold">
                          <span>Change Situation Timer</span>
                          <button onClick={() => setShowSrtSettings(false)} className="text-gray-400 hover:text-white">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex gap-2">
                          {[20, 30, 45, 60].map(sec => (
                            <button
                              key={sec}
                              onClick={() => {
                                setSrtDuration(sec);
                                setSrtTimeRemaining(sec);
                              }}
                              className={`flex-1 py-1.5 rounded-xl font-mono text-xs font-semibold ${
                                srtDuration === sec 
                                  ? 'bg-brand-gold text-brand-dark' 
                                  : 'bg-[#2A2A2A] text-gray-300 hover:text-white'
                              }`}
                            >
                              {sec}s {sec === 30 && '(SSB Standard)'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Situation Card */}
                    <div className="my-auto p-6 sm:p-8 rounded-3xl bg-[#141414] border-2 border-brand-gold/40 flex flex-col items-center justify-center space-y-4 shadow-2xl">
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                        Real-Life SSB Dilemma · {srtTimeRemaining}s Left
                      </span>
                      
                      <p className="text-base sm:text-lg text-white font-medium leading-relaxed max-w-lg text-left bg-[#1B1B1B] p-4 rounded-xl border border-white/10">
                        {ssbSrtSituations[srtIndex].text}
                      </p>

                      <div className="w-full max-w-lg">
                        <input
                          value={srtCurrentInput}
                          onChange={(e) => setSrtCurrentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && srtCurrentInput.trim()) {
                              setSrtResponses(prev => ({ ...prev, [srtIndex]: srtCurrentInput.trim() }));
                              setSrtCurrentInput('');
                              setSrtIndex(curr => (curr + 1) % ssbSrtSituations.length);
                              setSrtTimeRemaining(srtDuration);
                            }
                          }}
                          placeholder="Type quick spontaneous action (Press Enter)..."
                          className="w-full bg-[#1F1F1F] border border-[#3A3A3A] rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="flex items-center justify-between text-xs pt-2">
                      <button
                        onClick={() => {
                          setSrtIndex(prev => (prev === 0 ? ssbSrtSituations.length - 1 : prev - 1));
                          setSrtTimeRemaining(srtDuration);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#202020] text-gray-200 flex items-center gap-1 font-semibold"
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </button>

                      <span className="text-xs font-mono text-gray-400">
                        Answered: {Object.keys(srtResponses).length} / 15
                      </span>

                      <button
                        onClick={() => {
                          if (srtCurrentInput.trim()) {
                            setSrtResponses(prev => ({ ...prev, [srtIndex]: srtCurrentInput.trim() }));
                            setSrtCurrentInput('');
                          }
                          setSrtIndex(prev => (prev + 1) % ssbSrtSituations.length);
                          setSrtTimeRemaining(srtDuration);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-gold text-brand-dark flex items-center gap-1 font-bold"
                      >
                        Next Situation <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. REAL INTERACTIVE SDT SIMULATION (5 PILLARS) */}
                {screenShareType === 'sdt' && (
                  <div className="w-full max-w-2xl min-h-full flex flex-col justify-start p-3 sm:p-5 text-center overflow-y-auto overscroll-contain touch-scroll space-y-4 pb-16 sm:pb-4">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#181818] border border-[#2B2B2B] text-xs">
                      <span className="font-bold text-brand-gold font-mono">
                        Pillar {sdtSection + 1}/5: {ssbSdtPillars[sdtSection].title}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">
                        {Math.floor(sdtTimeRemaining / 60)}m {sdtTimeRemaining % 60}s Left
                      </span>
                    </div>

                    <div className="my-auto p-6 rounded-2xl bg-[#141414] border border-brand-gold/40 text-left space-y-4">
                      <h3 className="text-lg font-bold text-brand-gold font-mono">{ssbSdtPillars[sdtSection].title}</h3>
                      <p className="text-xs text-gray-300 leading-relaxed">{ssbSdtPillars[sdtSection].question}</p>
                      
                      <textarea
                        rows={6}
                        value={sdtResponses[sdtSection] || ''}
                        onChange={(e) => setSdtResponses(prev => ({ ...prev, [sdtSection]: e.target.value }))}
                        placeholder="Formulate your structured paragraph for this pillar..."
                        className="w-full bg-[#1C1C1C] border border-[#333] rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold leading-relaxed"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <button
                        onClick={() => setSdtSection(prev => Math.max(0, prev - 1))}
                        disabled={sdtSection === 0}
                        className="px-3 py-1.5 rounded-xl bg-[#202020] text-gray-200 disabled:opacity-40"
                      >
                        Previous Pillar
                      </button>
                      <button
                        onClick={() => setSdtSection(prev => Math.min(4, prev + 1))}
                        disabled={sdtSection === 4}
                        className="px-3 py-1.5 rounded-xl bg-brand-gold text-brand-dark font-bold disabled:opacity-40"
                      >
                        Next Pillar
                      </button>
                    </div>
                  </div>
                )}

                {/* 8. PIQ Form */}
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
                <div className="flex-1 overflow-y-auto overscroll-contain touch-scroll p-3 sm:p-4 space-y-3 text-xs">
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
              <div className="flex-1 overflow-y-auto overscroll-contain touch-scroll p-4 space-y-2.5 text-xs pb-24 sm:pb-6">
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
                {/* Tab Strip: All SSB Simulations */}
                <div className="grid grid-cols-5 p-1.5 bg-[#121212] border-b border-[#242424] text-[11px] font-semibold gap-1">
                  <button
                    onClick={() => setDrillTab('tat')}
                    className={`py-1 rounded-md transition-colors ${drillTab === 'tat' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-gray-400 hover:text-white'}`}
                  >
                    TAT (12)
                  </button>
                  <button
                    onClick={() => setDrillTab('wat')}
                    className={`py-1 rounded-md transition-colors ${drillTab === 'wat' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-gray-400 hover:text-white'}`}
                  >
                    WAT (60)
                  </button>
                  <button
                    onClick={() => setDrillTab('srt')}
                    className={`py-1 rounded-md transition-colors ${drillTab === 'srt' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-gray-400 hover:text-white'}`}
                  >
                    SRT (15)
                  </button>
                  <button
                    onClick={() => setDrillTab('sdt')}
                    className={`py-1 rounded-md transition-colors ${drillTab === 'sdt' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-gray-400 hover:text-white'}`}
                  >
                    SDT (5)
                  </button>
                  <button
                    onClick={() => setDrillTab('piq')}
                    className={`py-1 rounded-md transition-colors ${drillTab === 'piq' ? 'bg-brand-gold text-brand-dark font-bold' : 'text-gray-400 hover:text-white'}`}
                  >
                    PIQ
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain touch-scroll p-3 sm:p-4 space-y-3 text-xs pb-24 sm:pb-6">
                  
                  {/* ── TAB 1: TAT DRILL (12 SLIDES WITH CHANGEABLE TIMINGS) ── */}
                  {drillTab === 'tat' && (
                    <div className="space-y-3">
                      {/* Status & Timing Header */}
                      <div className="p-2.5 rounded-xl bg-[#1E1E1E] border border-[#303030] flex justify-between items-center">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase font-mono">
                            Slide {tatSlideIndex + 1} of 12
                          </span>
                          <p className="font-bold text-white text-xs">
                            {tatPhase === 'observe' ? '30s Observation Phase' : '4m Story Formulation'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-brand-gold font-mono">
                            {tatPhase === 'observe' ? `${tatTimeRemaining}s` : `${Math.floor(tatTimeRemaining / 60)}m ${tatTimeRemaining % 60}s`}
                          </span>
                          <button
                            onClick={() => setSimIsRunning(!simIsRunning)}
                            className="p-1 rounded bg-[#2A2A2A] text-gray-300"
                          >
                            {simIsRunning ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                          </button>
                        </div>
                      </div>

                      {/* Changeable Timing Buttons */}
                      <div className="p-2 rounded-xl bg-[#181818] border border-white/5 space-y-1.5 text-[11px]">
                        <span className="text-gray-400 block font-mono">Change Slide Observation Time:</span>
                        <div className="flex gap-1">
                          {[15, 30, 45, 60].map(sec => (
                            <button
                              key={sec}
                              onClick={() => {
                                setTatObserveDuration(sec);
                                if (tatPhase === 'observe') setTatTimeRemaining(sec);
                              }}
                              className={`flex-1 py-1 rounded text-[10px] font-mono font-semibold ${
                                tatObserveDuration === sec ? 'bg-brand-gold text-brand-dark' : 'bg-[#252525] text-gray-300'
                              }`}
                            >
                              {sec}s {sec === 30 && '★'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Slide Thumbnail & Title */}
                      <div className="p-2 rounded-xl bg-[#161616] border border-white/10 flex items-center gap-2.5">
                        {tatSlideIndex === 11 ? (
                          <div className="w-14 h-10 rounded bg-black border border-dashed border-brand-gold/50 flex items-center justify-center text-[9px] font-mono text-brand-gold shrink-0">
                            BLANK
                          </div>
                        ) : (
                          <img
                            src={ssbTatSlides[tatSlideIndex].imageUrl}
                            alt=""
                            className="w-14 h-10 rounded object-cover filter grayscale shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate text-[11px]">{ssbTatSlides[tatSlideIndex].title}</p>
                          <p className="text-[10px] text-gray-400 truncate">{ssbTatSlides[tatSlideIndex].context}</p>
                        </div>
                      </div>

                      {/* Story Formulation Box */}
                      <div>
                        <label className="text-gray-300 font-medium block mb-1">
                          Story for Slide {tatSlideIndex + 1}:
                        </label>
                        <textarea
                          rows={6}
                          value={tatCurrentStory}
                          onChange={(e) => setTatCurrentStory(e.target.value)}
                          placeholder="Identify hero, age/gender, past events, current action taken, and logical positive outcome..."
                          className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-xs leading-relaxed"
                        />
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                          <span>Words: {tatCurrentStory.trim() ? tatCurrentStory.trim().split(/\s+/).length : 0}</span>
                          <span>Target: 100-120</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (!tatCurrentStory.trim()) return;
                            setTatStories(prev => ({ ...prev, [tatSlideIndex]: tatCurrentStory.trim() }));
                            setChatMessages(prev => [
                              ...prev,
                              {
                                sender: candidateName,
                                text: `[TAT Slide ${tatSlideIndex + 1} Story]: ${tatCurrentStory.trim()}`,
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                isMe: true,
                                tag: 'Chest 24'
                              }
                            ]);
                            setTatCurrentStory('');
                            setTatSlideIndex(prev => (prev + 1) % 12);
                            setTatPhase('observe');
                            setTatTimeRemaining(tatObserveDuration);
                          }}
                          disabled={!tatCurrentStory.trim()}
                          className="flex-1 py-2.5 rounded-xl bg-brand-gold hover:bg-brand-goldLight text-brand-dark font-bold text-xs disabled:opacity-40 transition-colors shadow"
                        >
                          Submit & Next Slide
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 2: WAT DRILL (60 WORDS WITH CHANGEABLE TIMINGS) ── */}
                  {drillTab === 'wat' && (
                    <div className="space-y-3">
                      {/* Word Banner */}
                      <div className="p-4 rounded-xl bg-[#1E1E1E] border border-brand-gold/40 text-center space-y-2">
                        <span className="text-[10px] font-mono text-gray-400">Word ({watIndex + 1}/60)</span>
                        <h4 className="text-3xl font-black font-mono tracking-widest text-brand-gold">
                          {ssbWatWords[watIndex]}
                        </h4>
                        <span className="text-sm font-mono text-emerald-400 font-bold">{watTimeRemaining}s</span>
                      </div>

                      {/* Change Timing */}
                      <div className="p-2 rounded-xl bg-[#181818] border border-white/5 space-y-1.5 text-[11px]">
                        <span className="text-gray-400 block font-mono">Change Word Timer:</span>
                        <div className="flex gap-1">
                          {[10, 12, 15, 20].map(sec => (
                            <button
                              key={sec}
                              onClick={() => {
                                setWatDuration(sec);
                                setWatTimeRemaining(sec);
                              }}
                              className={`flex-1 py-1 rounded text-[10px] font-mono font-semibold ${
                                watDuration === sec ? 'bg-brand-gold text-brand-dark' : 'bg-[#252525] text-gray-300'
                              }`}
                            >
                              {sec}s {sec === 15 && '★'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Word Input */}
                      <div className="space-y-2">
                        <input
                          value={watCurrentInput}
                          onChange={(e) => setWatCurrentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && watCurrentInput.trim()) {
                              setWatResponses(prev => ({ ...prev, [watIndex]: watCurrentInput.trim() }));
                              setWatCurrentInput('');
                              setWatIndex(idx => (idx + 1) % ssbWatWords.length);
                              setWatTimeRemaining(watDuration);
                            }
                          }}
                          placeholder={`Active sentence for "${ssbWatWords[watIndex]}"...`}
                          className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
                        />
                        
                        <button
                          onClick={() => {
                            if (watCurrentInput.trim()) {
                              setWatResponses(prev => ({ ...prev, [watIndex]: watCurrentInput.trim() }));
                              setWatCurrentInput('');
                            }
                            setWatIndex(idx => (idx + 1) % ssbWatWords.length);
                            setWatTimeRemaining(watDuration);
                          }}
                          className="w-full py-2 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs shadow"
                        >
                          Submit Word ({watIndex + 1}/60)
                        </button>
                      </div>

                      {/* Logged sentences summary */}
                      <div className="pt-2 border-t border-white/5 text-[11px] font-mono space-y-1">
                        <span className="text-gray-400">Answered: {Object.keys(watResponses).length} of 60</span>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 3: SRT DRILL (15 CRISIS SITUATIONS) ── */}
                  {drillTab === 'srt' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-[#1E1E1E] border border-[#303030] space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                          <span>Situation {srtIndex + 1}/15</span>
                          <span className="text-emerald-400 font-bold">{srtTimeRemaining}s</span>
                        </div>
                        <p className="text-xs text-white leading-relaxed font-medium">
                          {ssbSrtSituations[srtIndex].text}
                        </p>
                      </div>

                      {/* Change SRT Timing */}
                      <div className="p-2 rounded-xl bg-[#181818] border border-white/5 space-y-1 text-[10px] font-mono">
                        <span className="text-gray-400 block">Timer:</span>
                        <div className="flex gap-1">
                          {[20, 30, 45, 60].map(sec => (
                            <button
                              key={sec}
                              onClick={() => {
                                setSrtDuration(sec);
                                setSrtTimeRemaining(sec);
                              }}
                              className={`flex-1 py-1 rounded text-[10px] font-semibold ${
                                srtDuration === sec ? 'bg-brand-gold text-brand-dark' : 'bg-[#252525] text-gray-300'
                              }`}
                            >
                              {sec}s {sec === 30 && '★'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-300 font-medium block mb-1">Your Reaction:</label>
                        <textarea
                          rows={4}
                          value={srtCurrentInput}
                          onChange={(e) => setSrtCurrentInput(e.target.value)}
                          placeholder="Type immediate decisive action..."
                          className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-xs leading-relaxed"
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (srtCurrentInput.trim()) {
                            setSrtResponses(prev => ({ ...prev, [srtIndex]: srtCurrentInput.trim() }));
                            setSrtCurrentInput('');
                          }
                          setSrtIndex(prev => (prev + 1) % ssbSrtSituations.length);
                          setSrtTimeRemaining(srtDuration);
                        }}
                        className="w-full py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs"
                      >
                        Submit & Next Situation
                      </button>
                    </div>
                  )}

                  {/* ── TAB 4: SDT DRILL (5 PILLARS) ── */}
                  {drillTab === 'sdt' && (
                    <div className="space-y-3">
                      <div className="p-3 rounded-xl bg-[#1E1E1E] border border-brand-gold/40 space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className="text-brand-gold font-bold">{ssbSdtPillars[sdtSection].title}</span>
                          <span className="text-emerald-400">{Math.floor(sdtTimeRemaining / 60)}m left</span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-relaxed">
                          {ssbSdtPillars[sdtSection].question}
                        </p>
                      </div>

                      <div>
                        <textarea
                          rows={6}
                          value={sdtResponses[sdtSection] || ''}
                          onChange={(e) => setSdtResponses(prev => ({ ...prev, [sdtSection]: e.target.value }))}
                          placeholder="Write structured paragraph reflecting genuine traits..."
                          className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold text-xs leading-relaxed"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSdtSection(prev => Math.max(0, prev - 1))}
                          disabled={sdtSection === 0}
                          className="flex-1 py-2 rounded-xl bg-[#222] text-gray-300 font-semibold disabled:opacity-40"
                        >
                          Prev Pillar
                        </button>
                        <button
                          onClick={() => setSdtSection(prev => Math.min(4, prev + 1))}
                          disabled={sdtSection === 4}
                          className="flex-1 py-2 rounded-xl bg-brand-gold text-brand-dark font-bold disabled:opacity-40"
                        >
                          Next Pillar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── TAB 5: PIQ DOSSIER AUDIT ── */}
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
            className="bg-[#1A1A1A] border border-[#2E2E2E] max-w-sm w-full rounded-2xl p-5 space-y-3.5 shadow-2xl relative max-h-[85vh] overflow-y-auto overscroll-contain touch-scroll"
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
              
              {/* Option 1: Live Screen Capture (PC / Laptop Full Screen) */}
              <button
                onClick={startNativeScreenShare}
                className="w-full p-3 rounded-xl bg-[#222] hover:bg-[#2A2A2A] border border-emerald-500/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">Live Computer / PC Screen</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">PC / Mac</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">Broadcast entire desktop, window, or Chrome tab</p>
                </div>
              </button>

              {/* Option 2: Live Document & Desk Camera (Mobile / Tablet) */}
              <button
                onClick={startDocumentCamera}
                className="w-full p-3 rounded-xl bg-[#222] hover:bg-[#2A2A2A] border border-amber-500/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">Live Document & Desk Camera</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">Phone / Cam</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">Point camera at handwritten story, notes, or monitor</p>
                </div>
              </button>

              {/* Option 3: Live Finger/Mouse Whiteboard (Works 100% on all mobile & desktop!) */}
              <button
                onClick={() => startPresentation('whiteboard')}
                className="w-full p-3 rounded-xl bg-[#222] hover:bg-[#2A2A2A] border border-brand-gold/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0">
                  <PenTool className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">Live Interactive Whiteboard</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-mono">Touch & Pen</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">Sketch tactical diagrams & write notes live with finger</p>
                </div>
              </button>

              {/* Option 4: Upload Photo of Handwritten TAT Story / PIQ (Works 100% on phone gallery!) */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full p-3 rounded-xl bg-[#222] hover:bg-[#2A2A2A] border border-blue-500/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Image className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">Present Photo / Screenshot</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">Gallery</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">Select a story picture, screenshot, or PIQ from device</p>
                </div>
              </button>

              {/* Option 5: TAT Simulation Deck */}
              <button
                onClick={() => startPresentation('tat')}
                className="w-full p-3 rounded-xl bg-[#222] hover:bg-[#2A2A2A] border border-purple-500/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">TAT Psychological Test (12 Slides)</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">12 Pictures</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">30s Observation + 4m Writing with Changeable Timers</p>
                </div>
              </button>

              {/* Option 6: WAT Word Association Battery */}
              <button
                onClick={() => startPresentation('wat')}
                className="w-full p-3 rounded-xl bg-[#222] hover:bg-[#2A2A2A] border border-brand-gold/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-gold/20 text-brand-gold flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">WAT Word Association (60 Words)</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold font-mono">15s Rapid</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">60 Real SSB Defence Words with Auto-Advance</p>
                </div>
              </button>

              {/* Option 7: SRT Situation Reaction Test */}
              <button
                onClick={() => startPresentation('srt')}
                className="w-full p-3 rounded-xl bg-[#222] hover:bg-[#2A2A2A] border border-emerald-500/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">SRT Situation Reaction (15 Scenarios)</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">30s Crisis</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">Real SSB Crisis Dilemmas with Immediate Reaction</p>
                </div>
              </button>

              {/* Option 8: SDT Self Description Test */}
              <button
                onClick={() => startPresentation('sdt')}
                className="w-full p-3 rounded-xl bg-[#222] hover:bg-[#2A2A2A] border border-blue-500/30 text-left flex items-center gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">SDT Self Description (5 Pillars)</h4>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">15 Minutes</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">Parents, Teachers, Friends, Self & Aim in Life</p>
                </div>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ── 5B. MOBILE SCREEN RESTRICTION CLARIFICATION MODAL ── */}
      {showMobileScreenNoticeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowMobileScreenNoticeModal(false)}
        >
          <div
            className="bg-[#1A1A1A] border border-[#303030] max-w-sm w-full rounded-2xl p-5 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto overscroll-contain touch-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#262626] pb-2.5">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h3 className="font-bold text-sm text-white">Mobile OS Screen Sharing</h3>
              </div>
              <button onClick={() => setShowMobileScreenNoticeModal(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Mobile operating systems (<strong>iOS Safari</strong> & <strong>Android Web</strong>) do not allow websites to record external apps or your phone's home screen for security and privacy.
            </p>

            <div className="p-3 bg-[#121212] rounded-xl border border-white/5 space-y-1 text-xs">
              <p className="text-brand-gold font-semibold flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5" /> For Full Computer Screen Share:
              </p>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Open this meeting link on any <strong>PC, Mac, or Laptop browser</strong> (Chrome, Edge, Firefox) to broadcast your desktop.
              </p>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <p className="text-gray-400 font-semibold text-[11px] uppercase tracking-wider font-mono">
                Present From Your Phone Now:
              </p>
              
              <button
                onClick={startDocumentCamera}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow"
              >
                <Camera className="w-4 h-4" /> Start Live Document / Desk Camera
              </button>

              <button
                onClick={() => {
                  setShowMobileScreenNoticeModal(false);
                  startPresentation('whiteboard');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#282828] hover:bg-[#333] text-brand-gold font-semibold flex items-center justify-center gap-2 border border-brand-gold/30 transition-colors"
              >
                <PenTool className="w-4 h-4" /> Open Interactive Whiteboard
              </button>

              <button
                onClick={() => {
                  setShowMobileScreenNoticeModal(false);
                  fileInputRef.current?.click();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#282828] hover:bg-[#333] text-blue-400 font-semibold flex items-center justify-center gap-2 border border-blue-500/30 transition-colors"
              >
                <Image className="w-4 h-4" /> Upload Photo from Gallery
              </button>
            </div>

            <button
              onClick={() => setShowMobileScreenNoticeModal(false)}
              className="w-full py-2 rounded-xl text-gray-400 hover:text-white text-xs border border-white/10"
            >
              Dismiss
            </button>
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
            className="bg-[#1A1A1A] border-t border-[#2C2C2C] w-full rounded-t-3xl p-5 space-y-4 shadow-2xl relative max-h-[85vh] overflow-y-auto overscroll-contain touch-scroll pb-10"
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
                  <span>Tactical SSB Drills (TAT / WAT / SRT / SDT)</span>
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
