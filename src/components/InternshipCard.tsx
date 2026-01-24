import React from 'react';
import { MapPin, Clock, Bookmark, ExternalLink, TrendingUp, Target, Award } from 'lucide-react';
import { Badge, ReasonTag } from './Badge';
import { Button } from './Button';

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
    return (
      <article 
        className="bg-white rounded-2xl shadow-lg border-2 border-[var(--color-primary-200)] p-8 hover:shadow-xl transition-shadow"
        aria-label={`${title} at ${organization}`}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-2xl mb-2">{title}</h2>
            <p className="text-xl text-[var(--color-neutral-700)] mb-4">{organization}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {isBeginner && <Badge variant="beginner">Beginner Friendly</Badge>}
              {isRemote && <Badge variant="remote">Remote</Badge>}
              {stipend && <Badge variant="stipend">{stipend}</Badge>}
              {isVerified && <Badge variant="verified">Verified</Badge>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6 text-[var(--color-neutral-700)]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[var(--color-primary-600)]" aria-hidden="true" />
            <span>{location} {distance && `• ${distance}`}</span>
          </div>
          {duration && (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--color-primary-600)]" aria-hidden="true" />
              <span>{duration}</span>
            </div>
          )}
        </div>

        <div className="bg-[var(--color-primary-50)] rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-[var(--color-neutral-900)] mb-3">Why this matches you:</h3>
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
    return (
      <article 
        className="bg-white rounded-xl shadow-md border border-[var(--color-neutral-200)] p-4 hover:shadow-lg transition-shadow"
        aria-label={`${title} at ${organization}`}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{title}</h3>
            <p className="text-sm text-[var(--color-neutral-700)] truncate">{organization}</p>
          </div>
          <button
            onClick={() => onSave?.(id)}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-[var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
            aria-label={isSaved ? 'Unsave internship' : 'Save internship'}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current text-[var(--color-accent-500)]' : 'text-[var(--color-neutral-600)]'}`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {isBeginner && <Badge variant="beginner">Beginner</Badge>}
          {isRemote && <Badge variant="remote">Remote</Badge>}
          {stipend && <Badge variant="stipend">{stipend}</Badge>}
        </div>

        <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-700)] mb-3">
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span className="truncate">{location}</span>
          {distance && <span className="text-[var(--color-neutral-500)]">• {distance}</span>}
        </div>

        {reasons.skillMatch && (
          <p className="text-sm text-[var(--color-neutral-700)] mb-3 line-clamp-2">
            <Target className="w-4 h-4 inline mr-1" aria-hidden="true" />
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
  return (
    <article 
      className="bg-white rounded-xl shadow-md border border-[var(--color-neutral-200)] p-6 hover:shadow-lg hover:border-[var(--color-primary-300)] transition-all"
      aria-label={`${title} at ${organization}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">{title}</h3>
              <p className="text-lg text-[var(--color-neutral-700)]">{organization}</p>
            </div>
            <button
              onClick={() => onSave?.(id)}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-[var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              aria-label={isSaved ? 'Unsave internship' : 'Save internship'}
            >
              <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current text-[var(--color-accent-500)]' : 'text-[var(--color-neutral-600)]'}`} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {isBeginner && <Badge variant="beginner"><Award className="w-3 h-3" /> Beginner Friendly</Badge>}
            {isRemote && <Badge variant="remote">Remote</Badge>}
            {stipend && <Badge variant="stipend">{stipend}</Badge>}
            {isVerified && <Badge variant="verified">Verified</Badge>}
          </div>

          <div className="flex flex-wrap gap-4 mb-4 text-[var(--color-neutral-700)]">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[var(--color-primary-600)]" aria-hidden="true" />
              <span>{location}</span>
            </div>
            {distance && (
              <span className="text-[var(--color-neutral-600)]">• {distance}</span>
            )}
            {duration && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--color-primary-600)]" aria-hidden="true" />
                <span>{duration}</span>
              </div>
            )}
          </div>

          <div className="bg-[var(--color-neutral-50)] rounded-lg p-3 mb-4">
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
            Apply
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
