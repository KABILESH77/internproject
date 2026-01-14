import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, GraduationCap, Code, Briefcase, MapPin, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { VoiceInputButton } from './VoiceInputButton';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  education: string;
  skills: string[];
  interests: string[];
  location: string;
}

const educationLevels = [
  { value: 'high-school', label: 'High School', icon: '🎓' },
  { value: 'undergraduate', label: 'College/University', icon: '📚' },
  { value: 'graduate', label: 'Graduate Studies', icon: '🎯' },
  { value: 'bootcamp', label: 'Bootcamp/Self-taught', icon: '💻' },
];

const suggestedSkills = [
  'Python', 'JavaScript', 'React', 'Data Analysis', 'Marketing',
  'Design', 'Writing', 'Excel', 'Communication', 'Research',
  'Java', 'SQL', 'HTML/CSS', 'Project Management', 'Social Media'
];

const interestSectors = [
  { value: 'tech', label: 'Technology', icon: '💻' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'finance', label: 'Finance', icon: '💰' },
  { value: 'nonprofit', label: 'Non-Profit', icon: '🤝' },
  { value: 'government', label: 'Government', icon: '🏛️' },
  { value: 'media', label: 'Media & Arts', icon: '🎨' },
  { value: 'environment', label: 'Environment', icon: '🌱' },
];

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({ education, skills, interests, location });
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    onComplete({ education, skills, interests, location });
    onClose();
  };

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill) && skills.length < 5) {
      setSkills([...skills, skill]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const detectLocation = () => {
    setIsDetectingLocation(true);
    // Simulate location detection
    setTimeout(() => {
      setLocation('San Francisco, CA');
      setIsDetectingLocation(false);
    }, 1500);
  };

  const handleVoiceTranscript = (transcript: string) => {
    const newSkills = transcript.split(' ').filter(s => s.length > 0);
    const uniqueSkills = [...new Set([...skills, ...newSkills])].slice(0, 5);
    setSkills(uniqueSkills);
  };

  if (!isOpen) return null;

  const canProceed = () => {
    if (step === 1) return education !== '';
    if (step === 2) return skills.length > 0;
    if (step === 3) return interests.length > 0;
    return true;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)] text-white p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 id="onboarding-title" className="text-2xl text-white mb-2">Quick Profile Setup</h2>
                <p className="text-[var(--color-primary-100)] text-base">Just 3 quick steps to find your perfect match</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close setup"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    s <= step ? 'bg-white' : 'bg-white/30'
                  }`}
                  role="progressbar"
                  aria-valuenow={step}
                  aria-valuemin={1}
                  aria-valuemax={3}
                  aria-label={`Step ${s} of 3`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {/* Step 1: Education */}
            {step === 1 && (
              <div className="space-y-6" role="group" aria-labelledby="step1-title">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="w-8 h-8 text-[var(--color-primary-600)]" aria-hidden="true" />
                  <div>
                    <h3 id="step1-title" className="text-xl font-semibold">Your Education</h3>
                    <p className="text-[var(--color-neutral-600)]">What's your current education level?</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {educationLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setEducation(level.value)}
                      className={`
                        p-4 rounded-xl border-2 text-left transition-all min-h-[72px]
                        flex items-center gap-4
                        ${education === level.value
                          ? 'border-[var(--color-primary-600)] bg-[var(--color-primary-50)]'
                          : 'border-[var(--color-neutral-300)] hover:border-[var(--color-primary-400)]'
                        }
                        focus:outline-none focus:ring-3 focus:ring-[var(--color-primary-500)]
                      `}
                      role="radio"
                      aria-checked={education === level.value}
                    >
                      <span className="text-3xl" aria-hidden="true">{level.icon}</span>
                      <span className="font-medium text-lg">{level.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
              <div className="space-y-6" role="group" aria-labelledby="step2-title">
                <div className="flex items-center gap-3 mb-6">
                  <Code className="w-8 h-8 text-[var(--color-primary-600)]" aria-hidden="true" />
                  <div>
                    <h3 id="step2-title" className="text-xl font-semibold">Your Skills</h3>
                    <p className="text-[var(--color-neutral-600)]">Add up to 5 skills (type or use voice)</p>
                  </div>
                </div>

                {/* Skill Input */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill(skillInput);
                        }
                      }}
                      placeholder="Type a skill..."
                      disabled={skills.length >= 5}
                      className="w-full px-4 py-3 min-h-[48px] rounded-lg border-2 border-[var(--color-neutral-300)] focus:outline-none focus:ring-3 focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)] disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Skill input"
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => addSkill(skillInput)}
                    disabled={!skillInput || skills.length >= 5}
                  >
                    Add
                  </Button>
                  <VoiceInputButton onTranscript={handleVoiceTranscript} />
                </div>

                {/* Selected Skills */}
                {skills.length > 0 && (
                  <div>
                    <p className="text-sm text-[var(--color-neutral-600)] mb-2">
                      Your skills ({skills.length}/5):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-800)] font-medium"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="hover:bg-[var(--color-primary-200)] rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                            aria-label={`Remove ${skill}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Skills */}
                {skills.length < 5 && (
                  <div>
                    <p className="text-sm text-[var(--color-neutral-600)] mb-2">
                      Or pick from popular skills:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedSkills
                        .filter(s => !skills.includes(s))
                        .slice(0, 10)
                        .map((skill) => (
                          <button
                            key={skill}
                            onClick={() => addSkill(skill)}
                            className="px-3 py-2 rounded-lg border-2 border-[var(--color-neutral-300)] hover:border-[var(--color-primary-500)] hover:bg-[var(--color-primary-50)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] transition-colors"
                          >
                            {skill}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Interests & Location */}
            {step === 3 && (
              <div className="space-y-6" role="group" aria-labelledby="step3-title">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-8 h-8 text-[var(--color-primary-600)]" aria-hidden="true" />
                  <div>
                    <h3 id="step3-title" className="text-xl font-semibold">Your Interests & Location</h3>
                    <p className="text-[var(--color-neutral-600)]">What sectors interest you?</p>
                  </div>
                </div>

                {/* Interest Sectors */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {interestSectors.map((sector) => (
                    <button
                      key={sector.value}
                      onClick={() => toggleInterest(sector.value)}
                      className={`
                        p-4 rounded-xl border-2 text-left transition-all min-h-[68px]
                        flex items-center gap-3
                        ${interests.includes(sector.value)
                          ? 'border-[var(--color-primary-600)] bg-[var(--color-primary-50)]'
                          : 'border-[var(--color-neutral-300)] hover:border-[var(--color-primary-400)]'
                        }
                        focus:outline-none focus:ring-3 focus:ring-[var(--color-primary-500)]
                      `}
                      role="checkbox"
                      aria-checked={interests.includes(sector.value)}
                    >
                      <span className="text-2xl" aria-hidden="true">{sector.icon}</span>
                      <span className="font-medium">{sector.label}</span>
                    </button>
                  ))}
                </div>

                {/* Location */}
                <div className="mt-8">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-[var(--color-primary-600)]" aria-hidden="true" />
                    <label htmlFor="location-input" className="font-medium">Your Location</label>
                  </div>
                  <div className="flex gap-2">
                    <input
                      id="location-input"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter city or zip code"
                      className="flex-1 px-4 py-3 min-h-[48px] rounded-lg border-2 border-[var(--color-neutral-300)] focus:outline-none focus:ring-3 focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)]"
                      aria-label="Location input"
                    />
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={detectLocation}
                      disabled={isDetectingLocation}
                      leftIcon={isDetectingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                    >
                      Auto-detect
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-[var(--color-neutral-200)] p-6 flex items-center justify-between gap-4">
            <button
              onClick={handleSkip}
              className="text-[var(--color-neutral-600)] hover:text-[var(--color-neutral-900)] font-medium focus:outline-none focus:underline"
            >
              Skip for now
            </button>

            <div className="flex gap-3">
              {step > 1 && (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleBack}
                  leftIcon={<ChevronLeft className="w-5 h-5" />}
                >
                  Back
                </Button>
              )}
              <Button
                variant="accent"
                size="md"
                onClick={handleNext}
                disabled={!canProceed()}
                rightIcon={step < 3 ? <ChevronRight className="w-5 h-5" /> : undefined}
              >
                {step < 3 ? 'Next' : 'Find Matches'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
