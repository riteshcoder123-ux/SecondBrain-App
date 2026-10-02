import { Memory, AIInsight, Collection } from '../types/memory';

export const INITIAL_MEMORIES: Memory[] = [
  {
    id: 'mem-dbms-assignment',
    title: 'DBMS Assignment Submission',
    content: 'University Course Portal Notice: Submit Unit 3 DBMS Assignment (Relational Algebra & Normalization 1NF to BCNF) before Monday, October 12 at 11:59 PM. Upload PDF with ER diagrams.',
    summary: 'Submit Unit 3 assignment before Monday, October 12. Covers relational algebra, BCNF normalization, and ER diagrams.',
    sourceType: 'screenshot',
    category: 'Academic',
    topics: ['DBMS', 'Assignment', 'Computer Science', 'Databases'],
    entities: ['Unit 3', 'Relational Algebra', 'Prof. Vance', 'October 12'],
    keyFacts: [
      'Subject: Database Management Systems (DBMS)',
      'Assignment: Unit 3 Submission',
      'Deadline: October 12 at 11:59 PM',
      'Requirements: PDF with ER diagrams & normalization tables'
    ],
    actionItems: [
      'Complete Unit 3 normalization problems',
      'Export ER diagram to PDF before Oct 12 deadline'
    ],
    detectedDates: ['2026-10-12T23:59:00Z'],
    importance: 'high',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2h ago
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    relationships: [
      {
        targetMemoryId: 'mem-dbms-notes',
        relationshipType: 'RELATED_TO',
        confidence: 0.96,
        reason: 'Both memories reference DBMS Unit 3 relational algebra and database normalization.'
      },
      {
        targetMemoryId: 'mem-dbms-exam',
        relationshipType: 'BEFORE',
        confidence: 0.88,
        reason: 'Assignment submission is required before the mid-term DBMS exam schedule.'
      }
    ]
  },
  {
    id: 'mem-dbms-notes',
    title: 'DBMS Unit 3 Lecture Notes & Relational Algebra',
    content: 'Lecture notes covering relational query optimization, Cartesian products vs theta-joins, and BCNF decomposition without losing functional dependencies. Unit 3 syllabus references page 142 in Ramakrishnan.',
    summary: 'Detailed study notes for Unit 3 covering query optimization, theta-joins, and dependency-preserving BCNF decomposition.',
    sourceType: 'document',
    category: 'Academic',
    topics: ['DBMS', 'College', 'Databases', 'Study Notes'],
    entities: ['Ramakrishnan & Gehrke', 'Relational Algebra', 'BCNF'],
    keyFacts: [
      'Covers Chapter 6: Relational Algebra and Calculus',
      'Preserving functional dependencies in 3NF vs BCNF',
      'Referenced textbook: Ramakrishnan, page 142'
    ],
    actionItems: ['Review theta-join query trees before assignment'],
    detectedDates: [],
    importance: 'normal',
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    relationships: [
      {
        targetMemoryId: 'mem-dbms-assignment',
        relationshipType: 'REFERENCE_FOR',
        confidence: 0.95,
        reason: 'These notes provide theoretical formulas required for the Unit 3 assignment.'
      }
    ]
  },
  {
    id: 'mem-dbms-exam',
    title: 'DBMS Mid-Term Exam Schedule',
    content: 'Mid-term examination for Database Management Systems scheduled for October 24 in Hall B. Covers Units 1 through 3.',
    summary: 'DBMS mid-term examination in Hall B covering Units 1 to 3 on October 24.',
    sourceType: 'photo',
    category: 'Academic',
    topics: ['DBMS', 'Exam', 'College'],
    entities: ['Hall B', 'October 24', 'Prof. Vance'],
    keyFacts: [
      'Date: October 24',
      'Location: Examination Hall B',
      'Syllabus scope: Units 1, 2, and 3'
    ],
    actionItems: ['Prepare revision flashcards by Oct 20'],
    detectedDates: ['2026-10-24T09:00:00Z'],
    importance: 'high',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    relationships: [
      {
        targetMemoryId: 'mem-dbms-assignment',
        relationshipType: 'AFTER',
        confidence: 0.9,
        reason: 'Exam tests the same curriculum as the Unit 3 assignment.'
      }
    ]
  },
  {
    id: 'mem-cctv-website',
    title: 'CCTV Security Business Website Concept',
    content: 'Saved concept on Sep 23: High-converting lead generation website for commercial CCTV security installers. Core value proposition: 24/7 smart perimeter monitoring with zero upfront hardware lease. Include an instant security quote calculator and local SEO landing pages.',
    summary: 'Lead generation website concept for commercial CCTV installers featuring instant quote calculator and local SEO.',
    sourceType: 'screenshot',
    category: 'Ideas',
    topics: ['Web Development', 'Business Projects', 'CCTV', 'Lead Generation'],
    entities: ['Commercial Security', 'Quote Calculator', 'Local SEO'],
    keyFacts: [
      'Saved concept on September 23',
      'Target client: Commercial warehouses & business parks',
      'Key feature: Instant perimeter camera quote estimator'
    ],
    actionItems: ['Mockup wireframe for instant quote calculator', 'Draft copy for local SEO pages'],
    detectedDates: ['2026-09-23T14:30:00Z'],
    importance: 'normal',
    createdAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 9 * 24 * 3600 * 1000).toISOString(),
    relationships: [
      {
        targetMemoryId: 'mem-driving-school',
        relationshipType: 'SAME_PROJECT',
        confidence: 0.82,
        reason: 'Shares the same local service business lead-generation web model.'
      }
    ]
  },
  {
    id: 'mem-driving-school',
    title: 'Driving School Website & Booking System',
    content: 'Client project idea saved Sep 18: Online booking calendar for local driving instructors. Automatic SMS reminders 2 hours before lesson, instant license-test route simulator, and payment integration with Stripe.',
    summary: 'Online booking calendar for driving school with SMS reminders and Stripe payment processing.',
    sourceType: 'note',
    category: 'Project',
    topics: ['Web Development', 'Client Leads', 'Website Ideas', 'Freelance'],
    entities: ['Driving Academy', 'Stripe', 'Twilio SMS'],
    keyFacts: [
      'Saved idea on September 18',
      'Features: 2-hour lesson SMS reminder + Stripe upfront booking',
      'Client: Metro Driving School'
    ],
    actionItems: ['Confirm API pricing for Twilio SMS reminders'],
    detectedDates: ['2026-09-18T10:15:00Z'],
    importance: 'normal',
    createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
    relationships: [
      {
        targetMemoryId: 'mem-cctv-website',
        relationshipType: 'RELATED_TO',
        confidence: 0.85,
        reason: 'Both represent local client service web platforms created in September.'
      }
    ]
  },
  {
    id: 'mem-java-binary-search',
    title: 'Java Binary Search & Algorithmic Notes',
    content: 'Java implementation notes for Binary Search on rotated arrays: remember mid calculation using low + (high - low) / 2 to prevent integer overflow. O(log N) time complexity. Corner cases: duplicates and single element arrays.',
    summary: 'Java implementation details for Binary Search with overflow prevention and rotated array edge cases.',
    sourceType: 'note',
    category: 'Academic',
    topics: ['Java', 'Programming', 'Algorithms', 'College'],
    entities: ['Binary Search', 'Java SE', 'O(log N)'],
    keyFacts: [
      'Integer overflow fix: mid = low + (high - low) / 2',
      'Complexity: Time O(log N), Space O(1)',
      'Handles rotated sorted arrays'
    ],
    actionItems: ['Implement unit test for duplicate elements'],
    detectedDates: [],
    importance: 'normal',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    relationships: [
      {
        targetMemoryId: 'mem-dbms-notes',
        relationshipType: 'SAME_TOPIC',
        confidence: 0.74,
        reason: 'Both belong to computer science curriculum and algorithmic data indexing.'
      }
    ]
  },
  {
    id: 'mem-ai-memory-architecture',
    title: 'Personal Memory OS Architecture',
    content: 'Idea brainstorm: What if an AI app had zero manual folders or tags? The user throws in photos, receipts, screenshots, voice memos, and PDFs. The system extracts entities, constructs an implicit relationship graph, and retrieves answers with grounded source citations.',
    summary: 'Core concept for a zero-friction Personal Memory OS using auto-tagging, entity extraction, and grounded RAG.',
    sourceType: 'voice',
    category: 'Ideas',
    topics: ['AI Projects', 'Personal Memory', 'Knowledge Graph', 'RAG'],
    entities: ['Second Brain', 'Vector Index', 'RAG Retrieval'],
    keyFacts: [
      'Saved voice note during evening walk',
      'Principle: Capture -> Understand -> Connect -> Remember -> Retrieve',
      'Explicitly avoids manual folder and tag organization'
    ],
    actionItems: ['Build prototype with mobile-first thumb navigation'],
    detectedDates: [],
    importance: 'high',
    createdAt: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString(), // 1 year ago (for On This Day!)
    updatedAt: new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString(),
    relationships: []
  },
  {
    id: 'mem-tokyo-flight',
    title: 'Tokyo Flight Booking & Hotel Details',
    content: 'Flight booking confirmed: ANA Flight NH107 departing SFO on Nov 14 at 11:20 AM, arriving Haneda (HND) Nov 15 at 3:15 PM. Hotel: Sequence Miyashita Park in Shibuya, reservation #TK-884920.',
    summary: 'Flight itinerary to Tokyo (ANA NH107) and reservation at Sequence Miyashita Park, Shibuya.',
    sourceType: 'document',
    category: 'Travel',
    topics: ['Travel', 'Tokyo', 'Flight', 'Hotel'],
    entities: ['ANA NH107', 'Haneda Airport', 'Sequence Miyashita Park', 'Shibuya'],
    keyFacts: [
      'Departure: Nov 14 at 11:20 AM (SFO)',
      'Arrival: Nov 15 at 3:15 PM (HND)',
      'Hotel: Sequence Miyashita Park, Shibuya',
      'Confirmation number: TK-884920'
    ],
    actionItems: ['Download Visit Japan Web QR code', 'Check passport validity (6 months)'],
    detectedDates: ['2026-11-14T11:20:00Z', '2026-11-15T15:15:00Z'],
    importance: 'high',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    relationships: []
  }
];

export const INITIAL_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-1',
    type: 'deadline',
    title: 'Upcoming Academic Deadline',
    message: 'You saved a DBMS Unit 3 Assignment deadline for October 12. It is coming up shortly.',
    relatedMemoryIds: ['mem-dbms-assignment', 'mem-dbms-notes'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ins-2',
    type: 'pattern',
    title: 'Connected Client Project Concepts',
    message: 'Your CCTV Security concept and Driving School notes both explore local lead generation platforms with automated client notifications.',
    relatedMemoryIds: ['mem-cctv-website', 'mem-driving-school'],
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
  },
  {
    id: 'ins-3',
    type: 'connection',
    title: 'Academic Synergy Detected',
    message: 'Your lecture notes reference relational algebra formulas that directly solve the questions in your Unit 3 assignment.',
    relatedMemoryIds: ['mem-dbms-assignment', 'mem-dbms-notes'],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-academic',
    name: 'College & DBMS',
    description: 'Coursework, assignment deadlines, lecture notes and exam prep',
    memoryCount: 3,
    isAutoGenerated: true,
    memoryIds: ['mem-dbms-assignment', 'mem-dbms-notes', 'mem-dbms-exam']
  },
  {
    id: 'col-websites',
    name: 'Web & Client Projects',
    description: 'Commercial service concepts, lead generation, and client ideas',
    memoryCount: 2,
    isAutoGenerated: true,
    memoryIds: ['mem-cctv-website', 'mem-driving-school']
  },
  {
    id: 'col-ai',
    name: 'AI Projects & Second Brain',
    description: 'Personal memory architectures, knowledge graphs, and RAG systems',
    memoryCount: 1,
    isAutoGenerated: true,
    memoryIds: ['mem-ai-memory-architecture']
  },
  {
    id: 'col-travel',
    name: 'Travel & Itineraries',
    description: 'Tickets, flights, reservations, and travel confirmations',
    memoryCount: 1,
    isAutoGenerated: true,
    memoryIds: ['mem-tokyo-flight']
  }
];
