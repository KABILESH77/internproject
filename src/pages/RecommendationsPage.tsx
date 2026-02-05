import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
    <div style={{ padding: '32px 0', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles style={{ width: '32px', height: '32px', color: '#ff9500' }} aria-hidden="true" />
            <h1 style={{ color: '#1f2937', fontSize: '1.75rem', fontWeight: '700' }}>Your AI-Powered Recommendations</h1>
          </div>

          {/* Summary with AI Insights */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '2px solid #b3e6e6', padding: '24px', marginBottom: '24px' }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                    {getCopy('foundMatches', copyVariant, { count: recommendations.length })}
                  </p>
                  {userProfile && (
                    <span style={{ padding: '4px 8px', fontSize: '12px', fontWeight: '500', borderRadius: '9999px', backgroundColor: '#dcfce7', color: '#15803d' }}>
                      AI Matched
                    </span>
                  )}
                </div>
                {userProfile && (
                  <div className="space-y-1">
                    <p style={{ color: '#4b5563' }}>
                      Based on: {userProfile.skills.slice(0, 3).join(', ')}
                      {userProfile.skills.length > 3 && ` +${userProfile.skills.length - 3} more`}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                      Average match score: <span style={{ fontWeight: '600', color: '#0d9494' }}>{avgMatchScore}%</span>
                    </p>
                  </div>
                )}
                {!userProfile && (
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
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
              <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #e5e5e5' }} className="space-y-4">
                <h3 style={{ fontWeight: '600', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Info style={{ width: '20px', height: '20px', color: '#0d9494' }} aria-hidden="true" />
                  How Our AI Matches You
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280' }}>
                  Our hybrid AI system uses machine learning to analyze your profile and find the best internship matches:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div style={{ backgroundColor: '#e6f7f7', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Target style={{ width: '20px', height: '20px', color: '#075959' }} />
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#075959' }}>{weights.skill}%</div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1f2937' }}>Skills Match</div>
                    <p style={{ fontSize: '14px', color: '#4b5563' }}>
                      We analyze your skills and find internships requiring similar competencies using semantic matching
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#fff4e6', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <TrendingUp style={{ width: '20px', height: '20px', color: '#995900' }} />
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#995900' }}>{weights.interest}%</div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1f2937' }}>Interest Match</div>
                    <p style={{ fontSize: '14px', color: '#4b5563' }}>
                      We match your career interests with sectors and roles that align with your goals
                    </p>
                  </div>
                  <div style={{ backgroundColor: '#f0fdf4', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <MapPin style={{ width: '20px', height: '20px', color: '#15803d' }} />
                      <div style={{ fontSize: '24px', fontWeight: '700', color: '#15803d' }}>{weights.location}%</div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', color: '#1f2937' }}>Location</div>
                    <p style={{ fontSize: '14px', color: '#4b5563' }}>
                      Distance from you and remote opportunities are factored in
                    </p>
                  </div>
                </div>
                <div style={{ backgroundColor: '#f5f5f5', borderRadius: '8px', padding: '16px', marginTop: '16px' }}>
                  <p style={{ fontSize: '14px', color: '#4b5563' }}>
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
                onApply={(id) => navigate(`/apply/${id}`)}
                isSaved={savedInternshipIds.includes(internship.id)}
              />

              {/* AI Match Reasons */}
              {internship.matchReasons.length > 0 && (
                <div className="mt-3 ml-4 flex flex-wrap gap-2">
                  {internship.matchReasons.map((reason, idx) => (
                    <span 
                      key={idx}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '9999px', backgroundColor: '#e6f7f7', color: '#075959', fontSize: '12px', fontWeight: '500' }}
                    >
                      ✨ {reason}
                    </span>
                  ))}
                </div>
              )}

              {/* Score Breakdown (expandable on first card) */}
              {index === 0 && (
                <div className="mt-4 ml-4 grid grid-cols-3 gap-3">
                  <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#e6f7f7', borderRadius: '8px' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#075959' }}>
                      {internship.scoreBreakdown.skillScore}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Skills</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#fff4e6', borderRadius: '8px' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#995900' }}>
                      {internship.scoreBreakdown.interestScore}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Interest</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#15803d' }}>
                      {internship.scoreBreakdown.locationScore}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Location</div>
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
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px' }}>
              Showing {displayCount} of {recommendations.length} AI-ranked matches
            </p>
          </div>
        )}

        {/* Empty State (if no recommendations) */}
        {recommendations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ width: '96px', height: '96px', margin: '0 auto 24px', borderRadius: '50%', backgroundColor: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles style={{ width: '48px', height: '48px', color: '#737373' }} />
            </div>
            <h2 style={{ marginBottom: '16px', color: '#1f2937', fontSize: '1.5rem', fontWeight: '700' }}>No matches yet</h2>
            <p style={{ color: '#4b5563', marginBottom: '24px', maxWidth: '28rem', marginLeft: 'auto', marginRight: 'auto' }}>
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
        onApply={(id) => navigate(`/apply/${id}`)}
        onSave={onSaveInternship}
        isSaved={selectedInternship ? savedInternshipIds.includes(selectedInternship) : false}
      />
    </div>
  );
}

export type { ScoredInternship };
