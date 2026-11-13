export interface AdminAspirant {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetEntry: string;
  attemptHistory: string;
  status: 'Active' | 'Under Review' | 'Completed Cohort';
  assignedProgramme: string;
  practiceCount: number;
  lastActive: string;
  rating: string;
}

export const initialAdminAspirants: AdminAspirant[] = [
  {
    id: 'asp-101',
    name: 'Arjun Sharma',
    email: 'arjun.aspirant@example.com',
    phone: '+91 98765 43210',
    targetEntry: 'CDSE (IMA)',
    attemptHistory: '2 Conferenced-Out',
    status: 'Active',
    assignedProgramme: 'SSB Foundation & Psychology',
    practiceCount: 28,
    lastActive: '2 hours ago',
    rating: '8.4 / 10'
  },
  {
    id: 'asp-102',
    name: 'Kavya Nair',
    email: 'kavya.defence@example.com',
    phone: '+91 98450 11223',
    targetEntry: 'AFCAT (Flying / Admin)',
    attemptHistory: '1 Screened-Out',
    status: 'Active',
    assignedProgramme: 'Communication & Stage-1 PPDT',
    practiceCount: 34,
    lastActive: '5 hours ago',
    rating: '9.0 / 10'
  },
  {
    id: 'asp-103',
    name: 'Rohan Deshmukh',
    email: 'rohan.mech@example.com',
    phone: '+91 97654 33221',
    targetEntry: 'TGC / SSC Tech Army',
    attemptHistory: 'First Timer',
    status: 'Active',
    assignedProgramme: 'GTO Tasks & Cantilever Dynamics',
    practiceCount: 16,
    lastActive: 'Yesterday',
    rating: '7.8 / 10'
  },
  {
    id: 'asp-104',
    name: 'Vikramaditya Rathore',
    email: 'vikram.rathore@example.com',
    phone: '+91 94140 88776',
    targetEntry: 'NDA (Army Wing)',
    attemptHistory: 'First Timer',
    status: 'Active',
    assignedProgramme: 'OLQ Daily Habit Architecture',
    practiceCount: 42,
    lastActive: '1 day ago',
    rating: '8.9 / 10'
  },
  {
    id: 'asp-105',
    name: 'Neha Chawla',
    email: 'neha.pilot@example.com',
    phone: '+91 98110 55443',
    targetEntry: 'AFCAT (Flying Branch)',
    attemptHistory: '3 Conferenced-Out',
    status: 'Under Review',
    assignedProgramme: 'Personal Mentorship & Diagnostic',
    practiceCount: 19,
    lastActive: '3 days ago',
    rating: '8.1 / 10'
  }
];

export interface AdminSubmission {
  id: string;
  aspirantName: string;
  aspirantEmail: string;
  assignmentTitle: string;
  submittedAt: string;
  status: 'Pending Review' | 'Reviewed';
  contentSnippet: string;
  existingFeedback?: string;
  ratingScore?: string;
}

export const initialAdminSubmissions: AdminSubmission[] = [
  {
    id: 'sub-01',
    aspirantName: 'Arjun Sharma',
    aspirantEmail: 'arjun.aspirant@example.com',
    assignmentTitle: 'Write 3 Realistic TAT Stories from Practice Set A',
    submittedAt: 'Today, 06:40 AM',
    status: 'Pending Review',
    contentSnippet: 'Story 1: Rajesh, an agricultural engineering graduate visiting his village during irrigation shortages, gathered 4 local farmers and organized a silt-cleaning schedule for the central canal...'
  },
  {
    id: 'sub-02',
    aspirantName: 'Kavya Nair',
    aspirantEmail: 'kavya.defence@example.com',
    assignmentTitle: '3-Minute Lecturette Self-Recording Transcript',
    submittedAt: 'Yesterday, 08:15 PM',
    status: 'Pending Review',
    contentSnippet: 'Topic: Maritime Security in the Indian Ocean. Divided into 3 points: 1) Strategic choke points (Malacca, Bab-el-Mandeb), 2) Modernization of naval corvette flotillas, 3) SAGAR doctrine...'
  },
  {
    id: 'sub-03',
    aspirantName: 'Rohan Deshmukh',
    aspirantEmail: 'rohan.mech@example.com',
    assignmentTitle: 'GTO Cantilever Load-Bearing Diagram Analysis',
    submittedAt: 'Nov 10, 2026',
    status: 'Reviewed',
    contentSnippet: 'Analyzed the 2-plank bridging mechanism across a 7-foot dry ditch using the yellow vertical upright as a first-order fulcrum with tied rope tension...',
    existingFeedback: 'Mathematically sound cantilever diagram. In actual practice, remember to brief your group subordinates clearly before touching the materials.',
    ratingScore: '8.5 / 10'
  }
];

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'submission' | 'enquiry' | 'session' | 'system';
  unread: boolean;
}

export const initialAdminNotifications: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'New TAT Assignment Submission',
    message: 'Arjun Sharma submitted 3 Realistic TAT Stories for evaluation.',
    timestamp: '2 hours ago',
    type: 'submission',
    unread: true
  },
  {
    id: 'notif-2',
    title: 'Mentorship Session Scheduled',
    message: '1-on-1 Psychological Diagnostic call confirmed with Arjun for Saturday 18:00 IST.',
    timestamp: '5 hours ago',
    type: 'session',
    unread: true
  },
  {
    id: 'notif-3',
    title: 'New Aspirant Enquiry Received',
    message: 'Enquiry from Priyanshu (AFCAT Candidate, Bengaluru) via Contact Form.',
    timestamp: 'Yesterday',
    type: 'enquiry',
    unread: false
  }
];
