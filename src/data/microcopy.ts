export type CopyVariant = 'default' | 'simple';

interface Microcopy {
  default: string;
  simple: string;
}

export const microcopy: Record<string, Microcopy> = {
  // Homepage
  heroTitle: {
    default: 'Find Your Perfect Government Internship',
    simple: 'Find Internships That Match You'
  },
  heroSubtitle: {
    default: 'Discover opportunities in public service tailored to your skills and interests',
    simple: 'Get internships that fit your skills'
  },
  quickProfileCTA: {
    default: 'Quick Profile — Just 3 Steps',
    simple: 'Start — Only 3 Steps'
  },
  guestMode: {
    default: 'Continue as Guest',
    simple: 'Browse Without Signing Up'
  },

  // Onboarding
  onboardingTitle: {
    default: 'Quick Profile Setup',
    simple: 'Tell Us About You'
  },
  onboardingSubtitle: {
    default: 'Just 3 quick steps to find your perfect match',
    simple: '3 steps to find good matches'
  },
  educationPrompt: {
    default: 'What\'s your current education level?',
    simple: 'What school level are you at?'
  },
  skillsPrompt: {
    default: 'Add up to 5 skills (type or use voice)',
    simple: 'Tell us 5 things you can do'
  },
  interestsPrompt: {
    default: 'What sectors interest you?',
    simple: 'What do you want to work in?'
  },

  // Card Reasons
  skillMatch: {
    default: 'Matches {count}/5 skills',
    simple: 'You know {count} of 5 things needed'
  },
  locationMatch: {
    default: '{distance} away',
    simple: '{distance} from you'
  },
  interestMatch: {
    default: 'Matches your interests',
    simple: 'You said you like this'
  },
  beginnerFriendly: {
    default: 'Beginner Friendly',
    simple: 'OK for First-Timers'
  },

  // Recommendations
  foundMatches: {
    default: 'We found {count} matches — why these?',
    simple: 'We found {count} for you'
  },
  explainButton: {
    default: 'Explain These Matches',
    simple: 'Why These?'
  },
  noMatchesFound: {
    default: 'No matches found. Try adjusting your preferences.',
    simple: 'Nothing found. Try different skills or location.'
  },

  // Apply Flow
  applyButton: {
    default: 'Apply Now',
    simple: 'Apply'
  },
  saveButton: {
    default: 'Save for Later',
    simple: 'Save'
  },
  savedConfirmation: {
    default: 'Internship saved successfully!',
    simple: 'Saved!'
  },

  // Help & Tutorial
  helpTitle: {
    default: 'How to Use VibeMatch',
    simple: 'How This Works'
  },
  tutorialStep1: {
    default: 'Tell us about your skills and what you want to learn',
    simple: 'Say what you know and want to learn'
  },
  tutorialStep2: {
    default: 'We\'ll show you internships that match your profile',
    simple: 'We show you good matches'
  },
  tutorialStep3: {
    default: 'Apply directly and track your applications',
    simple: 'Click to apply and see your saved ones'
  },

  // Admin
  adminDashboard: {
    default: 'Admin Dashboard',
    simple: 'Control Panel'
  },
  uploadCSV: {
    default: 'Upload Internship CSV',
    simple: 'Add Internships (CSV File)'
  },
  tuneWeights: {
    default: 'Tune Recommendation Weights',
    simple: 'Change How We Match'
  },
  skillWeight: {
    default: 'How much should skills matter in matching?',
    simple: 'How important are skills?'
  },
  locationWeight: {
    default: 'How much should location matter in matching?',
    simple: 'How important is location?'
  },
  interestWeight: {
    default: 'How much should interests matter in matching?',
    simple: 'How important are interests?'
  },

  // Accessibility
  closeDialog: {
    default: 'Close dialog',
    simple: 'Close'
  },
  nextStep: {
    default: 'Continue to next step',
    simple: 'Next'
  },
  previousStep: {
    default: 'Go back to previous step',
    simple: 'Back'
  },
  skipStep: {
    default: 'Skip for now',
    simple: 'Skip'
  },

  // Feedback
  feedbackPrompt: {
    default: 'Was this recommendation helpful?',
    simple: 'Was this good?'
  },
  feedbackThanks: {
    default: 'Thanks for your feedback!',
    simple: 'Thanks!'
  }
};

export function getCopy(key: string, variant: CopyVariant = 'default', replacements?: Record<string, string | number>): string {
  const copy = microcopy[key]?.[variant] || microcopy[key]?.default || key;
  
  if (!replacements) {
    return copy;
  }

  return Object.entries(replacements).reduce((text, [placeholder, value]) => {
    return text.replace(`{${placeholder}}`, String(value));
  }, copy);
}
