import React, { useState } from 'react';
import { Info, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '../components/Button';
import { InternshipCard } from '../components/InternshipCard';
import { InternshipDetailSlideOver } from '../components/InternshipDetailSlideOver';
import { mockInternships } from '../data/mockInternships';
import { getCopy, CopyVariant } from '../data/microcopy';
import { OnboardingData } from '../components/OnboardingModal';

interface RecommendationsPageProps {
  onSaveInternship: (id: string) => void;
  savedInternshipIds: string[];
  copyVariant: CopyVariant;
  userProfile: OnboardingData | null;
}

export function RecommendationsPage({
  onSaveInternship,
  savedInternshipIds,
  copyVariant,
  userProfile
}: RecommendationsPageProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null);

  const recommendations = mockInternships.slice(0, 4);
  const selectedDetail = mockInternships.find(i => i.id === selectedInternship) || null;

  return (
    <div className="py-8 min-h-screen bg-[var(--color-neutral-50)]">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-[var(--color-accent-500)]" aria-hidden="true" />
            <h1>Your Recommendations</h1>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl border-2 border-[var(--color-primary-200)] p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <p className="text-lg font-semibold mb-2">
                  {getCopy('foundMatches', copyVariant, { count: recommendations.length })}
                </p>
                {userProfile && (
                  <p className="text-[var(--color-neutral-700)]">
                    Based on: {userProfile.skills.slice(0, 3).join(', ')}
                    {userProfile.skills.length > 3 && ` +${userProfile.skills.length - 3} more`}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={() => setShowExplanation(!showExplanation)}
                leftIcon={<Info className="w-5 h-5" />}
              >
                {getCopy('explainButton', copyVariant)}
              </Button>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6 pt-6 border-t-2 border-[var(--color-neutral-200)] space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Info className="w-5 h-5 text-[var(--color-primary-600)]" aria-hidden="true" />
                  How We Match You
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-[var(--color-primary-50)] rounded-lg p-4">
                    <div className="text-2xl font-bold text-[var(--color-primary-700)] mb-1">40%</div>
                    <div className="text-sm font-medium mb-1">Skills Match</div>
                    <p className="text-sm text-[var(--color-neutral-700)]">
                      How well your skills align with the internship requirements
                    </p>
                  </div>
                  <div className="bg-[var(--color-accent-50)] rounded-lg p-4">
                    <div className="text-2xl font-bold text-[var(--color-accent-700)] mb-1">35%</div>
                    <div className="text-sm font-medium mb-1">Interest Match</div>
                    <p className="text-sm text-[var(--color-neutral-700)]">
                      Whether the sector matches your career interests
                    </p>
                  </div>
                  <div className="bg-[var(--color-success-50)] rounded-lg p-4">
                    <div className="text-2xl font-bold text-[var(--color-success-700)] mb-1">25%</div>
                    <div className="text-sm font-medium mb-1">Location</div>
                    <p className="text-sm text-[var(--color-neutral-700)]">
                      Distance from your location and remote options
                    </p>
                  </div>
                </div>
                <p className="text-sm text-[var(--color-neutral-600)] italic">
                  💡 Tip: Update your profile anytime to refine these matches
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="space-y-6 mb-8">
          {recommendations.map((internship, index) => (
            <div key={internship.id} className="relative">
              {index === 0 && (
                <div className="absolute -top-3 -right-3 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-accent-500)] text-white text-sm font-semibold shadow-lg">
                    <Sparkles className="w-4 h-4" /> Best Match
                  </span>
                </div>
              )}
              <InternshipCard
                internship={internship}
                variant={index === 0 ? 'hero' : 'default'}
                onSave={onSaveInternship}
                onViewDetails={setSelectedInternship}
                onApply={(id) => window.open(`/apply/${id}`, '_blank')}
                isSaved={savedInternshipIds.includes(internship.id)}
              />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button
            variant="secondary"
            size="lg"
            leftIcon={<RefreshCw className="w-5 h-5" />}
          >
            Show More Matches
          </Button>
          <p className="text-sm text-[var(--color-neutral-600)] mt-4">
            Showing {recommendations.length} of {mockInternships.length} total matches
          </p>
        </div>

        {/* Empty State (if no recommendations) */}
        {recommendations.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-neutral-200)] flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-[var(--color-neutral-500)]" />
            </div>
            <h2 className="mb-4">No matches yet</h2>
            <p className="text-[var(--color-neutral-700)] mb-6 max-w-md mx-auto">
              {getCopy('noMatchesFound', copyVariant)}
            </p>
            <Button variant="primary" size="lg">
              Update Your Profile
            </Button>
          </div>
        )}
      </div>

      {/* Detail Slide Over */}
      <InternshipDetailSlideOver
        internship={selectedDetail}
        isOpen={selectedInternship !== null}
        onClose={() => setSelectedInternship(null)}
        onApply={(id) => window.open(`/apply/${id}`, '_blank')}
        onSave={onSaveInternship}
        isSaved={selectedInternship ? savedInternshipIds.includes(selectedInternship) : false}
      />
    </div>
  );
}
