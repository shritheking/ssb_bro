export interface FAQItem {
  id: string;
  category: 'Basics' | 'Testing Stages' | 'Psychology & Interview' | 'Mentorship & Philosophy';
  question: string;
  answer: string;
}

export const faqsList: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Basics',
    question: 'What is the Services Selection Board (SSB)?',
    answer: 'The Services Selection Board (SSB) is an autonomous evaluation organization established by the Ministry of Defence to assess candidates for officer appointments in the Indian Armed Forces (Army, Navy, and Air Force). Over a rigorous 5-day assessment, three independent assessors—a Psychologist, a Group Testing Officer (GTO), and an Interviewing Officer (IO)—evaluate a candidate against 15 predefined Officer-Like Qualities (OLQs).'
  },
  {
    id: 'faq-2',
    category: 'Testing Stages',
    question: 'What happens during the 5-day SSB process?',
    answer: 'The testing is conducted in two distinct stages:\n\n• Day 1 (Stage-1 Screening): Officer Intelligence Rating (OIR) test followed by Picture Perception and Description Test (PPDT) and Group Discussion. Candidates who clear screening stay for Stage-2; others return home on Day 1.\n• Day 2: Psychological Testing Battery (TAT, WAT, SRT, and Self-Description Test).\n• Day 3 & 4: Group Testing Officer (GTO) indoor and outdoor tasks (GD, GPE, PGT, HGT, Snake Race, Individual Obstacles, Command Task, FGT) and Personal Interviews conducted by the IO.\n• Day 5: The Board Conference where all assessors finalize their independent scores. Final recommendations are declared immediately afterwards.'
  },
  {
    id: 'faq-3',
    category: 'Testing Stages',
    question: 'What is the difference between "Screening" and "Recommendation"?',
    answer: 'Screening (Stage-1) is the preliminary elimination filter on Day 1. Typically, only 20% to 35% of reported candidates clear Stage-1 to enter Stage-2. Recommendation is the final selection after Day 5, where the board collectively approves a candidate as possessing acceptable officer potential. Clearing screening qualifies you for the 5-day evaluation, whereas recommendation earns you entry into the final merit list and medical examination boards.'
  },
  {
    id: 'faq-4',
    category: 'Psychology & Interview',
    question: 'What are TAT, WAT, and SRT in the Psychology Battery?',
    answer: 'They form the core subconscious evaluation tools of the Psychologist:\n\n• TAT (Thematic Apperception Test): 11 ambiguous pictures + 1 blank slide. Candidates write a complete story (past, present, future) for each in 4 minutes, revealing their natural values, resourcefulness, and leadership tendencies.\n• WAT (Word Association Test): 60 words projected for 15 seconds each. Candidates write their spontaneous cognitive reaction or sentence.\n• SRT (Situation Reaction Test): 60 real-life crisis or social scenarios presented in a 30-minute booklet to assess practical judgment, moral courage, and resourcefulness.'
  },
  {
    id: 'faq-5',
    category: 'Psychology & Interview',
    question: 'How should an aspirant realistically prepare for the Personal Interview?',
    answer: 'Personal Interview preparation starts with complete mastery of your Personal Information Questionnaire (PIQ). Know every detail of your academics, reasons for score fluctuations, deep knowledge of your family background, hometown, chosen hobbies, positions of responsibility held, and realistic reasons for wanting to join the armed forces. Additionally, maintain sharp, well-reasoned viewpoints on contemporary national and international security matters.'
  },
  {
    id: 'faq-6',
    category: 'Mentorship & Philosophy',
    question: 'How can I systematically improve my spoken English and communication for GD and Lecturette?',
    answer: 'Communication at SSB requires clarity, logic, and confident voice projection, not artificial accents. The proven method—derived from Lt. Vamshi\'s daily transformation routine—is daily mirror elocution: picking an editorial topic every morning, jotting 4 points, and speaking aloud for 3 uninterrupted minutes in front of a full-length mirror while maintaining eye contact. Paired with weekly audio recordings and peer group discussions, this eliminates filler words and builds natural fluency.'
  },
  {
    id: 'faq-7',
    category: 'Mentorship & Philosophy',
    question: 'Does SSB BRO guarantee recommendation or selection?',
    answer: 'No. SSB BRO categorically does not provide selection guarantees, fixed success percentages, or magic shortcuts. Selection in the armed forces depends solely on the candidate\'s own authentic character, daily discipline, physical fitness, emotional maturity, and the independent evaluation of the Services Selection Board. Our role is strictly focused on aspirant development, honest diagnostic feedback, and mentorship to help you become your most authentic, capable self.'
  },
  {
    id: 'faq-8',
    category: 'Mentorship & Philosophy',
    question: 'How can I enquire about proposed programmes or personal mentorship?',
    answer: 'You can submit an enquiry through our Contact page specifying your target entry (e.g. CDSE, AFCAT, NDA) and your current preparation stage (first-timer, screened-out, or conferenced-out repeater). As SSB BRO is currently in its conceptual and platform development phase, programmes are being designed and will be announced as confirmed offerings.'
  }
];
