import React, { useEffect } from 'react';
import { X, MapPin, Clock, ExternalLink, Bookmark, Award, Building2, GraduationCap, Gift, Calendar, Users, Lightbulb, Briefcase, Star, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Internship } from './InternshipCard';

export interface SkillMatchInfo {
  matchedSkills: string[];
  missingSkills: string[];
  overallScore: number;
  skillScore: number;
  experienceScore: number;
  keywordScore: number;
}

interface InternshipDetailSlideOverProps {
  internship: Internship | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: (id: string) => void;
  onSave?: (id: string) => void;
  isSaved?: boolean;
  matchInfo?: SkillMatchInfo | null;
}

export function InternshipDetailSlideOver({
  internship,
  isOpen,
  onClose,
  onApply,
  onSave,
  isSaved = false,
  matchInfo = null
}: InternshipDetailSlideOverProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!internship) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Slide Over Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[700px] bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          overflow-y-auto
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-[var(--color-neutral-200)] p-6 z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 id="detail-title" className="text-2xl mb-2">{internship.title}</h2>
              <p className="text-lg text-[var(--color-neutral-700)]">{internship.organization}</p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-[var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              aria-label="Close details panel"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {internship.isBeginner && (
              <Badge variant="beginner">
                <Award className="w-3 h-3" /> Beginner Friendly
              </Badge>
            )}
            {internship.isRemote && <Badge variant="remote">Remote</Badge>}
            {internship.stipend && <Badge variant="stipend">{internship.stipend}</Badge>}
            {internship.isVerified && <Badge variant="verified">Verified</Badge>}
          </div>

          {/* Location & Duration */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-[var(--color-neutral-700)]">
              <MapPin className="w-5 h-5 text-[var(--color-primary-600)]" aria-hidden="true" />
              <span className="text-lg">{internship.location}</span>
              {internship.distance && (
                <span className="text-[var(--color-neutral-600)]">• {internship.distance}</span>
              )}
            </div>
            {internship.duration && (
              <div className="flex items-center gap-3 text-[var(--color-neutral-700)]">
                <Clock className="w-5 h-5 text-[var(--color-primary-600)]" aria-hidden="true" />
                <span className="text-lg">{internship.duration}</span>
              </div>
            )}
          </div>

          {/* Match Reasons */}
          <div className="bg-[var(--color-primary-50)] rounded-xl p-4">
            <h3 className="font-semibold mb-3">Why this matches you:</h3>
            <ul className="space-y-2 text-[var(--color-neutral-800)]">
              {internship.reasons.skillMatch && (
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-primary-600)] mt-1">✓</span>
                  <span>Matches {internship.reasons.skillMatch} out of 5 of your skills</span>
                </li>
              )}
              {internship.reasons.distance && (
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-primary-600)] mt-1">✓</span>
                  <span>Located {internship.reasons.distance}</span>
                </li>
              )}
              {internship.reasons.interest && (
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-primary-600)] mt-1">✓</span>
                  <span>Matches your career interests</span>
                </li>
              )}
            </ul>
          </div>

          {/* ML Match Score Section */}
          {matchInfo && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-200">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-purple-800">
                <Star className="w-5 h-5 text-purple-600" />
                AI Match Analysis ({matchInfo.overallScore}% Match)
              </h3>
              
              {/* Score Breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-xl font-bold text-purple-600">{matchInfo.skillScore}%</div>
                  <div className="text-xs text-gray-600">Skills</div>
                </div>
                <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-xl font-bold text-blue-600">{matchInfo.experienceScore}%</div>
                  <div className="text-xs text-gray-600">Experience</div>
                </div>
                <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                  <div className="text-xl font-bold text-teal-600">{matchInfo.keywordScore}%</div>
                  <div className="text-xs text-gray-600">Keywords</div>
                </div>
              </div>
              
              {/* Matched Skills */}
              {matchInfo.matchedSkills.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-700 flex items-center gap-1 mb-2">
                    <CheckCircle className="w-4 h-4" /> Skills You Have ({matchInfo.matchedSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchInfo.matchedSkills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-300"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Missing Skills */}
              {matchInfo.missingSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-orange-700 flex items-center gap-1 mb-2">
                    <AlertCircle className="w-4 h-4" /> Skills to Develop ({matchInfo.missingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchInfo.missingSkills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium border border-orange-300"
                      >
                        ○ {skill}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-orange-600 mt-2 italic">
                    💡 These are great skills to learn for this role!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {internship.description && (
            <div>
              <h3 className="font-semibold mb-3">About this internship</h3>
              <p className="text-[var(--color-neutral-700)] leading-relaxed">
                {internship.description}
              </p>
            </div>
          )}

          {/* Responsibilities */}
          {internship.responsibilities && internship.responsibilities.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">What you'll do</h3>
              <ul className="space-y-2">
                {internship.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)] flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-[var(--color-neutral-700)] pt-0.5">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {internship.requirements && internship.requirements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">What we're looking for</h3>
              <ul className="space-y-2">
                {internship.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[var(--color-primary-600)] mt-1">•</span>
                    <span className="text-[var(--color-neutral-700)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* About the Company */}
          {internship.aboutCompany && (
            <div className="bg-[var(--color-neutral-50)] rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[var(--color-primary-600)]" />
                About {internship.organization}
              </h3>
              <p className="text-[var(--color-neutral-700)] leading-relaxed">
                {internship.aboutCompany}
              </p>
            </div>
          )}

          {/* What You'll Learn */}
          {internship.whatYoullLearn && internship.whatYoullLearn.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[var(--color-primary-600)]" />
                What You'll Learn
              </h3>
              <ul className="space-y-2">
                {internship.whatYoullLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-[var(--color-neutral-700)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills You'll Gain */}
          {internship.skillsYoullGain && internship.skillsYoullGain.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-[var(--color-primary-600)]" />
                Skills You'll Gain
              </h3>
              <div className="flex flex-wrap gap-2">
                {internship.skillsYoullGain.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[var(--color-primary-100)] text-[var(--color-primary-800)] rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Project Examples */}
          {internship.projectExamples && internship.projectExamples.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[var(--color-primary-600)]" />
                Example Projects
              </h3>
              <ul className="space-y-2">
                {internship.projectExamples.map((project, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-[var(--color-primary-600)] mt-1">→</span>
                    <span className="text-[var(--color-neutral-700)]">{project}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {internship.benefits && internship.benefits.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Gift className="w-5 h-5 text-green-600" />
                Benefits & Perks
              </h3>
              <ul className="space-y-2">
                {internship.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">★</span>
                    <span className="text-[var(--color-neutral-700)]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {internship.workSchedule && (
              <div className="bg-[var(--color-neutral-50)] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-[var(--color-primary-600)]" />
                  <span className="text-sm font-medium text-[var(--color-neutral-600)]">Work Schedule</span>
                </div>
                <p className="text-[var(--color-neutral-800)]">{internship.workSchedule}</p>
              </div>
            )}
            {internship.teamSize && (
              <div className="bg-[var(--color-neutral-50)] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-[var(--color-primary-600)]" />
                  <span className="text-sm font-medium text-[var(--color-neutral-600)]">Team Size</span>
                </div>
                <p className="text-[var(--color-neutral-800)]">{internship.teamSize}</p>
              </div>
            )}
            {internship.applicationDeadline && (
              <div className="bg-[var(--color-neutral-50)] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-[var(--color-primary-600)]" />
                  <span className="text-sm font-medium text-[var(--color-neutral-600)]">Application Deadline</span>
                </div>
                <p className="text-[var(--color-neutral-800)]">{internship.applicationDeadline}</p>
              </div>
            )}
            {internship.mentorship && (
              <div className="bg-[var(--color-neutral-50)] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="w-4 h-4 text-[var(--color-primary-600)]" />
                  <span className="text-sm font-medium text-[var(--color-neutral-600)]">Mentorship</span>
                </div>
                <p className="text-[var(--color-neutral-800)]">{internship.mentorship}</p>
              </div>
            )}
          </div>

          {/* Keywords/Skills Tags */}
          {internship.keywords && internship.keywords.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Related Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {internship.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] rounded text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t-2 border-[var(--color-neutral-200)] p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="accent"
              size="lg"
              fullWidth
              onClick={() => onApply?.(internship.id)}
              rightIcon={<ExternalLink className="w-5 h-5" />}
            >
              Apply Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onSave?.(internship.id)}
              leftIcon={<Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />}
              aria-label={isSaved ? 'Unsave internship' : 'Save internship'}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
