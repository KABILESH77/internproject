import { Internship } from '../components/InternshipCard';

export const mockInternships: Internship[] = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    organization: 'TechGov Solutions',
    location: 'Washington, DC',
    isRemote: false,
    stipend: '$1,500/month',
    isBeginner: true,
    isVerified: true,
    distance: '3.2 km away',
    duration: '3 months',
    postedDate: '2 days ago',
    reasons: {
      skillMatch: 4,
      distance: '3.2 km away',
      interest: true
    },
    description: 'Join our team to build digital tools that serve millions of citizens. You\'ll work on web applications that make government services more accessible and user-friendly.',
    responsibilities: [
      'Develop and maintain web applications using React and Node.js',
      'Collaborate with designers to implement accessible user interfaces',
      'Write clean, documented code following best practices',
      'Participate in code reviews and team meetings',
      'Help improve existing government digital services'
    ],
    requirements: [
      'Currently enrolled in college or recently graduated',
      'Basic knowledge of JavaScript and HTML/CSS',
      'Interest in public service and civic technology',
      'Good communication and teamwork skills',
      'No prior work experience required'
    ],
    applyUrl: '#'
  },
  {
    id: '2',
    title: 'Data Analysis Intern',
    organization: 'Department of Education',
    location: 'Remote',
    isRemote: true,
    stipend: '$1,200/month',
    isBeginner: true,
    isVerified: true,
    distance: undefined,
    duration: '4 months',
    postedDate: '1 week ago',
    reasons: {
      skillMatch: 3,
      interest: true
    },
    description: 'Help analyze educational data to improve student outcomes nationwide. This fully remote position is perfect for beginners interested in data and social impact.',
    responsibilities: [
      'Clean and organize educational datasets using Excel and Python',
      'Create visualizations and reports for stakeholders',
      'Support research projects on student achievement',
      'Document data analysis processes',
      'Present findings to team members'
    ],
    requirements: [
      'Familiarity with Excel or Google Sheets',
      'Basic understanding of data analysis concepts',
      'Interest in education policy',
      'Strong attention to detail',
      'Ability to work independently in remote environment'
    ],
    applyUrl: '#'
  },
  {
    id: '3',
    title: 'UX Research Intern',
    organization: 'Digital Services Agency',
    location: 'San Francisco, CA',
    isRemote: false,
    stipend: '$1,800/month',
    isBeginner: true,
    isVerified: true,
    distance: '8 km away',
    duration: '3 months',
    postedDate: '3 days ago',
    reasons: {
      skillMatch: 3,
      distance: '8 km away',
      interest: true
    },
    description: 'Research how people interact with government websites and help make them better. Learn UX research methods while contributing to important public services.',
    responsibilities: [
      'Conduct user interviews and usability tests',
      'Analyze user feedback and behavior data',
      'Create research reports and presentations',
      'Collaborate with designers and developers',
      'Help improve accessibility of digital services'
    ],
    requirements: [
      'Interest in user experience and design',
      'Good communication and listening skills',
      'Basic understanding of research methods',
      'Empathy for diverse user needs',
      'No prior internship experience required'
    ],
    applyUrl: '#'
  },
  {
    id: '4',
    title: 'Communications Intern',
    organization: 'Environmental Protection Agency',
    location: 'Boston, MA',
    isRemote: false,
    stipend: '$1,400/month',
    isBeginner: true,
    isVerified: true,
    distance: '12 km away',
    duration: '3 months',
    postedDate: '5 days ago',
    reasons: {
      skillMatch: 2,
      distance: '12 km away',
      interest: true
    },
    description: 'Help communicate important environmental initiatives to the public. Create content for social media, newsletters, and public education campaigns.',
    responsibilities: [
      'Write and edit content for social media and newsletters',
      'Help organize community outreach events',
      'Create educational materials about environmental programs',
      'Monitor and respond to public inquiries',
      'Support media relations activities'
    ],
    requirements: [
      'Strong writing and communication skills',
      'Interest in environmental issues',
      'Familiarity with social media platforms',
      'Creative thinking and attention to detail',
      'Beginner-friendly, training provided'
    ],
    applyUrl: '#'
  },
  {
    id: '5',
    title: 'Healthcare IT Intern',
    organization: 'Department of Health Services',
    location: 'Austin, TX',
    isRemote: false,
    stipend: '$1,600/month',
    isBeginner: true,
    isVerified: true,
    distance: '15 km away',
    duration: '4 months',
    postedDate: '1 day ago',
    reasons: {
      skillMatch: 4,
      distance: '15 km away',
      interest: true
    },
    description: 'Support the technology infrastructure that helps deliver healthcare services. Learn about health IT systems while making a real difference in people\'s lives.',
    responsibilities: [
      'Assist with health information systems maintenance',
      'Help troubleshoot basic technical issues',
      'Document IT processes and procedures',
      'Support data security and privacy initiatives',
      'Learn about healthcare technology standards'
    ],
    requirements: [
      'Basic computer and technical skills',
      'Interest in healthcare and technology',
      'Good problem-solving abilities',
      'Attention to detail and confidentiality',
      'Entry-level position, training provided'
    ],
    applyUrl: '#'
  },
  {
    id: '6',
    title: 'Policy Research Intern',
    organization: 'Housing & Urban Development',
    location: 'New York, NY',
    isRemote: true,
    stipend: '$1,300/month',
    isBeginner: true,
    isVerified: true,
    distance: undefined,
    duration: '3 months',
    postedDate: '4 days ago',
    reasons: {
      skillMatch: 2,
      interest: true
    },
    description: 'Research affordable housing policies and help develop solutions to housing challenges. Remote position with flexible hours for students.',
    responsibilities: [
      'Research housing policies and best practices',
      'Analyze data on housing trends',
      'Write research summaries and policy briefs',
      'Attend virtual meetings and webinars',
      'Support policy development projects'
    ],
    requirements: [
      'Interest in housing policy and urban planning',
      'Good research and writing skills',
      'Ability to analyze information from multiple sources',
      'Self-motivated and organized',
      'No prior experience necessary'
    ],
    applyUrl: '#'
  }
];
