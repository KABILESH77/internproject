import React, { useState, useMemo } from 'react';
import { Info, Sparkles, RefreshCw, TrendingUp, Target, MapPin } from 'lucide-react';
import { Button } from '../components/Button';
import { InternshipCard } from '../components/InternshipCard';
import { InternshipDetailSlideOver } from '../components/InternshipDetailSlideOver';
import { mockInternships } from '../data/mockInternships';
import { getCopy, CopyVariant } from '../data/microcopy';
import { OnboardingData } from '../components/OnboardingModal';
import { 
  getRecommendations, 
  RecommendationWeights,
  ScoredInternship 
} from '../services/recommendationEngine';

interface RecommendationsPageProps {
  onSaveInternship: (id: string) => void;
  savedInternshipIds: string[];
  copyVariant: CopyVariant;
  userProfile: OnboardingData | null;
  weights?: RecommendationWeights;
}

export function RecommendationsPage({
  onSaveInternship,
  savedInternshipIds,
  copyVariant,
  userProfile,
  weights = { skill: 40, interest: 35, location: 25 }
}: RecommendationsPageProps) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(4);

  // Use ML-based recommendations instead of simple slice
  const recommendations: ScoredInternship[] = useMemo(() => {
    return getRecommendations(mockInternships, userProfile, weights);
  }, [userProfile, weights]);

  const displayedRecommendations = recommendations.slice(0, displayCount);
  const selectedDetail = recommendations.find(i => i.id === selectedInternship) || null;

  const handleLoadMore = () => {
    setDisplayCount(prev => Math.min(prev + 4, recommendations.length));
  };

  // Calculate average match score
  const avgMatchScore = useMemo(() => {
    if (displayedRecommendations.length === 0) return 0;
    const sum = displayedRecommendations.reduce((acc, r) => acc + r.matchScore, 0);
    return Math.round(sum / displayedRecommendations.length);
  }, [displayedRecommendations]);

  return (
    <div className="py-8 min-h-screen bg-[var(--color-neutral-50)]">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-[var(--color-accent-500)]" aria-hidden="true" />
            <h1>Your AI-Powered Recommendations</h1>
          </div>

          {/* Summary with AI Insights */}
          <div className="bg-white rounded-xl border-2 border-[var(--color-primary-200)] p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-lg font-semibold">
                    {getCopy('foundMatches', copyVariant, { count: recommendations.length })}
                  </p>
                  {userProfile && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--color-success-100)] text-[var(--color-success-700)]">
                      AI Matched
                    </span>
                  )}
                </div>
                {userProfile && (
                  <div className="space-y-1">
                    <p className="text-[var(--color-neutral-700)]">
                      Based on: {userProfile.skills.slice(0, 3).join(', ')}
                      {userProfile.skills.length > 3 && ` +${userProfile.skills.length - 3} more`}
                    </p>
                    <p className="text-sm text-[var(--color-neutral-600)]">
                      Average match score: <span className="font-semibold text-[var(--color-primary-600)]">{avgMatchScore}%</span>
                    </p>
                  </div>
                )}
                {!userProfile && (
                  <p className="text-[var(--color-neutral-600)] text-sm">
                    Complete your profile to get personalized AI-powered recommendations
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

            {/* Algorithm Explanation */}
            {showExplanation && (
              <div className="mt-6 pt-6 border-t-2 border-[var(--color-neutral-200)] space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Info className="w-5 h-5 text-[var(--color-primary-600)]" aria-hidden="true" />
                  How Our AI Matches You
                </h3>
                <p className="text-sm text-[var(--color-neutral-600)]">
                  Our hybrid AI system uses machine learning to analyze your profile and find the best internship matches:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-[var(--color-primary-50)] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-[var(--color-primary-700)]" />
                      <div className="text-2xl font-bold text-[var(--color-primary-700)]">{weights.skill}%</div>
                    </div>
                    <div className="text-sm font-medium mb-1">Skills Match</div>
                    <p className="text-sm text-[var(--color-neutral-700)]">
                      We analyze your skills and find internships requiring similar competencies using semantic matching
                    </p>
                  </div>
                  <div className="bg-[var(--color-accent-50)] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-[var(--color-accent-700)]" />
                      <div className="text-2xl font-bold text-[var(--color-accent-700)]">{weights.interest}%</div>
                    </div>
                    <div className="text-sm font-medium mb-1">Interest Match</div>
                    <p className="text-sm text-[var(--color-neutral-700)]">
                      We match your career interests with sectors and roles that align with your goals
                    </p>
                  </div>
                  <div className="bg-[var(--color-success-50)] rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-[var(--color-success-700)]" />
                      <div className="text-2xl font-bold text-[var(--color-success-700)]">{weights.location}%</div>
                    </div>
                    <div className="text-sm font-medium mb-1">Location</div>
                    <p className="text-sm text-[var(--color-neutral-700)]">
                      Distance from you and remote opportunities are factored in
                    </p>
                  </div>
                </div>
                <div className="bg-[var(--color-neutral-100)] rounded-lg p-4 mt-4">
                  <p className="text-sm text-[var(--color-neutral-700)]">
                    💡 <strong>Pro tip:</strong> You can also chat with our AI assistant (click the chat button) to get personalized recommendations and career advice!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="space-y-6 mb-8">
          {displayedRecommendations.map((internship, index) => (
            <div key={internship.id} className="relative">
              {/* Best Match Badge */}
              {index === 0 && internship.matchScore >= 70 && (
                <div className="absolute -top-3 -right-3 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-accent-500)] text-white text-sm font-semibold shadow-lg">
                    <Sparkles className="w-4 h-4" /> Best Match
                  </span>
                </div>
              )}
              
              {/* Match Score Badge */}
              <div className="absolute -top-3 -left-3 z-10">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg ${
                  internship.matchScore >= 80 
                    ? 'bg-[var(--color-success-500)] text-white'
                    : internship.matchScore >= 60
                    ? 'bg-[var(--color-primary-500)] text-white'
                    : 'bg-[var(--color-neutral-500)] text-white'
                }`}>
                  {internship.matchScore}% match
                </span>
              </div>

              <InternshipCard
                internship={internship}
                variant={index === 0 ? 'hero' : 'default'}
                onSave={onSaveInternship}
                onViewDetails={setSelectedInternship}
                onApply={(id) => window.open(`/apply/${id}`, '_blank')}
                isSaved={savedInternshipIds.includes(internship.id)}
              />

              {/* AI Match Reasons */}
              {internship.matchReasons.length > 0 && (
                <div className="mt-3 ml-4 flex flex-wrap gap-2">
                  {internship.matchReasons.map((reason, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--color-primary-50)] text-[var(--color-primary-700)] text-xs font-medium"
                    >
                      ✨ {reason}
                    </span>
                  ))}
                </div>
              )}

              {/* Score Breakdown (expandable on first card) */}
              {index === 0 && (
                <div className="mt-4 ml-4 grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-[var(--color-primary-50)] rounded-lg">
                    <div className="text-lg font-bold text-[var(--color-primary-700)]">
                      {internship.scoreBreakdown.skillScore}%
                    </div>
                    <div className="text-xs text-[var(--color-neutral-600)]">Skills</div>
                  </div>
                  <div className="text-center p-2 bg-[var(--color-accent-50)] rounded-lg">
                    <div className="text-lg font-bold text-[var(--color-accent-700)]">
                      {internship.scoreBreakdown.interestScore}%
                    </div>
                    <div className="text-xs text-[var(--color-neutral-600)]">Interest</div>
                  </div>
                  <div className="text-center p-2 bg-[var(--color-success-50)] rounded-lg">
                    <div className="text-lg font-bold text-[var(--color-success-700)]">
                      {internship.scoreBreakdown.locationScore}%
                    </div>
                    <div className="text-xs text-[var(--color-neutral-600)]">Location</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More */}
        {displayCount < recommendations.length && (
          <div className="text-center">
            <Button
              variant="secondary"
              size="lg"
              leftIcon={<RefreshCw className="w-5 h-5" />}
              onClick={handleLoadMore}
            >
              Show More Matches
            </Button>
            <p className="text-sm text-[var(--color-neutral-600)] mt-4">
              Showing {displayCount} of {recommendations.length} AI-ranked matches
            </p>
          </div>
        )}

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

export type { ScoredInternship };
