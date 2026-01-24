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
    description: 'Join our dynamic team to build cutting-edge digital tools that serve millions of citizens across the nation. As a Software Engineering Intern, you\'ll work hands-on with modern web technologies to create accessible, user-friendly government services. This is a unique opportunity to gain real-world experience while making a meaningful impact on public service delivery.',
    responsibilities: [
      'Develop and maintain responsive web applications using React, TypeScript, and Node.js',
      'Collaborate with UX designers to implement pixel-perfect, accessible user interfaces following WCAG 2.1 guidelines',
      'Write clean, well-documented, and thoroughly tested code following industry best practices',
      'Participate in daily standups, code reviews, and agile sprint planning sessions',
      'Contribute to improving existing government digital services and internal tools',
      'Debug and troubleshoot issues across the full technology stack',
      'Learn and apply secure coding practices for government applications'
    ],
    requirements: [
      'Currently enrolled in a Computer Science, Software Engineering, or related degree program',
      'Foundational knowledge of JavaScript, HTML5, and CSS3',
      'Genuine interest in public service, civic technology, and digital government',
      'Strong communication skills and ability to work effectively in a team environment',
      'No prior professional work experience required – we invest in training!',
      'Bonus: Familiarity with Git, React, or any backend framework'
    ],
    keywords: [
      'javascript', 'react', 'node.js', 'typescript', 'html', 'css', 'git',
      'web development', 'frontend', 'backend', 'api', 'rest', 'agile',
      'software engineering', 'full stack', 'debugging', 'testing', 'mvc'
    ],
    aboutCompany: 'TechGov Solutions is a leading civic technology company partnering with federal and state agencies to modernize government services. Founded in 2015, we\'ve helped over 50 agencies transform their digital presence, serving more than 100 million citizens annually. Our mission is to make government services as easy to use as the best consumer apps.',
    whatYoullLearn: [
      'Modern web development with React and TypeScript ecosystem',
      'Agile software development methodologies (Scrum/Kanban)',
      'How to build accessible applications that serve diverse populations',
      'Government technology standards and security compliance requirements',
      'Professional software development workflows including Git and CI/CD',
      'How to write effective technical documentation'
    ],
    skillsYoullGain: [
      'React.js', 'TypeScript', 'Node.js', 'Git', 'Agile/Scrum', 'REST APIs', 
      'Accessibility (a11y)', 'Code Review', 'Technical Writing'
    ],
    projectExamples: [
      'Build a citizen portal feature that helps users track government service requests',
      'Develop an internal dashboard for monitoring application performance metrics',
      'Create reusable UI component library for consistency across government websites',
      'Implement automated testing suite to improve code quality'
    ],
    benefits: [
      'Competitive monthly stipend of $1,500',
      'Flexible work hours with core collaboration time',
      'Free lunch on Tuesdays and Thursdays',
      'Access to online learning platforms (Udemy, Pluralsight)',
      'Networking events with government technology leaders',
      'Potential for full-time offer upon graduation'
    ],
    workSchedule: 'Full-time (40 hrs/week), Mon-Fri 9AM-5PM with flexibility',
    teamSize: '8-12 engineers in the Digital Services team',
    applicationDeadline: 'February 28, 2026',
    mentorship: '1-on-1 mentorship with senior engineer + weekly learning sessions',
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
    description: 'Make a real difference in education by helping analyze data that shapes policies affecting millions of students nationwide. This fully remote position offers beginners an incredible opportunity to develop data analysis skills while contributing to meaningful research on student outcomes, educational equity, and program effectiveness.',
    responsibilities: [
      'Clean, organize, and validate large educational datasets using Excel, Python, and SQL',
      'Create compelling data visualizations and dashboards using Tableau or Power BI',
      'Support research projects analyzing student achievement gaps and intervention effectiveness',
      'Document data analysis methodologies and create reproducible analysis pipelines',
      'Present findings and insights to team members and stakeholders in weekly meetings',
      'Collaborate with researchers to identify trends and patterns in educational data',
      'Assist in preparing data reports for congressional briefings and policy makers'
    ],
    requirements: [
      'Proficiency in Excel or Google Sheets for data manipulation',
      'Basic understanding of statistics and data analysis concepts',
      'Genuine interest in education policy and improving student outcomes',
      'Strong attention to detail and commitment to data accuracy',
      'Ability to work independently and manage time effectively in a remote environment',
      'Bonus: Experience with Python, R, SQL, or any data visualization tool'
    ],
    keywords: [
      'python', 'excel', 'sql', 'data analysis', 'pandas', 'statistics',
      'data visualization', 'tableau', 'power bi', 'jupyter', 'numpy',
      'data cleaning', 'reporting', 'analytics', 'matplotlib', 'research'
    ],
    aboutCompany: 'The Department of Education is the federal agency responsible for establishing policy for, administering, and coordinating most federal assistance to education. Our Office of Planning, Evaluation, and Policy Development uses data-driven approaches to improve educational outcomes for over 50 million K-12 students and ensure equal access to quality education.',
    whatYoullLearn: [
      'Professional data analysis techniques and best practices',
      'How to work with large-scale government datasets securely',
      'Data visualization and storytelling for policy audiences',
      'Statistical methods commonly used in educational research',
      'How federal policy decisions are informed by data analysis',
      'Remote collaboration tools and practices'
    ],
    skillsYoullGain: [
      'Python/Pandas', 'SQL', 'Tableau', 'Statistical Analysis', 'Data Cleaning',
      'Report Writing', 'Research Methods', 'Excel Advanced', 'Data Visualization'
    ],
    projectExamples: [
      'Analyze state-level reading proficiency data to identify successful intervention programs',
      'Build an interactive dashboard tracking national graduation rates over time',
      'Clean and merge datasets from multiple sources for longitudinal student outcome studies',
      'Create visualizations for annual education statistics reports'
    ],
    benefits: [
      'Monthly stipend of $1,200 with no commute costs',
      'Fully remote with flexible scheduling around classes',
      'Home office equipment stipend ($200)',
      'Access to federal employee learning and development resources',
      'Letter of recommendation upon successful completion',
      'Networking opportunities with education policy experts'
    ],
    workSchedule: 'Part-time or full-time options (20-40 hrs/week), flexible hours',
    teamSize: '5-person research analytics team',
    applicationDeadline: 'March 15, 2026',
    mentorship: 'Weekly check-ins with Data Science Lead + monthly career guidance',
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
    description: 'Discover how real people interact with government websites and help make them dramatically better! As a UX Research Intern, you\'ll conduct user interviews, run usability tests, and analyze behavior data to ensure government digital services work for everyone – including people with disabilities, seniors, and those with limited technology access.',
    responsibilities: [
      'Plan and conduct user interviews with diverse citizen populations',
      'Run moderated and unmoderated usability testing sessions',
      'Analyze quantitative data from analytics tools and A/B tests',
      'Create detailed research reports with actionable recommendations',
      'Develop user personas and journey maps based on research findings',
      'Collaborate closely with designers and developers to implement improvements',
      'Champion accessibility and inclusive design throughout the organization'
    ],
    requirements: [
      'Strong curiosity about user behavior and human-centered design',
      'Excellent communication, listening, and empathy skills',
      'Basic understanding of research methodologies (qualitative and quantitative)',
      'Genuine care for diverse user needs and accessibility',
      'No prior internship experience required – enthusiasm matters most!',
      'Bonus: Familiarity with Figma, survey tools, or research software'
    ],
    keywords: [
      'ux research', 'user testing', 'usability', 'figma', 'wireframing',
      'prototyping', 'user interviews', 'personas', 'journey mapping', 'accessibility',
      'heuristic evaluation', 'a/b testing', 'survey design', 'qualitative research', 'user experience'
    ],
    aboutCompany: 'The Digital Services Agency is a pioneering government technology unit inspired by the UK\'s Government Digital Service. We partner with agencies across California to redesign government services that are simple, clear, and fast. Our work has improved the experience for millions of residents accessing benefits, permits, and public information.',
    whatYoullLearn: [
      'Industry-standard UX research methods and frameworks',
      'How to recruit and interview diverse participant groups',
      'Usability testing techniques for web and mobile applications',
      'Accessibility evaluation using WCAG guidelines and assistive technologies',
      'How to synthesize research into actionable design recommendations',
      'Collaboration skills in a cross-functional product team'
    ],
    skillsYoullGain: [
      'User Interviews', 'Usability Testing', 'Survey Design', 'Data Synthesis',
      'Persona Development', 'Journey Mapping', 'Accessibility Auditing', 'Figma', 'Research Presentation'
    ],
    projectExamples: [
      'Conduct usability testing on the state\'s new DMV appointment system',
      'Research how elderly citizens navigate government benefit portals',
      'Create accessibility audit report for high-traffic government websites',
      'Develop persona library representing California\'s diverse population'
    ],
    benefits: [
      'Competitive $1,800 monthly stipend',
      'Modern downtown SF office with beautiful views',
      'Daily catered lunch and unlimited snacks',
      'UX conference attendance (one event of your choice)',
      'Portfolio-ready project work',
      'Strong consideration for full-time roles'
    ],
    workSchedule: 'Full-time (40 hrs/week), Mon-Fri with occasional user testing evenings',
    teamSize: '4-person UX team within 20-person product organization',
    applicationDeadline: 'February 20, 2026',
    mentorship: 'Paired with Senior UX Researcher + bi-weekly design team critiques',
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
    description: 'Help communicate critical environmental initiatives to millions of Americans! As a Communications Intern, you\'ll craft compelling content for social media, newsletters, and public education campaigns. You\'ll learn how government agencies inform and engage citizens on issues like clean air, water quality, and climate resilience.',
    responsibilities: [
      'Write and edit engaging content for social media platforms (Twitter, Facebook, Instagram, LinkedIn)',
      'Help organize and promote community outreach events and public hearings',
      'Create educational materials about EPA programs using plain language principles',
      'Monitor social media channels and draft responses to public inquiries',
      'Support media relations by preparing press materials and tracking coverage',
      'Develop content calendars and schedule posts using social media management tools',
      'Assist with photography and basic graphic design for campaign materials'
    ],
    requirements: [
      'Strong writing skills with ability to explain complex topics simply',
      'Genuine passion for environmental issues and sustainability',
      'Active presence on social media with understanding of platform best practices',
      'Creative thinking with attention to detail and brand consistency',
      'Beginner-friendly – comprehensive training and guidance provided',
      'Bonus: Experience with Canva, Adobe Creative Suite, or video editing'
    ],
    keywords: [
      'content writing', 'social media', 'copywriting', 'marketing', 'public relations',
      'newsletter', 'blogging', 'communication', 'storytelling', 'content strategy',
      'brand voice', 'editing', 'proofreading', 'canva', 'email marketing', 'outreach'
    ],
    aboutCompany: 'The Environmental Protection Agency\'s Region 1 office serves the six New England states, protecting human health and the environment for over 14 million residents. Our communications team helps citizens understand air quality alerts, water safety information, and how to participate in environmental decision-making that affects their communities.',
    whatYoullLearn: [
      'Government communications best practices and plain language writing',
      'How to communicate scientific information to general audiences',
      'Social media strategy for public sector organizations',
      'Crisis communications and public affairs fundamentals',
      'Media relations and working with journalists',
      'Environmental science and policy basics'
    ],
    skillsYoullGain: [
      'Content Writing', 'Social Media Management', 'Plain Language', 'Canva',
      'Press Release Writing', 'Community Outreach', 'Email Campaigns', 'Media Monitoring'
    ],
    projectExamples: [
      'Develop social media campaign for Earth Day events across New England',
      'Write newsletter articles explaining new air quality monitoring programs',
      'Create infographics about proper recycling and hazardous waste disposal',
      'Help coordinate public comment period communications for environmental reviews'
    ],
    benefits: [
      'Monthly stipend of $1,400',
      'Historic office building in downtown Boston',
      'MBTA transit pass provided',
      'Networking with environmental professionals and scientists',
      'Published bylines and portfolio samples',
      'Invitation to regional environmental conferences'
    ],
    workSchedule: 'Full-time (40 hrs/week), standard business hours with event flexibility',
    teamSize: '6-person communications and public affairs team',
    applicationDeadline: 'March 1, 2026',
    mentorship: 'Direct mentorship from Communications Director + weekly writing workshops',
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
    description: 'Support the technology infrastructure that helps deliver healthcare services to millions of Texans! As a Healthcare IT Intern, you\'ll gain hands-on experience with health information systems, learn about HIPAA compliance, and contribute to projects that directly impact patient care and public health outcomes.',
    responsibilities: [
      'Assist with maintenance and updates of electronic health record (EHR) systems',
      'Help troubleshoot hardware, software, and network issues for clinical staff',
      'Document IT processes, procedures, and system configurations',
      'Support data security initiatives and HIPAA compliance monitoring',
      'Learn healthcare technology standards including HL7 and FHIR',
      'Participate in system testing and quality assurance activities',
      'Assist with onboarding new users and conducting basic IT training'
    ],
    requirements: [
      'Basic computer skills and genuine interest in technology',
      'Curiosity about healthcare and how technology improves patient outcomes',
      'Strong problem-solving abilities and patience for troubleshooting',
      'Exceptional attention to detail – healthcare data accuracy is critical',
      'Entry-level position with comprehensive training provided',
      'Bonus: Coursework in IT, healthcare informatics, or related fields'
    ],
    keywords: [
      'healthcare', 'ehr', 'hipaa', 'health informatics', 'medical records',
      'it support', 'troubleshooting', 'database', 'system administration', 'networking',
      'data security', 'compliance', 'clinical systems', 'hl7', 'fhir', 'technical support'
    ],
    aboutCompany: 'The Texas Department of Health Services oversees public health programs serving 30 million residents. Our IT division manages critical systems including disease surveillance, immunization registries, vital records, and telehealth platforms. We\'re modernizing legacy systems and implementing innovative solutions to improve health outcomes statewide.',
    whatYoullLearn: [
      'Healthcare IT fundamentals and industry terminology',
      'HIPAA privacy and security requirements for health data',
      'How electronic health records systems work',
      'Healthcare interoperability standards (HL7, FHIR)',
      'IT service management best practices',
      'How technology enables public health initiatives'
    ],
    skillsYoullGain: [
      'Healthcare IT', 'HIPAA Compliance', 'EHR Systems', 'IT Support',
      'Technical Documentation', 'Troubleshooting', 'HL7/FHIR', 'User Training'
    ],
    projectExamples: [
      'Help test new features for the state immunization registry system',
      'Create user guides for clinic staff using telehealth platforms',
      'Assist with data quality audits of public health databases',
      'Support migration of legacy applications to cloud infrastructure'
    ],
    benefits: [
      'Competitive $1,600 monthly stipend',
      'State-of-the-art healthcare IT environment',
      'Free parking at the Austin campus',
      'Healthcare IT certification exam voucher (CompTIA Healthcare IT+)',
      'Exposure to enterprise healthcare systems',
      'Strong pathway to permanent positions'
    ],
    workSchedule: 'Full-time (40 hrs/week), Mon-Fri 8AM-5PM with occasional on-call',
    teamSize: '15-person IT support team within larger technology division',
    applicationDeadline: 'February 15, 2026',
    mentorship: 'Assigned IT mentor + shadowing opportunities with system administrators',
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
    description: 'Research affordable housing policies and help develop innovative solutions to America\'s housing challenges. This remote position offers flexible hours perfect for students, with the opportunity to contribute to research that shapes federal housing programs benefiting millions of families.',
    responsibilities: [
      'Research housing policies, regulations, and best practices from across the country',
      'Analyze quantitative data on housing trends, affordability metrics, and program outcomes',
      'Write clear research summaries, policy briefs, and literature reviews',
      'Attend virtual policy meetings, webinars, and stakeholder sessions',
      'Support policy development projects with evidence-based recommendations',
      'Track housing legislation and regulatory changes at federal and state levels',
      'Create presentation materials for senior policy makers'
    ],
    requirements: [
      'Strong interest in housing policy, urban planning, or community development',
      'Excellent research and academic writing skills',
      'Ability to synthesize information from multiple sources and perspectives',
      'Self-motivated with strong organizational and time management skills',
      'No prior professional experience necessary – we value diverse perspectives!',
      'Bonus: Coursework in public policy, economics, urban studies, or related fields'
    ],
    keywords: [
      'policy analysis', 'research', 'urban planning', 'housing', 'government',
      'public policy', 'writing', 'literature review', 'data collection', 'stakeholder analysis',
      'report writing', 'legislation', 'regulatory affairs', 'community development', 'zoning'
    ],
    aboutCompany: 'The Department of Housing and Urban Development (HUD) is the federal agency responsible for national policy and programs addressing housing needs, fair housing enforcement, and community development. Our Office of Policy Development and Research (PD&R) conducts research to inform evidence-based policy making affecting over 4 million households receiving HUD assistance.',
    whatYoullLearn: [
      'Federal policy research methodologies and standards',
      'Housing policy landscape including key programs (Section 8, LIHTC, CDBG)',
      'How research translates into actionable policy recommendations',
      'Stakeholder engagement in policy development',
      'Data analysis for policy evaluation',
      'Professional writing for government audiences'
    ],
    skillsYoullGain: [
      'Policy Research', 'Policy Writing', 'Literature Review', 'Data Analysis',
      'Stakeholder Analysis', 'Regulatory Research', 'Presentation Skills', 'Government Writing'
    ],
    projectExamples: [
      'Research successful models for converting office buildings to affordable housing',
      'Analyze effectiveness of tenant protection policies in different states',
      'Create policy brief on zoning reform approaches for housing production',
      'Compile best practices for community land trusts and shared equity homeownership'
    ],
    benefits: [
      'Monthly stipend of $1,300',
      'Fully remote with flexible scheduling for students',
      'Virtual networking with housing policy experts nationally',
      'Research credit available for qualifying academic programs',
      'Potential publication opportunities in HUD research journals',
      'Strong letters of recommendation from senior researchers'
    ],
    workSchedule: 'Part-time (20-30 hrs/week), completely flexible hours',
    teamSize: '8-person research team with diverse policy expertise',
    applicationDeadline: 'March 10, 2026',
    mentorship: 'Weekly 1-on-1 with Senior Policy Analyst + access to research seminar series',
    applyUrl: '#'
  }
];
