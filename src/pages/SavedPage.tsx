import React, { useState } from 'react';
import { Bookmark, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '../components/Button';
import { InternshipCard } from '../components/InternshipCard';
import { InternshipDetailSlideOver } from '../components/InternshipDetailSlideOver';
import { mockInternships } from '../data/mockInternships';
import { CopyVariant } from '../data/microcopy';
import { OnboardingData } from '../components/OnboardingModal';

interface SavedPageProps {
  onSaveInternship: (id: string) => void;
  savedInternshipIds: string[];
  copyVariant: CopyVariant;
  userProfile: OnboardingData | null;
}

export function SavedPage({
  onSaveInternship,
  savedInternshipIds,
  copyVariant,
  userProfile
}: SavedPageProps) {
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null);

  const savedInternships = mockInternships.filter(i => savedInternshipIds.includes(i.id));
  const selectedDetail = mockInternships.find(i => i.id === selectedInternship) || null;

  const handleRemoveAll = () => {
    if (window.confirm('Are you sure you want to remove all saved internships?')) {
      savedInternshipIds.forEach(id => onSaveInternship(id));
    }
  };

  return (
    <div className="py-8 min-h-screen bg-[var(--color-neutral-50)]">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-[var(--color-accent-500)]" aria-hidden="true" />
              <h1>Saved Internships</h1>
            </div>
            {savedInternships.length > 0 && (
              <Button
                variant="ghost"
                size="md"
                onClick={handleRemoveAll}
                leftIcon={<Trash2 className="w-5 h-5" />}
              >
                Clear All
              </Button>
            )}
          </div>

          {savedInternships.length > 0 && (
            <p className="text-[var(--color-neutral-700)]">
              You have {savedInternships.length} saved internship{savedInternships.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Saved Internships */}
        {savedInternships.length > 0 ? (
          <div className="space-y-6">
            {savedInternships.map((internship) => (
              <InternshipCard
                key={internship.id}
                internship={internship}
                variant="default"
                onSave={onSaveInternship}
                onViewDetails={setSelectedInternship}
                onApply={(id) => window.open(`/apply/${id}`, '_blank')}
                isSaved={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-[var(--color-neutral-200)]">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[var(--color-neutral-100)] flex items-center justify-center">
              <Bookmark className="w-12 h-12 text-[var(--color-neutral-400)]" />
            </div>
            <h2 className="mb-4">No saved internships yet</h2>
            <p className="text-[var(--color-neutral-700)] mb-8 max-w-md mx-auto">
              When you find internships you're interested in, save them here to review later
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.location.hash = '#search'}
              leftIcon={<ExternalLink className="w-5 h-5" />}
            >
              Browse Internships
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        {savedInternships.length > 0 && (
          <div className="mt-8 bg-[var(--color-primary-50)] rounded-xl border-2 border-[var(--color-primary-200)] p-6">
            <h3 className="mb-4">Quick Actions</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="accent"
                size="md"
                fullWidth
                leftIcon={<ExternalLink className="w-5 h-5" />}
              >
                Apply to All ({savedInternships.length})
              </Button>
              <Button
                variant="outline"
                size="md"
                fullWidth
              >
                Export as PDF
              </Button>
            </div>
            <p className="text-sm text-[var(--color-neutral-700)] mt-4">
              💡 Tip: Apply early to increase your chances. Most positions fill within 2-3 weeks.
            </p>
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
        isSaved={true}
      />
    </div>
  );
}
