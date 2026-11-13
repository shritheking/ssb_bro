import React, { useState, useEffect } from 'react';
import { 
  PenTool, Clock, Play, Pause, RotateCcw, CheckCircle2, 
  Send, Sparkles, AlertCircle, Eye, ArrowRight, Save 
} from 'lucide-react';
import { 
  tatPracticeList, watPracticeWords, srtPracticeScenarios,
  TatPracticeItem 
} from '../../data/mockStudentData';
import { useToast } from '../../context/ToastContext';

export const StudentPracticePage: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'TAT' | 'WAT' | 'SRT' | 'SD'>('TAT');

  // --- TAT PRACTICE STATE ---
  const [selectedTatPrompt, setSelectedTatPrompt] = useState<TatPracticeItem>(tatPracticeList[0]);
  const [tatTimeRemaining, setTatTimeRemaining] = useState<number>(240); // 4 min
  const [isTatTimerRunning, setIsTatTimerRunning] = useState<boolean>(false);
  const [tatStoryText, setTatStoryText] = useState<string>('');
  const [tatSavedSubmissions, setTatSavedSubmissions] = useState<Array<{ id: string; prompt: string; text: string; date: string }>>(() => {
    const saved = localStorage.getItem('ssb_tat_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  // TAT timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTatTimerRunning && tatTimeRemaining > 0) {
      interval = setInterval(() => {
        setTatTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (tatTimeRemaining === 0 && isTatTimerRunning) {
      setIsTatTimerRunning(false);
      showToast('Time is up for TAT story! Conclude your draft.', 'info');
    }
    return () => clearInterval(interval);
  }, [isTatTimerRunning, tatTimeRemaining]);

  const handleStartTat = () => {
    setIsTatTimerRunning(true);
    showToast('TAT 4-Minute Timer Started', 'info');
  };

  const handlePauseTat = () => {
    setIsTatTimerRunning(false);
  };

  const handleResetTat = () => {
    setIsTatTimerRunning(false);
    setTatTimeRemaining(240);
  };

  const handleSubmitTat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tatStoryText.trim()) {
      showToast('Please write your TAT story before saving.', 'error');
      return;
    }
    const newEntry = {
      id: Math.random().toString(36).substring(2, 8),
      prompt: selectedTatPrompt.title,
      text: tatStoryText,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString()
    };
    const updated = [newEntry, ...tatSavedSubmissions];
    setTatSavedSubmissions(updated);
    localStorage.setItem('ssb_tat_submissions', JSON.stringify(updated));
    showToast('TAT Story saved to your practice log!', 'success');
  };

  // --- WAT PRACTICE STATE ---
  const [watIndex, setWatIndex] = useState<number>(0);
  const [watTimeRemaining, setWatTimeRemaining] = useState<number>(15);
  const [isWatRunning, setIsWatRunning] = useState<boolean>(false);
  const [currentWatSentence, setCurrentWatSentence] = useState<string>('');
  const [watResponses, setWatResponses] = useState<Array<{ word: string; sentence: string }>>([]);

  useEffect(() => {
    let interval: any = null;
    if (isWatRunning && watTimeRemaining > 0) {
      interval = setInterval(() => {
        setWatTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (watTimeRemaining === 0 && isWatRunning) {
      handleNextWat();
    }
    return () => clearInterval(interval);
  }, [isWatRunning, watTimeRemaining]);

  const handleStartWat = () => {
    setIsWatRunning(true);
    setWatTimeRemaining(15);
  };

  const handleNextWat = () => {
    // Record response
    const currentWord = watPracticeWords[watIndex].word;
    setWatResponses(prev => [
      ...prev,
      { word: currentWord, sentence: currentWatSentence.trim() || '(No response in 15s)' }
    ]);
    setCurrentWatSentence('');

    if (watIndex < watPracticeWords.length - 1) {
      setWatIndex(prev => prev + 1);
      setWatTimeRemaining(15);
    } else {
      setIsWatRunning(false);
      showToast('WAT Practice Drill Completed!', 'success');
    }
  };

  const handleResetWat = () => {
    setIsWatRunning(false);
    setWatIndex(0);
    setWatTimeRemaining(15);
    setCurrentWatSentence('');
    setWatResponses([]);
  };

  // --- SRT PRACTICE STATE ---
  const [srtIndex, setSrtIndex] = useState<number>(0);
  const [srtResponse, setSrtResponse] = useState<string>('');
  const [savedSrtList, setSavedSrtList] = useState<Array<{ situation: string; response: string }>>(() => {
    const saved = localStorage.getItem('ssb_srt_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSaveSrt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srtResponse.trim()) {
      showToast('Please type your reaction before saving.', 'error');
      return;
    }
    const currentSit = srtPracticeScenarios[srtIndex].situation;
    const updated = [{ situation: currentSit, response: srtResponse }, ...savedSrtList];
    setSavedSrtList(updated);
    localStorage.setItem('ssb_srt_submissions', JSON.stringify(updated));
    setSrtResponse('');
    if (srtIndex < srtPracticeScenarios.length - 1) {
      setSrtIndex(prev => prev + 1);
    }
    showToast('SRT reaction logged!', 'success');
  };

  // --- SELF DESCRIPTION STATE ---
  const [sdData, setSdData] = useState({
    parents: '',
    teachers: '',
    friends: '',
    self: '',
    goals: '',
  });

  useEffect(() => {
    const savedSd = localStorage.getItem('ssb_sd_draft');
    if (savedSd) {
      try {
        setSdData(JSON.parse(savedSd));
      } catch (e) {}
    }
  }, []);

  const handleSaveSd = () => {
    localStorage.setItem('ssb_sd_draft', JSON.stringify(sdData));
    showToast('Self-Description draft saved to local storage!', 'success');
  };

  // Format MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="space-y-1 border-b border-brand-border pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-brand-gold font-semibold tracking-wider">
            Simulated Assessment
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-text">
            Interactive Practice Centre
          </h1>
          <p className="text-xs sm:text-sm text-brand-textMuted">
            Simulate real psychological battery conditions with live timers and local demo persistence.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-brand-bgSecondary border border-brand-border shrink-0">
          {(['TAT', 'WAT', 'SRT', 'SD'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-brand-gold text-brand-lightText shadow-gold-subtle'
                  : 'text-brand-textMuted hover:text-brand-text'
              }`}
            >
              {tab === 'TAT' && 'TAT (Story)'}
              {tab === 'WAT' && 'WAT (15s Word)'}
              {tab === 'SRT' && 'SRT (Scenarios)'}
              {tab === 'SD' && 'Self-Description'}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          TAB 1: TAT PRACTICE (Thematic Apperception Test)
          ========================================================================= */}
      {activeTab === 'TAT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (5 cols): Image Prompt & Timer */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-brand-card border border-brand-border p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-brand-gold font-semibold">
                  Stimulus Image
                </span>
                <div className={`px-3 py-1 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 ${
                  tatTimeRemaining < 30 ? 'bg-red-950 text-red-400 border border-red-500/40 animate-pulse' : 'bg-brand-bgSecondary text-brand-text border border-brand-border'
                }`}>
                  <Clock className="w-3.5 h-3.5 text-brand-gold" />
                  {formatTime(tatTimeRemaining)}
                </div>
              </div>

              {/* Image Preview */}
              <div className="rounded-xl overflow-hidden bg-brand-bg border border-brand-border relative aspect-video">
                <img
                  src={selectedTatPrompt.imageUrl}
                  alt={selectedTatPrompt.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-heading font-bold text-sm text-brand-text">
                  {selectedTatPrompt.title}
                </h3>
                <p className="text-xs text-brand-textMuted italic">
                  Context Hint: {selectedTatPrompt.contextClue}
                </p>
              </div>

              {/* Timer Controls */}
              <div className="pt-2 flex items-center gap-2">
                {!isTatTimerRunning ? (
                  <button
                    onClick={handleStartTat}
                    className="flex-1 py-2 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-gold-subtle"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Start 4-Min Timer
                  </button>
                ) : (
                  <button
                    onClick={handlePauseTat}
                    className="flex-1 py-2 rounded-lg bg-brand-cardHover border border-brand-border text-brand-text text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Pause className="w-3.5 h-3.5" />
                    Pause
                  </button>
                )}

                <button
                  onClick={handleResetTat}
                  className="p-2 rounded-lg bg-brand-bgSecondary border border-brand-border text-brand-textMuted hover:text-brand-text transition-colors"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Prompt Selector */}
              <div className="pt-2 border-t border-brand-border">
                <label className="block text-[11px] font-mono text-brand-textMuted mb-2 uppercase">
                  Switch Practice Prompt:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {tatPracticeList.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedTatPrompt(p);
                        handleResetTat();
                      }}
                      className={`p-2 rounded-lg text-xs font-mono border text-center transition-colors ${
                        selectedTatPrompt.id === p.id
                          ? 'bg-brand-gold/20 border-brand-gold text-brand-gold font-bold'
                          : 'bg-brand-bg border-brand-border text-brand-textMuted hover:text-brand-text'
                      }`}
                    >
                      Prompt {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Writing Sheet */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl bg-brand-card border border-brand-border p-6 sm:p-7 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <div className="space-y-0.5">
                  <h3 className="font-heading font-bold text-base text-brand-text">
                    Candidate Story Sheet
                  </h3>
                  <p className="text-[11px] text-brand-textMuted font-mono">
                    Past (catalyst) → Present (coordinated actions) → Future (constructive outcome)
                  </p>
                </div>
                <span className="text-xs font-mono text-brand-steelLight">
                  {tatStoryText.trim() ? tatStoryText.trim().split(/\s+/).length : 0} Words
                </span>
              </div>

              <form onSubmit={handleSubmitTat} className="space-y-4">
                <textarea
                  rows={10}
                  value={tatStoryText}
                  onChange={(e) => setTatStoryText(e.target.value)}
                  placeholder="Observe the image for 30 seconds. Then write your story: Who is the protagonist? What situation led to this moment? What specific, realistic actions do they coordinate? What is the final outcome? (Avoid scripted superheroes or armed combat clichés)..."
                  className="w-full p-4 rounded-xl bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text text-xs sm:text-sm placeholder:text-brand-textMuted leading-relaxed focus:outline-none"
                />

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-brand-steelLight font-mono">
                    * Saved locally in browser storage for demo
                  </span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 transition-colors shadow-gold-subtle"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Story Submission
                  </button>
                </div>
              </form>
            </div>

            {/* Saved Submissions History */}
            {tatSavedSubmissions.length > 0 && (
              <div className="rounded-2xl bg-brand-bgSecondary border border-brand-border p-6 space-y-4">
                <h4 className="font-heading font-bold text-sm text-brand-text flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                  Recent Practice Submissions ({tatSavedSubmissions.length})
                </h4>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {tatSavedSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-xl bg-brand-card border border-brand-border space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-brand-gold font-bold">{sub.prompt}</span>
                        <span className="text-brand-textMuted">{sub.date}</span>
                      </div>
                      <p className="text-brand-textMuted line-clamp-2">
                        {sub.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: WAT PRACTICE (Word Association Test - 15s Drill)
          ========================================================================= */}
      {activeTab === 'WAT' && (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="rounded-2xl bg-brand-card border border-brand-border p-8 text-center space-y-6 shadow-2xl">
            
            {/* Top metadata */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-brand-textMuted">
                Word {watIndex + 1} of {watPracticeWords.length}
              </span>
              <div className={`px-3 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                watTimeRemaining <= 5 ? 'bg-red-950 text-red-400 border border-red-500/40 animate-pulse' : 'bg-brand-bgSecondary text-brand-gold border border-brand-border'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                {watTimeRemaining}s Remaining
              </div>
            </div>

            {/* Word Projection Display */}
            <div className="py-12 px-6 rounded-2xl bg-brand-bg border border-brand-borderGold shadow-inner space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-brand-steelLight">
                Projected Stimulus
              </span>
              <div className="font-heading text-4xl sm:text-5xl font-extrabold tracking-widest text-brand-text">
                {watPracticeWords[watIndex].word}
              </div>
              <span className="text-[11px] font-mono text-brand-textMuted block pt-1">
                Category: {watPracticeWords[watIndex].category}
              </span>
            </div>

            {/* Response Input */}
            <div className="space-y-3">
              <input
                type="text"
                autoFocus
                disabled={!isWatRunning}
                placeholder={isWatRunning ? "Type your spontaneous sentence and hit Next..." : "Click 'Start WAT Speed Drill' below to begin"}
                value={currentWatSentence}
                onChange={(e) => setCurrentWatSentence(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleNextWat();
                  }
                }}
                className="w-full px-4 py-3 rounded-xl bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text text-sm placeholder:text-brand-textMuted focus:outline-none"
              />

              <div className="flex items-center justify-between text-xs font-mono text-brand-textMuted">
                <span>Rule: Spontaneous thought, active verbs, avoid generic idioms.</span>
                <span>Press Enter for Next Word</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              {!isWatRunning ? (
                <button
                  onClick={handleStartWat}
                  className="px-6 py-2.5 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 transition-colors shadow-gold-subtle"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Start WAT Speed Drill (15s / word)
                </button>
              ) : (
                <button
                  onClick={handleNextWat}
                  className="px-6 py-2.5 rounded-lg bg-brand-cardHover border border-brand-gold text-brand-gold text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  Next Word ({watIndex + 1}/{watPracticeWords.length}) →
                </button>
              )}

              <button
                onClick={handleResetWat}
                className="p-2.5 rounded-lg bg-brand-bgSecondary border border-brand-border text-brand-textMuted hover:text-brand-text transition-colors"
                title="Reset Drill"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Completed Responses Log */}
          {watResponses.length > 0 && (
            <div className="rounded-2xl bg-brand-bgSecondary border border-brand-border p-6 space-y-4">
              <h4 className="font-heading font-bold text-sm text-brand-text">
                Your Logged WAT Responses ({watResponses.length})
              </h4>
              <div className="space-y-2">
                {watResponses.map((res, i) => (
                  <div key={i} className="p-3 rounded-lg bg-brand-card border border-brand-border flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-brand-gold w-28 shrink-0">{res.word}</span>
                    <span className="text-brand-text flex-1 text-left italic">"{res.sentence}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: SRT PRACTICE (Situation Reaction Test)
          ========================================================================= */}
      {activeTab === 'SRT' && (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="rounded-2xl bg-brand-card border border-brand-border p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between text-xs font-mono border-b border-brand-border pb-3">
              <span className="text-brand-gold font-semibold uppercase">
                Situation {srtIndex + 1} of {srtPracticeScenarios.length}
              </span>
              <span className="text-brand-steelLight">
                {srtPracticeScenarios[srtIndex].context}
              </span>
            </div>

            {/* Situation Card */}
            <div className="p-5 rounded-xl bg-brand-bg border border-brand-border text-sm sm:text-base font-medium text-brand-text leading-relaxed">
              "{srtPracticeScenarios[srtIndex].situation}"
            </div>

            {/* Reaction Form */}
            <form onSubmit={handleSaveSrt} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-brand-textMuted mb-2">
                  Your Action-Oriented Reaction (Immediate step; resource mobilization; mission completion):
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Immediately attended to passenger, located coach TTE for medical kit, asked co-passengers for water, coordinated with next junction station master for emergency ambulance..."
                  value={srtResponse}
                  onChange={(e) => setSrtResponse(e.target.value)}
                  className="w-full p-4 rounded-xl bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text text-xs sm:text-sm placeholder:text-brand-textMuted leading-relaxed focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-brand-textMuted">
                  * Limit response to 2-3 crisp, sequential action sentences.
                </span>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 transition-colors shadow-gold-subtle"
                >
                  Log Reaction & Next →
                </button>
              </div>
            </form>
          </div>

          {/* Saved SRT reactions */}
          {savedSrtList.length > 0 && (
            <div className="rounded-2xl bg-brand-bgSecondary border border-brand-border p-6 space-y-4">
              <h4 className="font-heading font-bold text-sm text-brand-text">
                Logged Situation Reactions ({savedSrtList.length})
              </h4>
              <div className="space-y-3">
                {savedSrtList.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-brand-card border border-brand-border space-y-2 text-xs">
                    <p className="font-medium text-brand-gold">Situation: "{item.situation}"</p>
                    <p className="text-brand-textMuted pl-2 border-l-2 border-brand-steelLight">
                      Action: {item.response}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 4: SELF DESCRIPTION PRACTICE (5 Dimensions)
          ========================================================================= */}
      {activeTab === 'SD' && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="rounded-2xl bg-brand-card border border-brand-border p-8 space-y-6 shadow-2xl">
            <div className="border-b border-brand-border pb-4 space-y-1">
              <span className="text-xs font-mono uppercase text-brand-gold font-semibold">
                Psychology Dossier Calibration
              </span>
              <h3 className="font-heading font-bold text-xl text-brand-text">
                Self-Description Test (SD) Draft Worksheet
              </h3>
              <p className="text-xs text-brand-textMuted leading-relaxed">
                Draft your 5 paragraphs based on real, honest feedback from parents, teachers/boss, friends, and deep self-examination.
              </p>
            </div>

            <div className="space-y-6 text-xs">
              {/* Para 1 */}
              <div className="space-y-1.5">
                <label className="block text-brand-text font-bold font-mono">
                  1. Parents' Perspective
                </label>
                <textarea
                  rows={3}
                  value={sdData.parents}
                  onChange={(e) => setSdData({ ...sdData, parents: e.target.value })}
                  placeholder="What do your parents genuinely think of you? Highlight both what they appreciate and their constructive criticism (e.g. family responsibilities, punctuality)..."
                  className="w-full p-3.5 rounded-xl bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                />
              </div>

              {/* Para 2 */}
              <div className="space-y-1.5">
                <label className="block text-brand-text font-bold font-mono">
                  2. Teachers' / Employers' Perspective
                </label>
                <textarea
                  rows={3}
                  value={sdData.teachers}
                  onChange={(e) => setSdData({ ...sdData, teachers: e.target.value })}
                  placeholder="How do professors or workplace supervisors evaluate your work ethic, teamwork, initiative, and response to deadlines?..."
                  className="w-full p-3.5 rounded-xl bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                />
              </div>

              {/* Para 3 */}
              <div className="space-y-1.5">
                <label className="block text-brand-text font-bold font-mono">
                  3. Friends' / Colleagues' Perspective
                </label>
                <textarea
                  rows={3}
                  value={sdData.friends}
                  onChange={(e) => setSdData({ ...sdData, friends: e.target.value })}
                  placeholder="What role do you play in your peer group? Are you the dependable planner, the peacemaker, or the motivator?..."
                  className="w-full p-3.5 rounded-xl bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                />
              </div>

              {/* Para 4 */}
              <div className="space-y-1.5">
                <label className="block text-brand-text font-bold font-mono">
                  4. Self-Perception (What You Think of Yourself)
                </label>
                <textarea
                  rows={3}
                  value={sdData.self}
                  onChange={(e) => setSdData({ ...sdData, self: e.target.value })}
                  placeholder="Honest self-appraisal: your fundamental strengths, how you react under stress, and what flaws you recognize in your habits..."
                  className="w-full p-3.5 rounded-xl bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                />
              </div>

              {/* Para 5 */}
              <div className="space-y-1.5">
                <label className="block text-brand-text font-bold font-mono">
                  5. Target Personality (Traits You Wish to Cultivate)
                </label>
                <textarea
                  rows={3}
                  value={sdData.goals}
                  onChange={(e) => setSdData({ ...sdData, goals: e.target.value })}
                  placeholder="Concrete personal traits you are actively working to improve (e.g. running stamina, public speaking, active listening) with steps already underway..."
                  className="w-full p-3.5 rounded-xl bg-brand-bgSecondary border border-brand-border focus:border-brand-gold text-brand-text placeholder:text-brand-textMuted focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-brand-border">
                <span className="text-[11px] font-mono text-brand-steelLight">
                  Draft automatically saved to local storage
                </span>
                <button
                  type="button"
                  onClick={handleSaveSd}
                  className="px-6 py-2.5 rounded-lg bg-brand-gold hover:bg-brand-goldLight text-brand-lightText text-xs font-semibold flex items-center gap-2 transition-colors shadow-gold-subtle"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Self-Description Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
