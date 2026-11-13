export interface JourneyMilestone {
  id: string;
  category: 'motivation' | 'preparation' | 'attempt' | 'recommendation' | 'final';
  title: string;
  subtitle: string;
  dateOrYear: string;
  board?: string;
  entry?: string;
  chestNo?: number;
  outcome?: 'Conferenced Out' | 'Recommended' | 'Selected';
  batchStats?: {
    reported?: number;
    screenedIn?: number;
    recommended?: number;
  };
  summary: string;
  detailedNarrative: string;
  lessons: string[];
  keyTakeaway: string;
  imageTheme: string;
}

export const journeyMilestones: JourneyMilestone[] = [
  {
    id: 'milestone-1-motivation',
    category: 'motivation',
    title: 'The Spark: Awakening of Purpose',
    subtitle: 'From uncertain career paths to a resolute defence aspiration',
    dateOrYear: 'Early 2017',
    summary: 'Prior to 2017, military life was not on Vamshi\'s active radar. He contemplated standard paths like IAS, civil aviation, scientific research, and medicine before discovering his true calling.',
    detailedNarrative: 'Like countless young graduates across India, Vamshi explored multiple potential paths—pondering civil services (IAS), commercial piloting, research, and medicine. However, in 2017, a deep realization took hold. He found himself drawn to the unparalleled pride, adventure, selfless leadership, and disciplined brotherhood of an armed forces officer. The Indian Air Force quickly became his foremost aspiration, igniting a serious commitment to undergo the demanding transformation required.',
    lessons: [
      'Clarity of purpose cannot be borrowed—it must come from genuine conviction.',
      'Aspirations demand an immediate elevation of personal discipline and daily habits.',
      'Initial uncertainty is normal; decisive commitment is what separates dreamers from aspirants.'
    ],
    keyTakeaway: 'The uniform is not just an employment choice; it is an identity forged through deliberate inner alignment.',
    imageTheme: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'milestone-2-transformation',
    category: 'preparation',
    title: 'Forging the Crucible: 22 kg Transformation',
    subtitle: 'Under veteran mentorship, constructing an officer\'s daily routine',
    dateOrYear: 'Mid 2017 – 2018',
    summary: 'Under the personal mentorship of an Ex-Army officer, Vamshi instituted a rigorous daily regimen of physical training, newspaper analysis, mirror elocution, and group discussions.',
    detailedNarrative: 'Recognizing that SSB evaluates genuine personality traits rather than superficial theatrics, Vamshi placed himself under the guidance of a veteran Ex-Army officer. He overhauled his daily lifestyle: rigorous morning runs, strength conditioning at the gym, detailed analytical reading of national broadsheets, structured mirror elocution to hone articulate speech, and peer group discussions. Over several months, he shed 22 kilograms, built stamina, broadened his general awareness, and cleared both CDSE and AFCAT written examinations with confidence.',
    lessons: [
      'Physical fitness directly impacts mental composure and endurance during high-stress testing.',
      'Communication improves only through disciplined, repetitive verbal practice, not silent reading.',
      'Losing 22 kg instilled the fundamental realization that personal willpower can alter reality.'
    ],
    keyTakeaway: 'SSB does not test who you can pretend to be; it tests who your daily discipline has sculpted.',
    imageTheme: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'milestone-3-attempt-1',
    category: 'attempt',
    title: 'Attempt 1: 2 AFSB Mysore',
    subtitle: 'Conferenced Out | The Illusion of Over-Preparation',
    dateOrYear: 'Late 2018',
    board: '2 AFSB Mysore',
    entry: 'CDSE',
    outcome: 'Conferenced Out',
    batchStats: {
      reported: 250,
      screenedIn: 78,
      recommended: 4
    },
    summary: 'Screened in smoothly, but conferenced out on Day 5. The primary pitfall was a rehearsed, self-praising Self-Description and fixation on outcome.',
    detailedNarrative: 'Reporting to 2 AFSB Mysore under the CDSE entry, Vamshi navigated Stage-1 screening comfortably among ~250 candidates, with 78 getting screened in. Over the subsequent four days, he performed with energy. However, he had meticulously memorized a polished, somewhat self-glorifying Self-Description (SD), expecting guaranteed selection. When the results were declared, only 4 candidates were recommended, and Vamshi was conferenced out. It was a sobering encounter with reality.',
    lessons: [
      'Psychologists instantly detect rehearsed, self-flattering responses; authenticity is non-negotiable.',
      'Fixating on the final result induces subconscious tension during testing.',
      'Failure at the conference is not an indictment of your worth, but a diagnostic of your approach.'
    ],
    keyTakeaway: 'Detach from the outcome. Focus unconditionally on the integrity of the process.',
    imageTheme: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'milestone-4-attempt-2',
    category: 'attempt',
    title: 'Attempt 2: 4 AFSB Varanasi',
    subtitle: 'Conferenced Out | Tragedy and Fortitude',
    dateOrYear: '2019',
    board: '4 AFSB Varanasi',
    entry: 'AFCAT',
    outcome: 'Conferenced Out',
    batchStats: {
      reported: 280,
      screenedIn: 56,
      recommended: 4
    },
    summary: 'Grief struck on reporting morning with his father\'s sudden passing. After performing rites in Bengaluru, he attended on a deferred date with low morale and minimal preparation.',
    detailedNarrative: 'On the very morning Vamshi was scheduled to report to 4 AFSB Varanasi, a devastating telephone call from his mother brought tragic news: his father had suddenly passed away. Heartbroken, he returned immediately to Bengaluru to support his grieving family and fulfill last rites. The board accommodated a deferred reporting date. When he arrived weeks later, his morale was heavy, his heart grieving, and preparation nonexistent. He cleared screening (56 screened in from 280), but was conferenced out with 4 recommended. Despite the result, turning up in Varanasi demonstrated solemn courage.',
    lessons: [
      'Grief and unexpected adversity test personal character in ways no mock interview ever could.',
      'Showing up when life is at its darkest builds an unbreakable internal bedrock.',
      'A candidate\'s emotional balance during testing profoundly affects group dynamics and personal energy.'
    ],
    keyTakeaway: 'Courage is not the absence of sorrow, but the quiet dignity to stand up and face the board regardless.',
    imageTheme: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'milestone-5-attempt-3',
    category: 'attempt',
    title: 'Attempt 3: 2 AFSB Mysore',
    subtitle: 'Conferenced Out | The Batch Washout & The Six-Month Pause',
    dateOrYear: 'Mid 2019',
    board: '2 AFSB Mysore',
    entry: 'CDS',
    outcome: 'Conferenced Out',
    batchStats: {
      reported: 130,
      screenedIn: 26,
      recommended: 0
    },
    summary: 'A challenging board session where 26 candidates screened in from 130, concluding in a rare complete batch washout (0 recommended). Led to a crucial 6-month reflective pause.',
    detailedNarrative: 'Returning to Mysore for his third SSB via CDS, the screening round was unusually strict, with only 26 candidates qualifying from 130. Testing across psych, GTO, and interview progressed with intense scrutiny. On Conference Day, the assessing officers delivered a sobering outcome: zero recommendations for the entire batch. Confronted with a third consecutive conference-out, Vamshi made a mature decision—he took a six-month hiatus from attending boards while strictly maintaining his fitness and analytical reading routines.',
    lessons: [
      'Batch washouts underscore that boards never lower standard benchmarks to meet quotas.',
      'Taking a deliberate strategic break prevents repetitive subconscious mistakes and burnout.',
      'Preparation must continue in the shadows even when no immediate test date is on the calendar.'
    ],
    keyTakeaway: 'Stepping back to re-calibrate is not quitting; it is an operational regrouping.',
    imageTheme: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'milestone-6-attempt-4',
    category: 'attempt',
    title: 'Attempt 4: AFCAT Board',
    subtitle: 'Conferenced Out | The Dark Night Before the Dawn',
    dateOrYear: 'January 2020',
    entry: 'AFCAT',
    outcome: 'Conferenced Out',
    batchStats: {
      reported: 240,
      screenedIn: 63,
      recommended: 6
    },
    summary: 'Restructured his Self-Description using blunt feedback from peers and employer. Strong PI and Command Task, but group tasks unraveled. Contemplated quitting.',
    detailedNarrative: 'For his fourth attempt in January 2020, Vamshi approached his preparation with surgical introspection. He sought blunt, unfiltered feedback from close friends and his workplace manager to rewrite an honest Self-Description. During testing, his personal interview with the IO and his GTO Command Task were standout performances. However, during the Progressive Group Task (PGT) and Half Group Task (HGT), group dynamics became chaotic and disorganised. 6 candidates were recommended from 63; Vamshi was conferenced out. This rejection was emotionally agonizing, leading him to briefly consider abandoning his defence dreams permanently.',
    lessons: [
      'Even with superior individual tasks, inability to steer a dysfunctional group calmly harms evaluation.',
      'Honest feedback from peers is worth ten commercial mock interviews.',
      'The urge to quit strikes hardest right before breakthrough.'
    ],
    keyTakeaway: 'When frustration screams "give up", that is precisely when character whispers "one more time".',
    imageTheme: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'milestone-7-attempt-5',
    category: 'recommendation',
    title: 'Attempt 5: 3 AFSB Gandhinagar',
    subtitle: 'RECOMMENDED | Chest No. 50 | The Unstoppable Effort',
    dateOrYear: 'March 2020',
    board: '3 AFSB Gandhinagar',
    entry: 'CDS',
    chestNo: 50,
    outcome: 'Recommended',
    batchStats: {
      reported: 76,
      screenedIn: 55,
      recommended: 10
    },
    summary: 'Chest No. 50. Practical TAT stories rooted in personal experience, composure in an intensely stressed Command Task, 8 individual obstacles cleared, and continuing despite falling from the tyre obstacle.',
    detailedNarrative: 'In March 2020, Vamshi arrived at 3 AFSB Gandhinagar with zero baggage, zero expectation, and complete emotional calm. Assigned Chest Number 50, he approached psychological testing with authentic narrative depth, writing practical TAT stories drawn from real-life incidents rather than theoretical heroics. In the GTO tasks, when the GTO placed difficult constraints on his Command Task, he stayed composed and methodical. During the Individual Obstacles, while executing the high tyre jump, he took a hard fall, injuring himself. Shaking off the pain, he immediately climbed back up and cleared 8 individual obstacles. On Conference Day, when Chest No. 50 was called among the 10 recommended candidates from 55, two years of perseverance culminated in victory.',
    lessons: [
      'GTO tests your spirit when things go wrong—getting injured and immediately continuing reveals true OLQs.',
      'Authentic stories written from real-life empathy outshine scripted heroic templates every single time.',
      'Composure under psychological pressure is the hallmark of officer-like temperament.'
    ],
    keyTakeaway: 'Recommendation is not an accident. It is the natural consequence of authentic character under pressure.',
    imageTheme: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'milestone-8-final',
    category: 'final',
    title: 'The Medical Pivot & All India Rank 34',
    subtitle: 'From Fighter Cockpit Dream to the Indian Military Academy',
    dateOrYear: '2020',
    summary: 'Declared unfit for flying branch due to eyesight standards. Pivoting to his second preference, he cleared Army medicals and secured AIR 34 in CDS 2 2019 merit list.',
    detailedNarrative: 'The journey held one final twist of fate. During specialized Air Force medical evaluation at AFCME/IAM, Vamshi was declared medically unfit for the flying branch due to subtle visual acuity standards, closing the door on his dream of becoming a fighter pilot. Where many would have succumbed to heartbreak, he demonstrated the adaptability expected of an officer. Pivoting promptly to his second preference—the Indian Military Academy (IMA)—he underwent and cleared rigorous Army medical boards. When the UPSC final merit list was published for CDS 2 2019, Vamshi had secured All India Rank 34.',
    lessons: [
      'Uncontrollable medical factors cannot diminish your leadership capability or determination.',
      'An officer does not freeze when the plan changes; they execute the alternate mission with equal zeal.',
      'AIR 34 stood as statistical proof of holistic mastery across written examination, interview, and character.'
    ],
    keyTakeaway: 'Your setbacks do not define your destination. How you respond to them does.',
    imageTheme: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'
  }
];

export const mentorStats = {
  ssbAttempts: 5,
  recommendations: 1,
  airRank: 34,
  examination: 'CDS 2 2019',
  weightLostKg: 22,
  recommendingBoard: '3 AFSB Gandhinagar',
  chestNumber: 50,
  yearsOfJourney: 2,
};
