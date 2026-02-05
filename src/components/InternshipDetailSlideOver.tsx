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
        <div style={{ position: 'sticky', top: 0, backgroundColor: 'white', borderBottom: '2px solid #e5e5e5', padding: '24px', zIndex: 10 }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 id="detail-title" style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#1f2937' }}>{internship.title}</h2>
              <p style={{ fontSize: '18px', color: '#4b5563' }}>{internship.organization}</p>
            </div>
            <button
              onClick={onClose}
              style={{ flexShrink: 0, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
              aria-label="Close details panel"
            >
              <X style={{ width: '24px', height: '24px', color: '#6b7280' }} aria-hidden="true" />
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
            <div className="flex items-center gap-3" style={{ color: '#4b5563' }}>
              <MapPin style={{ width: '20px', height: '20px', color: '#0d9494' }} aria-hidden="true" />
              <span style={{ fontSize: '18px' }}>{internship.location}</span>
              {internship.distance && (
                <span style={{ color: '#6b7280' }}>• {internship.distance}</span>
              )}
            </div>
            {internship.duration && (
              <div className="flex items-center gap-3" style={{ color: '#4b5563' }}>
                <Clock style={{ width: '20px', height: '20px', color: '#0d9494' }} aria-hidden="true" />
                <span style={{ fontSize: '18px' }}>{internship.duration}</span>
              </div>
            )}
          </div>

          {/* Match Reasons */}
          <div style={{ backgroundColor: '#e6f7f7', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>Why this matches you:</h3>
            <ul className="space-y-2" style={{ color: '#1f2937' }}>
              {internship.reasons.skillMatch && (
                <li className="flex items-start gap-2">
                  <span style={{ color: '#0d9494', marginTop: '4px' }}>✓</span>
                  <span>Matches {internship.reasons.skillMatch} out of 5 of your skills</span>
                </li>
              )}
              {internship.reasons.distance && (
                <li className="flex items-start gap-2">
                  <span style={{ color: '#0d9494', marginTop: '4px' }}>✓</span>
                  <span>Located {internship.reasons.distance}</span>
                </li>
              )}
              {internship.reasons.interest && (
                <li className="flex items-start gap-2">
                  <span style={{ color: '#0d9494', marginTop: '4px' }}>✓</span>
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
              <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>About this internship</h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                {internship.description}
              </p>
            </div>
          )}

          {/* Responsibilities */}
          {internship.responsibilities && internship.responsibilities.length > 0 && (
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>What you'll do</h3>
              <ul className="space-y-2">
                {internship.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#b3e6e6', color: '#075959', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '500' }}>
                      {index + 1}
                    </span>
                    <span style={{ color: '#4b5563', paddingTop: '2px' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {internship.requirements && internship.requirements.length > 0 && (
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>What we're looking for</h3>
              <ul className="space-y-2">
                {internship.requirements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span style={{ color: '#0d9494', marginTop: '4px' }}>•</span>
                    <span style={{ color: '#4b5563' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* About the Company */}
          {internship.aboutCompany && (
            <div style={{ backgroundColor: '#fafafa', borderRadius: '12px', padding: '16px' }}>
              <h3 className="flex items-center gap-2" style={{ fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                <Building2 style={{ width: '20px', height: '20px', color: '#0d9494' }} />
                About {internship.organization}
              </h3>
              <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
                {internship.aboutCompany}
              </p>
            </div>
          )}

          {/* What You'll Learn */}
          {internship.whatYoullLearn && internship.whatYoullLearn.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2" style={{ fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                <GraduationCap style={{ width: '20px', height: '20px', color: '#0d9494' }} />
                What You'll Learn
              </h3>
              <ul className="space-y-2">
                {internship.whatYoullLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span style={{ color: '#22c55e', marginTop: '4px' }}>✓</span>
                    <span style={{ color: '#4b5563' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills You'll Gain */}
          {internship.skillsYoullGain && internship.skillsYoullGain.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2" style={{ fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                <Star style={{ width: '20px', height: '20px', color: '#0d9494' }} />
                Skills You'll Gain
              </h3>
              <div className="flex flex-wrap gap-2">
                {internship.skillsYoullGain.map((skill, index) => (
                  <span
                    key={index}
                    style={{ padding: '4px 12px', backgroundColor: '#b3e6e6', color: '#043b3b', borderRadius: '9999px', fontSize: '14px', fontWeight: '500' }}
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
              <h3 className="flex items-center gap-2" style={{ fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                <Briefcase style={{ width: '20px', height: '20px', color: '#0d9494' }} />
                Example Projects
              </h3>
              <ul className="space-y-2">
                {internship.projectExamples.map((project, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span style={{ color: '#0d9494', marginTop: '4px' }}>→</span>
                    <span style={{ color: '#4b5563' }}>{project}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {internship.benefits && internship.benefits.length > 0 && (
            <div style={{ background: 'linear-gradient(to right, #f0fdf4, #ecfdf5)', borderRadius: '12px', padding: '16px' }}>
              <h3 className="flex items-center gap-2" style={{ fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>
                <Gift style={{ width: '20px', height: '20px', color: '#22c55e' }} />
                Benefits & Perks
              </h3>
              <ul className="space-y-2">
                {internship.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span style={{ color: '#22c55e', marginTop: '4px' }}>★</span>
                    <span style={{ color: '#4b5563' }}>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Additional Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {internship.workSchedule && (
              <div style={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '12px' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Clock style={{ width: '16px', height: '16px', color: '#0d9494' }} />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Work Schedule</span>
                </div>
                <p style={{ color: '#1f2937' }}>{internship.workSchedule}</p>
              </div>
            )}
            {internship.teamSize && (
              <div style={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '12px' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Users style={{ width: '16px', height: '16px', color: '#0d9494' }} />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Team Size</span>
                </div>
                <p style={{ color: '#1f2937' }}>{internship.teamSize}</p>
              </div>
            )}
            {internship.applicationDeadline && (
              <div style={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '12px' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar style={{ width: '16px', height: '16px', color: '#0d9494' }} />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Application Deadline</span>
                </div>
                <p style={{ color: '#1f2937' }}>{internship.applicationDeadline}</p>
              </div>
            )}
            {internship.mentorship && (
              <div style={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '12px' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb style={{ width: '16px', height: '16px', color: '#0d9494' }} />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280' }}>Mentorship</span>
                </div>
                <p style={{ color: '#1f2937' }}>{internship.mentorship}</p>
              </div>
            )}
          </div>

          {/* Keywords/Skills Tags */}
          {internship.keywords && internship.keywords.length > 0 && (
            <div>
              <h3 style={{ fontWeight: '600', marginBottom: '12px', color: '#1f2937' }}>Related Skills & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {internship.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    style={{ padding: '4px 8px', backgroundColor: '#f5f5f5', color: '#4b5563', borderRadius: '4px', fontSize: '14px' }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ position: 'sticky', bottom: 0, backgroundColor: 'white', borderTop: '2px solid #e5e5e5', padding: '24px' }}>
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
