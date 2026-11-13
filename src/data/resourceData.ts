export interface ResourceItem {
  id: string;
  title: string;
  category: 'SSB Basics' | 'Psychology' | 'TAT' | 'WAT' | 'SRT' | 'Self Description' | 'GTO' | 'Personal Interview' | 'Communication' | 'Defence Awareness';
  estimatedReadTime: string;
  description: string;
  keyTopics: string[];
  contentBody: string;
  sampleExercise?: {
    prompt: string;
    analysis: string;
    dosAndDonts: { do: string; dont: string }[];
  };
  featured?: boolean;
}

export const learningResources: ResourceItem[] = [
  {
    id: 'res-tat-realism',
    title: 'TAT Story Architecture: Replacing Canned Heroics with Grounded Reality',
    category: 'TAT',
    estimatedReadTime: '8 min read',
    featured: true,
    description: 'Learn why psychological assessors penalize scripted military fantasies in the Thematic Apperception Test, and how to write authentic, problem-solving stories.',
    keyTopics: ['The 3-Part TAT Structure', 'Identifying the Main Protagonist', 'Realistic Obstacles', 'Eliminating Coaching Clichés'],
    contentBody: `The Thematic Apperception Test (TAT) presents 12 pictures (11 ambiguous visual stimuli and 1 blank slide) for 30 seconds each, followed by 4 minutes to write a story.

A common pitfall that leads to conference-out verdicts is copying textbook stories where a civilian boy suddenly fights terrorists, donates an entire salary, or invents a high-tech solar drone in two hours. Psychologists look for normal human beings reacting to everyday challenges with resourcefulness, initiative, and teamwork.

Key Principles for an Authentic TAT Story:
1. Past (What led to the situation): Establish the background and logical catalyst in 1-2 concise sentences.
2. Present (What is currently happening): Detail the protagonist's active decision, immediate actions, division of tasks, and coordination with others.
3. Future (The logical outcome): Conclude with the practical resolution, the benefit to the community or objective, and the personal satisfaction achieved.

Remember: The hero of your story does not need superhuman powers. They simply need a proactive attitude, emotional stability, and the willingness to take responsibility.`,
    sampleExercise: {
      prompt: 'Image stimulus: Two young persons in front of a village house discussing blueprints with a local elder.',
      analysis: 'Avoid turning this into an encounter with armed bandits. A grounded theme could be establishing a community rainwater harvesting tank before the monsoon season.',
      dosAndDonts: [
        { do: 'Show logical planning, organizing materials, and involving local youth.', dont: 'Do not make the hero single-handedly build a dam with no resources.' },
        { do: 'Detail realistic timelines and community cooperation.', dont: 'Avoid preachy moralizing or generic philosophical statements.' }
      ]
    }
  },
  {
    id: 'res-wat-speed-thought',
    title: 'WAT Mastery: Spontaneous Association in 15 Seconds',
    category: 'WAT',
    estimatedReadTime: '6 min read',
    featured: true,
    description: 'Deconstruct the 60-word speed drill. How to reveal natural optimism, maturity, and social adaptability without memorizing idioms.',
    keyTopics: ['Subconscious Projection', 'Handling Negative Stimuli', 'Active Verbs vs Passive Proverbs', 'Speed Writing Technique'],
    contentBody: `In the Word Association Test, 60 words appear sequentially on a screen for 15 seconds each. In those brief seconds, you must read the word, let an authentic cognitive reaction form, and write a complete sentence.

Why Memorized Quotes Fail:
When you write "Honesty is the best policy" or "Never give up", assessors learn nothing about *your* mind; they only see a memorized proverb. Assessors want to observe your spontaneous, natural associations with concepts like 'Risk', 'Failure', 'Fear', 'Duty', and 'Cooperation'.

Technique for Positive Reframing:
When presented with a negative stimulus like 'Death', 'Defeat', or 'Cruelty', do not deny reality. Acknowledge it constructively:
- Bad: "Defeat is bad." (Trivial)
- Bad: "A soldier never faces defeat." (Denial / Artificial bravado)
- Good: "Analytical review of past defeat lays the foundation for future triumph." (Actionable maturity)`,
    sampleExercise: {
      prompt: 'Stimulus Word: "FAILURE"',
      analysis: 'Demonstrate resilience, diagnostic learning, and persistence rather than avoidance or cliché quotes.',
      dosAndDonts: [
        { do: '"Analyzing initial failure sharpens strategy and guarantees eventual success."', dont: '"Failure is the pillar of success." (Overused cliché)' },
        { do: '"A determined leader treats temporary failure as constructive feedback."', dont: '"Never accept failure under any cost." (Defensive)' }
      ]
    }
  },
  {
    id: 'res-srt-practical-action',
    title: 'SRT Blueprint: Tactical Crisis Management and Moral Responsibility',
    category: 'SRT',
    estimatedReadTime: '7 min read',
    featured: false,
    description: 'How to write crisp, multi-step, pragmatic solutions for 60 situations within 30 minutes without skipping or panicking.',
    keyTopics: ['Time Allocation (30 sec/situation)', 'The 3-Action Formula', 'Physical vs Moral Courage', 'Handling Hazardous Scenarios'],
    contentBody: `The Situation Reaction Test presents a booklet with 60 everyday life and emergency situations. You have exactly 30 minutes, giving you an average of 30 seconds per reaction.

The Three Pillars of an Effective SRT Response:
1. Immediate Response: Address life-threatening safety, medical urgency, or physical security immediately (first aid, raising alarms, isolating dangers).
2. Resource Mobilization: Utilize available tools, bystanders, authorities, or local assets logically.
3. Follow-through to Completion: Ensure the task or injured person is fully delivered to safety, and then resume the original duty without abandoning responsibility.

Use telegraphic, action-oriented sentence structures with commas or semicolons to conserve time.`,
    sampleExercise: {
      prompt: 'Situation: He was traveling by train to attend an important interview when the carriage caught fire.',
      analysis: 'Assessors look for panic resistance, immediate alarm, passenger safety, fire extinguishing, and resuming travel.',
      dosAndDonts: [
        { do: 'Pulled alarm chain, woke passengers, used coach fire extinguisher to douse flames, tended injured, alerted guard, caught subsequent train, reached interview on time.', dont: 'Jumped out of train and ran away.' },
        { do: 'Demonstrate multi-tasking and concern for collective safety.', dont: 'Write only "Saved everyone" without specifying how.' }
      ]
    }
  },
  {
    id: 'res-self-description-guide',
    title: 'Constructing an Unshakeable Self-Description (SD)',
    category: 'Self Description',
    estimatedReadTime: '10 min read',
    featured: true,
    description: 'Why honest feedback from parents, colleagues, and friends is your greatest weapon against the psychologist\'s red pen.',
    keyTopics: ['The 5 Standard SD Paragraphs', 'Accepting Blind Spots', 'Aligning SD with PIQ and Interview', 'Demonstrating Growth'],
    contentBody: `In the Self-Description, candidates write about:
1. What parents think of you
2. What teachers / employers think of you
3. What friends / colleagues think of you
4. What you think of yourself
5. What traits you wish to develop in the future

The Deadly Trap of the "Super-Candidate":
Many aspirants portray themselves as flawless geniuses adored by everyone. When the Interviewing Officer later asks, "Tell me three things your father criticizes about you," an aspirant who claimed perfection gets completely trapped.

True self-awareness consists of knowing both your assets and your ongoing liabilities. A candidate who acknowledges, "My mother feels I occasionally overlook home chores when deeply immersed in exam prep, so I have started maintaining a daily family task checklist" demonstrates mature, active responsibility.`,
    sampleExercise: {
      prompt: 'Paragraph: "What traits I wish to develop in myself"',
      analysis: 'Highlight real, addressable professional or personal skills with active steps already underway.',
      dosAndDonts: [
        { do: 'Discuss wanting to improve physical endurance or public elocution, followed by your current running or reading routine.', dont: 'Write "I have no flaws" or "I am too helpful to others" (fake humility).' }
      ]
    }
  },
  {
    id: 'res-gto-ground-principles',
    title: 'GTO Fundamentals: Cantilevers, Fulcrums & Group Harmony',
    category: 'GTO',
    estimatedReadTime: '9 min read',
    featured: false,
    description: 'Understanding the physical principles behind the Progressive Group Task (PGT) and Half Group Task (HGT) without dominating teammates.',
    keyTopics: ['Physics of Bridging', 'Rule of Colour, Rigidity & Distance', 'Leading from Behind', 'Handling Aggressive Candidates'],
    contentBody: `The GTO series assesses you in an open outdoor ground environment. Candidates often mistakenly believe that the one who shouts loudest or grabs the plank first gets recommended.

In reality, the GTO observes:
- Who understands the structural balance of the helping material (plank, wooden log, rope)?
- Who stays calm when a teammate drops an idea or makes a mistake?
- Who assists others in crossing rather than prioritizing only their own crossing?
- Who offers constructive ideas quietly when the group gets stuck?

Core Ground Rules:
- Rule of Colour: Red (out of bounds for person and load), Yellow (in bounds for person, not load), Blue/White (free for person and load).
- Rule of Rigidity: Helping materials cannot be tied rigidly end-to-end to create an infinite beam.
- Rule of Distance: No leap or jump greater than 4 feet without bridging.`,
    sampleExercise: {
      prompt: 'Group is stuck at an intermediate structure 6 feet away from the start line with only one plank and one rope.',
      analysis: 'Look for anchor points to create a simple cantilever or first-class lever mechanism.',
      dosAndDonts: [
        { do: 'Explain the fulcrum concept calmly to the closest peer holding the rope.', dont: 'Push teammates aside or yell "Give me the plank, I know the trick!"' }
      ]
    }
  },
  {
    id: 'res-piq-audit',
    title: 'The PIQ Form: The Single Most Critical Document in SSB',
    category: 'Personal Interview',
    estimatedReadTime: '8 min read',
    featured: true,
    description: 'Every question in your Personal Interview traces back to the PIQ. How to fill it with absolute integrity, precision, and consistency.',
    keyTopics: ['Hobbies vs Interests', 'Academic Variations', 'Positions of Responsibility (POR)', 'Clarity of Family Details'],
    contentBody: `The Personal Information Questionnaire (PIQ) is copied in triplicate for the Interviewing Officer, the Psychologist, and the Board President. It is your biographical blueprint.

Common Blunders:
1. Confusing Hobbies with Interests: An interest is something you enjoy observing or learning about (e.g. reading defence aviation news). A hobby requires active, repeated personal creation or practice (e.g. sketching, marathon running, numismatics).
2. Inventing Fake PORs: Claiming to be "Prefect" or "Sports Captain" without knowing dates, duties, or challenges faced.
3. Inconsistent Academic Records: Failing to explain a percentage drop between 10th and 12th standard honestly.

The IO tests whether the person sitting across the table matches the person described in the ink on the sheet.`,
    sampleExercise: {
      prompt: 'Listing Hobbies and Extra-Curricular Activities',
      analysis: 'Be prepared for 15-20 minutes of deep technical inquiry on any hobby you list.',
      dosAndDonts: [
        { do: 'List 1-2 authentic activities you genuinely participate in weekly and understand in detail.', dont: 'List "reading books" if you have not finished a novel in the last 18 months.' }
      ]
    }
  },
  {
    id: 'res-communication-mirror',
    title: 'The Daily Mirror Elocution Drill: How Vamshi Mastered Fluency',
    category: 'Communication',
    estimatedReadTime: '5 min read',
    featured: false,
    description: 'The exact step-by-step 15-minute daily speech exercise that transformed a hesitant graduate into a commanding, articulate candidate.',
    keyTopics: ['Eliminating Ums and Ahs', 'Facial Expression & Eye Contact', 'The 3-Minute Stopwatch Technique', 'Topic Sourcing from Editorials'],
    contentBody: `Fluency in public speaking cannot be achieved by reading articles silently on a screen. Vocal cords, breath control, and facial muscle memory require physical repetition.

The 15-Minute Protocol:
1. Select one editorial headline from the morning broadsheet (e.g., "India's Semiconductor Mission" or "Indo-Pacific Naval Strategy").
2. Spend 2 minutes writing down 4 bullet points: Background, Current Challenge, Strategic Opportunities, and Concluding Recommendation.
3. Stand directly in front of a mirror, set a timer for 3 minutes, and speak continuously.
4. Maintain steady eye contact with your own reflection. If you hesitate or stumble, take a deep breath and deliberately slow your speech down rather than saying "um" or looking at the ceiling.
5. Record your voice on a smartphone once a week to monitor vocal modulation and pacing.`,
    sampleExercise: {
      prompt: 'Topic: "Renewable Energy Transition in Emerging Economies"',
      analysis: 'Divide the 3 minutes into 45s Background, 75s Key Challenges, 45s Solutions, 15s Conclusion.',
      dosAndDonts: [
        { do: 'Speak at a measured 110-120 words per minute with audible chest resonance.', dont: 'Rush through points as if racing against an imaginary siren.' }
      ]
    }
  },
  {
    id: 'res-defence-commands-structure',
    title: 'Indian Armed Forces Architecture: Commands, Equipment & Roles',
    category: 'Defence Awareness',
    estimatedReadTime: '11 min read',
    featured: false,
    description: 'A comprehensive operational briefing on Army, Navy, and Air Force command headquarters, ranks, weapons platforms, and current modernisation drives.',
    keyTopics: ['Army Operational Commands', 'Air Force Operational Commands', 'Navy Fleets & Commands', 'Joint Theatre Command Modernisation'],
    contentBody: `An aspirant appearing before the Services Selection Board must possess crisp knowledge of the institutional fabric of India\'s defence establishment.

Key Structural Reference:
- Indian Army: 7 Commands (Northern - Udhampur, Western - Chandimandir, Eastern - Kolkata, Southern - Pune, Central - Lucknow, South Western - Jaipur, ARTRAC - Shimla).
- Indian Air Force: 7 Commands (Western - New Delhi, Eastern - Shillong, Central - Prayagraj, Southern - Thiruvananthapuram, South Western - Gandhinagar, Training - Bengaluru, Maintenance - Nagpur).
- Indian Navy: 3 Commands (Western - Mumbai, Eastern - Visakhapatnam, Southern - Kochi).
- Tri-Service Command: Andaman & Nicobar Command (Port Blair) and Strategic Forces Command.

Be prepared to discuss your preferred service, your preferred arm or branch, current induction programs (Tejas Mk1A, Rafale, INS Vikrant, K9 Vajra), and key border logistics.`,
    sampleExercise: {
      prompt: 'IO Question: "Why do you want to join the Armoured Corps / Fighter Flying / Surface Fleet?"',
      analysis: 'Demonstrate deep understanding of the branch\'s tactical role, daily operational tempo, and personal physical suitability.',
      dosAndDonts: [
        { do: 'Highlight tactical dynamism, leadership of troops or high-performance machinery, and long-term commitment.', dont: 'Say "It looks glamorous in movie posters."' }
      ]
    }
  }
];
