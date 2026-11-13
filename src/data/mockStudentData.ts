export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  targetEntry: string;
  attemptsCount: number;
  preparationStage: string;
  phone: string;
  hometown: string;
  education: string;
  hobby: string;
  targetBoard: string;
  joinedDate: string;
  avatarUrl?: string;
}

export const defaultStudentProfile: StudentProfile = {
  id: 'std-2026-001',
  name: 'Arjun Sharma',
  email: 'arjun.aspirant@example.com',
  targetEntry: 'CDSE (IMA / OTA)',
  attemptsCount: 2,
  preparationStage: 'Conferenced-Out Repeater',
  phone: '+91 98765 43210',
  hometown: 'Pune, Maharashtra',
  education: 'B.Tech Mechanical Engineering, 2024',
  hobby: 'Long-distance running & aeromodelling',
  targetBoard: '22 SSB Bhopal / 1 AFSB Dehradun',
  joinedDate: 'October 2026',
};

export interface EnrolledProgramme {
  id: string;
  title: string;
  category: string;
  progressPercent: number;
  currentModule: string;
  totalModules: number;
  completedModules: number;
  lastActive: string;
}

export const initialEnrolledProgrammes: EnrolledProgramme[] = [
  {
    id: 'prog-foundation',
    title: 'SSB Foundation Preparation',
    category: 'Foundation',
    progressPercent: 70,
    currentModule: 'Stage-1 PPDT Narration & Group Dynamics',
    totalModules: 10,
    completedModules: 7,
    lastActive: 'Yesterday'
  },
  {
    id: 'prog-psychology',
    title: 'Psychology Test Preparation',
    category: 'Psychology',
    progressPercent: 45,
    currentModule: 'TAT Realistic Story Drafting & Review',
    totalModules: 12,
    completedModules: 5,
    lastActive: '3 days ago'
  },
  {
    id: 'prog-self-description',
    title: 'Self Description Development',
    category: 'Personality',
    progressPercent: 30,
    currentModule: 'Gathering Peer & Family Honest Feedback',
    totalModules: 6,
    completedModules: 2,
    lastActive: '1 week ago'
  }
];

export interface AssignmentItem {
  id: string;
  title: string;
  programmeTitle: string;
  dueDate: string;
  status: 'Pending' | 'Submitted' | 'Reviewed';
  instructions: string;
  mentorFeedback?: string;
  gradeScore?: string;
  submittedAt?: string;
  userSubmission?: string;
}

export const initialAssignments: AssignmentItem[] = [
  {
    id: 'asg-01',
    title: 'Write 3 Realistic TAT Stories from Practice Set A',
    programmeTitle: 'Psychology Test Preparation',
    dueDate: 'In 3 days',
    status: 'Pending',
    instructions: 'Observe the three image prompts provided in the Practice Centre. Focus on realistic resource allocation, clear division of tasks, and avoiding superhero clichés. Limit to 100-120 words per story.'
  },
  {
    id: 'asg-02',
    title: 'PIQ Form Initial Self-Audit & Discrepancy Log',
    programmeTitle: 'SSB Foundation Preparation',
    dueDate: 'Yesterday',
    status: 'Submitted',
    instructions: 'Complete the standardized PIQ PDF audit draft. Highlight any semester grade drops or gaps in sports participation with honest one-paragraph explanations.',
    submittedAt: 'Nov 11, 2026',
    userSubmission: 'Completed PIQ audit draft focusing on 2nd year engineering semester score dips due to sports tournament responsibilities.'
  },
  {
    id: 'asg-03',
    title: 'Self-Description Draft 1: Parents & Friends Dimension',
    programmeTitle: 'Self Description Development',
    dueDate: 'Completed',
    status: 'Reviewed',
    instructions: 'Synthesize raw feedback collected from your parents and two college friends into the first two paragraphs of your SD.',
    submittedAt: 'Nov 04, 2026',
    userSubmission: 'Parents appreciate my morning discipline but note I get impatient when family plans change. Friends value my loyalty in team projects.',
    mentorFeedback: 'Good candor in acknowledging impatience. In paragraph 4, detail what exact system you are using to maintain patience during unexpected disruptions. Well done on avoiding flowery prose.',
    gradeScore: 'Strong Progress'
  }
];

export interface FeedbackReview {
  id: string;
  date: string;
  reviewer: string;
  topic: string;
  summary: string;
  strengths: string[];
  improvementPoints: string[];
  scoreIndicator: string;
}

export const sampleFeedbackHistory: FeedbackReview[] = [
  {
    id: 'fb-01',
    date: 'Nov 05, 2026',
    reviewer: 'Lt. Vamshi E. (Concept Demo Mentor)',
    topic: 'Self-Description Draft 1 & Mirror Elocution Recording',
    summary: 'Clear shift toward authenticity detected. Speech tempo in mirror elocution has slowed down to a confident 115 wpm, resulting in much clearer articulation.',
    strengths: [
      'Eliminated pre-memorized leadership quotes from paragraph 1',
      'Audible chest resonance and steady eye contact during the 3-minute elocution video',
      'Realistic acknowledgment of academic variance in the PIQ'
    ],
    improvementPoints: [
      'Avoid rushing the conclusion of the Lecturette prompt in the last 20 seconds',
      'Ensure the protagonist in TAT Story 2 does not solve the entire village water issue alone; show cooperative team delegation'
    ],
    scoreIndicator: '8.2 / 10'
  },
  {
    id: 'fb-02',
    date: 'Oct 22, 2026',
    reviewer: 'Lt. Vamshi E. (Concept Demo Mentor)',
    topic: 'Initial Diagnostic Review: Previous Mysore Board Debrief',
    summary: 'Deconstructed the candidate\'s Day 5 conference from 2 AFSB. The main issue was passive participation during PGT and over-defensiveness regarding college backlog in the personal interview.',
    strengths: [
      'High natural stamina (cleared 9 individual obstacles easily)',
      'Sharp verbal reasoning in OIR (predicted OIR 1 rank)'
    ],
    improvementPoints: [
      'Stop viewing the Interviewing Officer as an adversary; embrace honest admission of mistakes with composure',
      'Focus on supporting team members with physical cantilever ideas without yelling'
    ],
    scoreIndicator: 'Diagnostic Baseline'
  }
];

export interface MentorshipSession {
  id: string;
  title: string;
  mentorName: string;
  dateTime: string;
  type: '1-on-1 Video Diagnostic' | 'Psych Dossier Review' | 'Ground Task Group Strategy';
  status: 'Upcoming' | 'Completed' | 'Available to Book';
  linkOrLocation?: string;
  notes?: string;
}

export const initialSessions: MentorshipSession[] = [
  {
    id: 'ses-01',
    title: 'Individual Psychological Battery Diagnostic & Story Review',
    mentorName: 'Lt. Vamshi E.',
    dateTime: 'Saturday, Nov 21, 2026 • 18:00 IST',
    type: '1-on-1 Video Diagnostic',
    status: 'Upcoming',
    linkOrLocation: 'Demo Google Meet Room (Live when session starts)',
    notes: 'Please bring your printed PIQ audit draft and 12 written TAT practice sheets.'
  },
  {
    id: 'ses-02',
    title: 'GTO Cantilever Principles & Outdoor Team Dynamics',
    mentorName: 'Lt. Vamshi E.',
    dateTime: 'Saturday, Nov 07, 2026 • 17:30 IST',
    type: 'Ground Task Group Strategy',
    status: 'Completed',
    linkOrLocation: 'Recorded Session Archive Available',
    notes: 'Covered fulcrum mechanics, bridging rules, and managing domineering peers.'
  }
];

// Interactive Practice Items
export interface TatPracticeItem {
  id: string;
  title: string;
  imageUrl: string;
  contextClue: string;
  recommendedTimeSeconds: number;
}

export const tatPracticeList: TatPracticeItem[] = [
  {
    id: 'tat-1',
    title: 'Prompt 1: Rural Agricultural & Technical Coordination',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    contextClue: 'A group of young individuals examining an irrigation layout near a field with a villager.',
    recommendedTimeSeconds: 240
  },
  {
    id: 'tat-2',
    title: 'Prompt 2: Emergency Roadside Assistance',
    imageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80',
    contextClue: 'A stopped vehicle on a rainy evening with two individuals assessing the tyre and engine.',
    recommendedTimeSeconds: 240
  },
  {
    id: 'tat-3',
    title: 'Prompt 3: College Technical Workshop & Project Team',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    contextClue: 'Engineering students collaborating on an electromechanical assembly under late hours.',
    recommendedTimeSeconds: 240
  }
];

export interface WatPracticeWord {
  id: number;
  word: string;
  category: string;
}

export const watPracticeWords: WatPracticeWord[] = [
  { id: 1, word: 'COURAGE', category: 'Dynamic' },
  { id: 2, word: 'SETBACK', category: 'Resilience' },
  { id: 3, word: 'COOPERATION', category: 'Social Adjustment' },
  { id: 4, word: 'CRITICISM', category: 'Self-Awareness' },
  { id: 5, word: 'LEADER', category: 'Influence' },
  { id: 6, word: 'FEAR', category: 'Emotional Stability' },
  { id: 7, word: 'DUTY', category: 'Responsibility' },
  { id: 8, word: 'VICTORY', category: 'Outcome' },
  { id: 9, word: 'MISTAKE', category: 'Diagnostic' },
  { id: 10, word: 'DISCIPLINE', category: 'Daily Habit' },
];

export interface SrtPracticeScenario {
  id: number;
  situation: string;
  context: string;
}

export const srtPracticeScenarios: SrtPracticeScenario[] = [
  {
    id: 1,
    situation: 'He was traveling by train to attend the SSB when his fellow passenger collapsed due to chest pain and shortness of breath.',
    context: 'Medical Emergency on Transit'
  },
  {
    id: 2,
    situation: 'During the group discussion, two candidates started aggressively shouting at each other and the entire group fell into disarray.',
    context: 'Group Chaos & Leadership'
  },
  {
    id: 3,
    situation: 'On the eve of his major engineering submission, his team leader fell severely ill and the final report was incomplete.',
    context: 'Academic Pressure & Responsibility'
  },
  {
    id: 4,
    situation: 'While trekking in a remote forest with friends, one member slipped into a rocky ravine and broke his ankle as dusk approached.',
    context: 'Physical Hazard & Resourcefulness'
  }
];
