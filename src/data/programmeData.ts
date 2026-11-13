export interface ProgrammeItem {
  id: string;
  title: string;
  category: 'Foundation' | 'Psychology' | 'GTO' | 'Interview' | 'Personality' | 'Mentorship';
  tagline: string;
  shortDescription: string;
  detailedDescription: string;
  suitableAspirantLevel: 'Beginner / First Timer' | 'Repeaters & Screened-Out' | 'Conferenced-Out Candidates' | 'All Stages';
  intendedOutcomes: string[];
  keyModules: {
    title: string;
    description: string;
  }[];
  curriculumHighlights: string[];
  statusNotice: string;
  recommendedPrepHours: string;
  targetEntries: string[];
}

export const proposedProgrammes: ProgrammeItem[] = [
  {
    id: 'prog-foundation',
    title: 'SSB Foundation Preparation',
    category: 'Foundation',
    tagline: 'Deconstructing the 5-Day Testing Process & Stage-1 Mastery',
    shortDescription: 'A systematic orientation to the three testing pillars (Psychology, GTO, Interview), screening dynamics, OIR reasoning, and PPDT execution.',
    detailedDescription: 'The SSB Foundation framework focuses on demystifying the complete 5-day assessment protocol. Designed to eliminate myths, rote-memorization, and generic coaching clichés, this proposed module anchors aspirants in genuine self-understanding and clarity of what assessors evaluate in Stage-1 screening and Stage-2 assessments.',
    suitableAspirantLevel: 'Beginner / First Timer',
    intendedOutcomes: [
      'Comprehensive mental map of the 5-day testing schedule and assessor roles',
      'Mastery of Stage-1 Officer Intelligence Rating (OIR) verbal & non-verbal reasoning',
      'Effective perception, crisp story construction, and confident narration in PPDT',
      'Clear baseline diagnostic of current personal strengths and improvement areas'
    ],
    keyModules: [
      { title: 'Testing Architecture', description: 'Understanding Mansa, Vacha, and Karmana and how the three assessors evaluate the 15 OLQs.' },
      { title: 'Stage-1 OIR & PPDT', description: 'High-speed reasoning techniques, image perception protocols, and group discussion etiquette during screening.' },
      { title: 'Aspirant Routine Blueprint', description: 'Building the daily physical fitness, newspaper reading, and mirror speech discipline.' }
    ],
    curriculumHighlights: [
      'Deconstructing screening statistics and assessor criteria',
      'OIR practice problem sets with timed drills',
      'PPDT narration pacing, voice projection, and body language',
      'Transitioning from civilian perspective to military aspirant mindset'
    ],
    statusNotice: 'Proposed programme structure — final syllabus and schedules to be confirmed.',
    recommendedPrepHours: 'Proposed: Self-paced modules with live cohort sessions',
    targetEntries: ['NDA', 'CDSE', 'AFCAT', 'INET', 'NCC Special Entry', 'TGC/SSC Tech']
  },
  {
    id: 'prog-psychology',
    title: 'Psychology Test Preparation',
    category: 'Psychology',
    tagline: 'Authentic Subconscious Expression Across TAT, WAT, SRT & SD',
    shortDescription: 'Unpack the psychological battery without artificial scripts. Learn to reflect your real values, empathy, leadership, and emotional stability.',
    detailedDescription: 'Psychological tests at SSB do not look for literary genius or artificial bravado; they measure the candidate’s habitual thought patterns and emotional maturity under time constraint. This proposed module guides aspirants through realistic Thematic Apperception Test (TAT) ideation, natural Word Association Test (WAT) thoughts, pragmatic Situation Reaction Test (SRT) actions, and an honest Self-Description (SD).',
    suitableAspirantLevel: 'All Stages',
    intendedOutcomes: [
      'Ability to write authentic, realistic TAT stories rooted in life experiences rather than canned heroic templates',
      'Immediate spontaneous thought formulation for 60 WAT words under 15-second pressure',
      'Pragmatic, action-oriented responses for 60 SRT real-world scenarios',
      'Development of a grounded, well-rounded Self-Description reflecting true feedback'
    ],
    keyModules: [
      { title: 'Thematic Apperception (TAT)', description: 'Observation of character details, stimulus context, realistic conflict resolution, and avoiding textbook clichés.' },
      { title: 'Word Association (WAT)', description: 'Subconscious impulse analysis, overcoming negative triggers, and writing positive, observational sentences.' },
      { title: 'Situation Reaction (SRT)', description: 'Resourcefulness, sense of responsibility, logical prioritization, and concise crisis response.' },
      { title: 'Self Description (SD)', description: 'Synthesizing parents\', teachers\', friends\', and self-evaluations with mature self-awareness.' }
    ],
    curriculumHighlights: [
      '50+ realistic visual prompt breakdowns with feedback analysis',
      'WAT speed drills focusing on observation over pre-memorized idioms',
      'SRT practical safety, medical, social, and logistical scenarios',
      'Eliminating rehearsed self-glorification from the Self-Description'
    ],
    statusNotice: 'Proposed programme structure — final syllabus and schedules to be confirmed.',
    recommendedPrepHours: 'Proposed: Structured thematic workshops',
    targetEntries: ['CDSE', 'AFCAT', 'NDA', 'JAG', 'SSC Tech', 'CAPF']
  },
  {
    id: 'prog-gto',
    title: 'GTO Task Preparation',
    category: 'GTO',
    tagline: 'Group Dynamics, Ground Grounding & Command Task Composure',
    shortDescription: 'Master the principles of bridging, cantilevers, group synergy, and calm command execution on the outdoor testing grounds.',
    detailedDescription: 'The Group Testing Officer (GTO) evaluates candidates in dynamic social and physical environments. This proposed module provides an in-depth analytical breakdown of outdoor ground tasks: PGT, HGT, FGT, Snake Race, and Command Task. Aspirants learn the structural mechanics of helping materials (plank, balli, rope), how to contribute constructively without dominating, and how to stay composed when assessors introduce severe constraints.',
    suitableAspirantLevel: 'Repeaters & Screened-Out',
    intendedOutcomes: [
      'Thorough understanding of physical fulcrums, cantilevers, and bridging techniques in PGT/HGT',
      'Skills to build consensus and maintain collaborative energy during high-friction group tasks',
      'Poise and methodical decision-making in the GTO Command Task under escalating constraints',
      'Physical stamina and tactical planning for the Individual Obstacles and Snake Race'
    ],
    keyModules: [
      { title: 'Structural Mechanics of Ground Tasks', description: 'Rules of colour, rigidity, distance, and load-bearing fulcrums with ropes and planks.' },
      { title: 'Group Harmony & Progressive Tasks', description: 'Contributing ideas without shouting, supporting teammates, and handling dominant group members gracefully.' },
      { title: 'Command Task Strategy', description: 'Briefing subordinates clearly, resource allocation, and maintaining calm when the GTO changes conditions.' },
      { title: 'Military Planning Exercise (GPE)', description: 'Time-distance calculations, resource pooling, prioritization of life vs property, and group consensus writing.' }
    ],
    curriculumHighlights: [
      'Visual diagram breakdowns of 30+ cantilever and bridging scenarios',
      'GPE simulation with step-by-step priority matrix mapping',
      'Individual Obstacles route optimization and safety mindset',
      'Case study: Overcoming injury and maintaining effort (Vamshi’s tyre obstacle experience)'
    ],
    statusNotice: 'Proposed programme structure — final syllabus and schedules to be confirmed.',
    recommendedPrepHours: 'Proposed: Interactive ground simulation modules',
    targetEntries: ['All Army, Navy, and Air Force Entries']
  },
  {
    id: 'prog-interview',
    title: 'Personal Interview Guidance',
    category: 'Interview',
    tagline: 'The Art of Authentic Dialogue with the Interviewing Officer (IO)',
    shortDescription: 'Navigate the comprehensive PIQ form, rapid-fire questioning sequences, geopolitical awareness, and honest self-appraisal with poise.',
    detailedDescription: 'The Personal Interview at SSB is not an adversarial interrogation; it is a searching psychological conversation between a senior officer (President or Deputy President of the Board) and the candidate. This proposed curriculum equips aspirants to know their own life story thoroughly—family, education, extracurriculars, hobbies, current affairs, and genuine motivations—enabling calm authenticity under pressure.',
    suitableAspirantLevel: 'All Stages',
    intendedOutcomes: [
      'Comprehensive understanding of every single parameter on the Personal Information Questionnaire (PIQ)',
      'Ability to handle 8-10 part Comprehensive Information Question (CIQ) sequences calmly',
      'Grounded, defensible viewpoints on national defence, geopolitics, and socio-economic issues',
      'Comfort with acknowledging personal limitations and past failures with mature integrity'
    ],
    keyModules: [
      { title: 'PIQ Form Dissection', description: 'Every line of the PIQ analyzed—hobbies vs interests, positions of responsibility, and academic trends.' },
      { title: 'CIQ Rapid-Fire Mastery', description: 'Techniques for mental chronological mapping to answer multi-part questions without missing threads.' },
      { title: 'Current Affairs & Defence Awareness', description: 'National security architecture, armed forces commands, recent exercises, and international relations.' },
      { title: 'Stress Response & Integrity Tests', description: 'Responding to provocative questions, hypotheticals, and moral dilemmas with calm authenticity.' }
    ],
    curriculumHighlights: [
      'Simulated PIQ audit template with personalized reflection prompts',
      'Breakdown of common interview traps and fake confidence pitfalls',
      'Organized briefing sheets on contemporary strategic defence issues',
      'Body language, vocal modulation, eye contact, and poise guidelines'
    ],
    statusNotice: 'Proposed programme structure — final syllabus and schedules to be confirmed.',
    recommendedPrepHours: 'Proposed: Mentorship dialogue sessions',
    targetEntries: ['CDSE', 'AFCAT', 'NDA', 'TGC', 'NCC', 'SSCW']
  },
  {
    id: 'prog-self-description',
    title: 'Self Description Development',
    category: 'Personality',
    tagline: 'Honest Introspection: Replacing Scripted Lies with Self-Awareness',
    shortDescription: 'A specialized workshop module focused on rewriting the five components of the SD based on real external feedback and deep introspection.',
    detailedDescription: 'One of the most profound lessons from Lt. Vamshi\'s first attempt was the failure caused by a memorized, self-praising Self-Description. This dedicated module guides aspirants through collecting genuine, unfiltered feedback from parents, teachers, employers, and close friends to construct an authentic, balanced SD that withstands cross-examination in the interview.',
    suitableAspirantLevel: 'Conferenced-Out Candidates',
    intendedOutcomes: [
      'Complete elimination of pre-packaged coaching scripts and boastful adjectives',
      'Structured process for gathering and analyzing candid feedback from friends, family, and colleagues',
      'A harmonious Self-Description that aligns perfectly with your PIQ, TAT stories, and Interview responses',
      'Concrete action plans for personal weaknesses mentioned in the SD'
    ],
    keyModules: [
      { title: 'The Five SD Dimensions', description: 'Parents\' perspective, Teachers\'/Employers\' view, Friends\' view, Self-perception, and Target personality.' },
      { title: 'Feedback Gathering Protocol', description: 'How to ask peers for honest feedback on blind spots without defensive reactions.' },
      { title: 'Triangulation with Interview & Psych', description: 'Ensuring consistency between written SD statements and live verbal responses to the IO.' }
    ],
    curriculumHighlights: [
      'Comparative study: Vamshi\'s Attempt 1 vs Attempt 5 Self-Description shifts',
      'Weakness articulation framework: showing active steps toward improvement',
      'Peer review and mentorship calibration worksheets',
      'Common clichés and words that trigger assessor skepticism'
    ],
    statusNotice: 'Proposed programme structure — final syllabus and schedules to be confirmed.',
    recommendedPrepHours: 'Proposed: Reflective writing & audit workshops',
    targetEntries: ['All Entries']
  },
  {
    id: 'prog-communication-gd',
    title: 'Communication and Group Discussion',
    category: 'Personality',
    tagline: 'Articulate Thought, Voice Projection & Collaborative Debate',
    shortDescription: 'Overcome hesitation, master mirror elocution, structure arguments logically, and excel in high-density group discussions and lecturettes.',
    detailedDescription: 'Communication at SSB is not about an elitist accent or bombastic vocabulary; it is about clarity of thought, respectful listening, rational point construction, and audible voice projection. Drawing directly from Vamshi\'s daily routine of mirror elocution and peer discussions, this proposed module transforms shy or disorganised speakers into confident, lucid communicators.',
    suitableAspirantLevel: 'All Stages',
    intendedOutcomes: [
      'Rapid mental structuring of complex socio-political topics in 3 minutes for Lecturette',
      'Effective contribution strategies in heated Group Discussions without shouting or interrupting',
      'Vocal clarity, breath control, and posture through disciplined mirror speech drills',
      'Active listening habits to summarize and synthesize group viewpoints effectively'
    ],
    keyModules: [
      { title: 'The Daily Mirror Elocution Drill', description: '3-minute daily impromptu speaking framework to build fluency and eliminate filler words.' },
      { title: 'Lecturette Frameworks', description: 'Chronological, past-present-future, and stakeholder-based structures for 3-minute speeches.' },
      { title: 'Group Discussion Etiquette', description: 'Opening points, bridging conflicting views, bringing silent group members in, and summarizing.' },
      { title: 'General Awareness Synthesis', description: 'Transforming daily newspaper editorials into concise conversational arguments.' }
    ],
    curriculumHighlights: [
      '100 contemporary GD and Lecturette topic breakdown guides',
      'Point-of-view formulation templates (Social, Economic, Political, Global)',
      'Audio-visual self-recording critique rubrics',
      'Handling aggressive group members with poise and diplomatic firmness'
    ],
    statusNotice: 'Proposed programme structure — final syllabus and schedules to be confirmed.',
    recommendedPrepHours: 'Proposed: Interactive debate & speaking cohorts',
    targetEntries: ['All Aspirants']
  },
  {
    id: 'prog-olq-development',
    title: 'Officer-Like Qualities Development',
    category: 'Personality',
    tagline: 'Living the 15 OLQs in Daily Life Before the Board Tests Them',
    shortDescription: 'A long-term character architecture curriculum integrating the 15 Officer-Like Qualities into daily discipline, fitness, integrity, and social adaptability.',
    detailedDescription: 'The fundamental thesis of SSB BRO is that SSB is not an exam you study for over a weekend; it is an evaluation of who you have built yourself to be. This proposed programme breaks down all 15 OLQs across the four factors (Planning & Organizing, Social Adjustment, Social Effectiveness, Dynamic) into practical daily habits, fitness routines, and ethical decision-making benchmarks.',
    suitableAspirantLevel: 'All Stages',
    intendedOutcomes: [
      'Concrete understanding of all 15 OLQs and how assessors observe them in everyday behaviour',
      'A disciplined daily habit system encompassing physical conditioning, reading, and self-reflection',
      'Enhanced social adaptability, empathy, and collaborative spirit in peer and family settings',
      'Development of stamina, courage, and determination to endure setbacks without loss of optimism'
    ],
    keyModules: [
      { title: 'Factor I: Planning & Organizing', description: 'Effective intelligence, reasoning ability, organizing ability, and power of expression.' },
      { title: 'Factor II: Social Adjustment', description: 'Social adaptability, cooperation, and sense of responsibility in family and team environments.' },
      { title: 'Factor III: Social Effectiveness', description: 'Initiative, self-confidence, speed of decision, ability to influence the group, and liveliness.' },
      { title: 'Factor IV: Dynamic Factor', description: 'Determination, courage, and stamina through physical training and resilience under adversity.' }
    ],
    curriculumHighlights: [
      'Daily 15-OLQ audit tracker and personal growth journal template',
      'Fitness roadmap: cardio, strength, and obstacle preparation fundamentals',
      'Case studies in military leadership and ethical decision-making',
      'Developing emotional composure under high-stress conditions'
    ],
    statusNotice: 'Proposed programme structure — final syllabus and schedules to be confirmed.',
    recommendedPrepHours: 'Proposed: Continuous habit & mentorship curriculum',
    targetEntries: ['All Armed Forces Aspirants']
  },
  {
    id: 'prog-personal-mentorship',
    title: 'Personal Mentorship & Strategic Review',
    category: 'Mentorship',
    tagline: 'One-on-One Diagnostic Guidance for Dedicated Repeaters & Aspirants',
    shortDescription: 'Tailored individual review sessions to diagnose past conference-out reports, audit PIQ forms, critique psych dossiers, and calibrate mindset.',
    detailedDescription: 'For aspirants who have faced multiple conference-outs or screen-outs, broad general advice often fails to pinpoint the subtle behavioural blind spots holding them back. This proposed mentorship track offers deep individual attention, reviewing previous attempts, auditing psychological dossiers, conducting simulated interview audits, and formulating a customized transformation roadmap.',
    suitableAspirantLevel: 'Conferenced-Out Candidates',
    intendedOutcomes: [
      'Detailed diagnosis of failure points from previous SSB attempts without sugarcoating',
      'Comprehensive audit of PIQ, Self-Description, and psychological writing style',
      'Custom physical conditioning and verbal articulation targets based on individual gaps',
      'Mental resilience counseling to overcome self-doubt, family pressure, and fatigue'
    ],
    keyModules: [
      { title: 'Previous Attempt Deconstruction', description: 'Deep-dive analysis into candidate’s specific memories of screening, psych, GTO, and interview.' },
      { title: 'Comprehensive Dossier Audit', description: 'Reviewing practice TAT stories, WAT responses, and SRT logic for recurring behavioural tendencies.' },
      { title: 'Personalized Strategic Roadmap', description: 'Weekly milestones for physical transformation, communication improvement, and knowledge depth.' }
    ],
    curriculumHighlights: [
      'One-on-one video review and diagnostic feedback sessions',
      'Custom PIQ optimization and narrative coherence checks',
      'Targeted practice drills tailored to specific assessor observations',
      'Post-conference debriefing and ongoing strategic encouragement'
    ],
    statusNotice: 'Proposed programme structure — final syllabus and schedules to be confirmed.',
    recommendedPrepHours: 'Proposed: Personalized scheduled mentorship blocks',
    targetEntries: ['Repeaters, Recommended Aspirants preparing for next boards, and Dedicated Candidates']
  }
];
