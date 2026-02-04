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
    <div style={{ padding: '32px 0', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bookmark style={{ width: '32px', height: '32px', color: '#ff9500' }} aria-hidden="true" />
              <h1 style={{ color: '#1f2937', fontSize: '1.75rem', fontWeight: '700' }}>Saved Internships</h1>
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
            <p style={{ color: '#6b7280' }}>
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
          <div style={{ textAlign: 'center', padding: '64px 0', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            <div style={{ width: '96px', height: '96px', margin: '0 auto 24px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bookmark style={{ width: '48px', height: '48px', color: '#9ca3af' }} />
            </div>
            <h2 style={{ marginBottom: '16px', color: '#1f2937', fontSize: '1.5rem', fontWeight: '700' }}>No saved internships yet</h2>
            <p style={{ color: '#6b7280', marginBottom: '32px', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
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
          <div style={{ marginTop: '32px', backgroundColor: '#e6f7f7', borderRadius: '16px', border: '1px solid #b3e6e6', padding: '24px' }}>
            <h3 style={{ marginBottom: '16px', color: '#1f2937', fontSize: '1.125rem', fontWeight: '600' }}>Quick Actions</h3>
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
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
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
