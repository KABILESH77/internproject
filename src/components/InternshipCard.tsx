import React from 'react';
import { MapPin, Clock, Bookmark, ExternalLink, TrendingUp, Target, Award } from 'lucide-react';
import { Badge, ReasonTag } from './Badge';
import { Button } from './Button';
import { TextToSpeechButton } from './TextToSpeechButton';

export interface Internship {
  id: string;
  title: string;
  organization: string;
  location: string;
  isRemote: boolean;
  stipend?: string;
  isBeginner: boolean;
  isVerified: boolean;
  distance?: string;
  duration?: string;
  postedDate?: string;
  reasons: {
    skillMatch?: number;
    distance?: string;
    interest?: boolean;
  };
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  keywords?: string[];
  applyUrl?: string;
  // New detailed fields
  aboutCompany?: string;
  whatYoullLearn?: string[];
  benefits?: string[];
  applicationDeadline?: string;
  workSchedule?: string;
  teamSize?: string;
  mentorship?: string;
  projectExamples?: string[];
  skillsYoullGain?: string[];
}

interface InternshipCardProps {
  internship: Internship;
  variant?: 'default' | 'compact' | 'hero';
  onSave?: (id: string) => void;
  onApply?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  isSaved?: boolean;
}

// Helper function to generate readable text for TTS
function generateTTSText(internship: Internship): string {
  const parts = [
    `${internship.title} at ${internship.organization}.`,
    internship.location && `Located in ${internship.location}.`,
    internship.isRemote && 'This is a remote position.',
    internship.isBeginner && 'This internship is beginner friendly.',
    internship.stipend && `The stipend is ${internship.stipend}.`,
    internship.duration && `Duration is ${internship.duration}.`,
    internship.description && internship.description,
  ];
  
  return parts.filter(Boolean).join(' ');
}

export function InternshipCard({ 
  internship, 
  variant = 'default',
  onSave,
  onApply,
  onViewDetails,
  isSaved = false
}: InternshipCardProps) {
  const {
    id,
    title,
    organization,
    location,
    isRemote,
    stipend,
    isBeginner,
    isVerified,
    distance,
    duration,
    reasons
  } = internship;

  // Hero variant - Large, prominent card
  if (variant === 'hero') {
    const ttsText = generateTTSText(internship);
    
    return (
      <article 
        style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '2px solid #b3e6e6', padding: '32px' }}
        aria-label={`${title} at ${organization}`}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>{title}</h2>
              <TextToSpeechButton 
                text={ttsText} 
                size="md" 
                variant="icon"
                className="flex-shrink-0"
              />
            </div>
            <p style={{ fontSize: '20px', color: '#4b5563', marginBottom: '16px' }}>{organization}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {isBeginner && <Badge variant="beginner">Beginner Friendly</Badge>}
              {isRemote && <Badge variant="remote">Remote</Badge>}
              {stipend && <Badge variant="stipend">{stipend}</Badge>}
              {isVerified && <Badge variant="verified">Verified</Badge>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6" style={{ color: '#4b5563' }}>
          <div className="flex items-center gap-2">
            <MapPin style={{ width: '20px', height: '20px', color: '#0d9494' }} aria-hidden="true" />
            <span>{location} {distance && `• ${distance}`}</span>
          </div>
          {duration && (
            <div className="flex items-center gap-2">
              <Clock style={{ width: '20px', height: '20px', color: '#0d9494' }} aria-hidden="true" />
              <span>{duration}</span>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: '#e6f7f7', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>Why this matches you:</h3>
          <div className="flex flex-wrap gap-2">
            {reasons.skillMatch && (
              <ReasonTag icon={<Target className="w-4 h-4" />}>
                Matches {reasons.skillMatch}/5 skills
              </ReasonTag>
            )}
            {reasons.distance && (
              <ReasonTag icon={<MapPin className="w-4 h-4" />}>
                {reasons.distance}
              </ReasonTag>
            )}
            {reasons.interest && (
              <ReasonTag icon={<TrendingUp className="w-4 h-4" />}>
                Matches your interests
              </ReasonTag>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="accent" 
            size="lg" 
            fullWidth
            onClick={() => onApply?.(id)}
            rightIcon={<ExternalLink className="w-5 h-5" />}
          >
            Apply Now
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => onSave?.(id)}
            leftIcon={<Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />}
            aria-label={isSaved ? 'Unsave internship' : 'Save internship'}
          >
            {isSaved ? 'Saved' : 'Save'}
          </Button>
        </div>
      </article>
    );
  }

  // Compact variant - Mobile optimized
  if (variant === 'compact') {
    const ttsText = generateTTSText(internship);
    
    return (
      <article 
        style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e5e5e5', padding: '16px' }}
        aria-label={`${title} at ${organization}`}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h3>
            <p style={{ fontSize: '14px', color: '#4b5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{organization}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <TextToSpeechButton 
              text={ttsText} 
              size="sm" 
              variant="icon"
            />
            <button
              onClick={() => onSave?.(id)}
              style={{ flexShrink: 0, padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}
              aria-label={isSaved ? 'Unsave internship' : 'Save internship'}
            >
              <Bookmark style={{ width: '20px', height: '20px', color: isSaved ? '#ff9500' : '#737373', fill: isSaved ? '#ff9500' : 'none' }} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {isBeginner && <Badge variant="beginner">Beginner</Badge>}
          {isRemote && <Badge variant="remote">Remote</Badge>}
          {stipend && <Badge variant="stipend">{stipend}</Badge>}
        </div>

        <div className="flex items-center gap-2 mb-3" style={{ fontSize: '14px', color: '#4b5563' }}>
          <MapPin style={{ width: '16px', height: '16px' }} aria-hidden="true" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{location}</span>
          {distance && <span style={{ color: '#737373' }}>• {distance}</span>}
        </div>

        {reasons.skillMatch && (
          <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>
            <Target style={{ width: '16px', height: '16px', display: 'inline', marginRight: '4px' }} aria-hidden="true" />
            Matches {reasons.skillMatch}/5 skills
            {reasons.interest && ' • Matches your interests'}
          </p>
        )}

        <div className="flex gap-2">
          <Button variant="accent" size="sm" fullWidth onClick={() => onApply?.(id)}>
            Apply
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(id)}>
            Details
          </Button>
        </div>
      </article>
    );
  }

  // Default variant - Standard list card
  const ttsText = generateTTSText(internship);
  
  return (
    <article 
      style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: '1px solid #e5e5e5', padding: '24px' }}
      aria-label={`${title} at ${organization}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px', color: '#1f2937' }}>{title}</h3>
              <p style={{ fontSize: '18px', color: '#4b5563' }}>{organization}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <TextToSpeechButton 
                text={ttsText} 
                size="md" 
                variant="icon"
              />
              <button
                onClick={() => onSave?.(id)}
                style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                aria-label={isSaved ? 'Unsave internship' : 'Save internship'}
              >
                <Bookmark style={{ width: '24px', height: '24px', color: isSaved ? '#ff9500' : '#737373', fill: isSaved ? '#ff9500' : 'none' }} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {isBeginner && <Badge variant="beginner"><Award className="w-3 h-3" /> Beginner Friendly</Badge>}
            {isRemote && <Badge variant="remote">Remote</Badge>}
            {stipend && <Badge variant="stipend">{stipend}</Badge>}
            {isVerified && <Badge variant="verified">Verified</Badge>}
          </div>

          <div className="flex flex-wrap gap-4 mb-4" style={{ color: '#4b5563' }}>
            <div className="flex items-center gap-2">
              <MapPin style={{ width: '20px', height: '20px', color: '#0d9494' }} aria-hidden="true" />
              <span>{location}</span>
            </div>
            {distance && (
              <span style={{ color: '#737373' }}>• {distance}</span>
            )}
            {duration && (
              <div className="flex items-center gap-2">
                <Clock style={{ width: '20px', height: '20px', color: '#0d9494' }} aria-hidden="true" />
                <span>{duration}</span>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: '#fafafa', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
            <div className="flex flex-wrap gap-2">
              {reasons.skillMatch && (
                <ReasonTag icon={<Target className="w-4 h-4" />}>
                  Matches {reasons.skillMatch}/5 skills
                </ReasonTag>
              )}
              {reasons.distance && (
                <ReasonTag icon={<MapPin className="w-4 h-4" />}>
                  {reasons.distance}
                </ReasonTag>
              )}
              {reasons.interest && (
                <ReasonTag icon={<TrendingUp className="w-4 h-4" />}>
                  Matches your interests
                </ReasonTag>
              )}
            </div>
          </div>
        </div>

        <div className="flex lg:flex-col gap-3 lg:min-w-[140px]">
          <Button 
            variant="accent" 
            size="md"
            fullWidth
            onClick={() => onApply?.(id)}
            aria-label={`Apply to ${title}`}
          >
            Apply Now
          </Button>
          <Button 
            variant="outline" 
            size="md"
            fullWidth
            onClick={() => onViewDetails?.(id)}
            aria-label={`View details for ${title}`}
          >
            Details
          </Button>
        </div>
      </div>
    </article>
  );
}
