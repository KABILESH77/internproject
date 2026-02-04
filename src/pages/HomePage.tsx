import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Shield, Zap, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { InternshipCard } from '../components/InternshipCard';
import { InternshipDetailSlideOver } from '../components/InternshipDetailSlideOver';
import { mockInternships } from '../data/mockInternships';
import { getCopy, CopyVariant } from '../data/microcopy';
import { OnboardingData } from '../components/OnboardingModal';

interface HomePageProps {
  onStartOnboarding: () => void;
  onGuestBrowse: () => void;
  hasCompletedOnboarding: boolean;
  onSaveInternship: (id: string) => void;
  savedInternshipIds: string[];
  copyVariant: CopyVariant;
  userProfile: OnboardingData | null;
  onNavigateToProfile?: () => void;
}

export function HomePage({
  onStartOnboarding,
  onGuestBrowse,
  hasCompletedOnboarding,
  onSaveInternship,
  savedInternshipIds,
  copyVariant,
  userProfile,
  onNavigateToProfile
}: HomePageProps) {
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null);
  const [profileCompletion, setProfileCompletion] = useState<{ percentage: number; isComplete: boolean } | null>(null);

  // Check profile completion status
  useEffect(() => {
    const checkProfileCompletion = () => {
      const saved = localStorage.getItem('jobrasa-profile-completion');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setProfileCompletion(data);
        } catch (e) {
          console.error('Failed to parse profile completion');
        }
      }
    };
    
    checkProfileCompletion();
    
    // Listen for storage changes (when profile is updated)
    window.addEventListener('storage', checkProfileCompletion);
    
    // Also check on focus (when user comes back from profile page)
    window.addEventListener('focus', checkProfileCompletion);
    
    return () => {
      window.removeEventListener('storage', checkProfileCompletion);
      window.removeEventListener('focus', checkProfileCompletion);
    };
  }, []);

  const featuredInternships = mockInternships.slice(0, 3);
  const selectedDetail = mockInternships.find(i => i.id === selectedInternship) || null;

  return (
    <div className="pb-16">
      {/* Profile Incomplete Notification */}
      {profileCompletion && !profileCompletion.isComplete && (
        <div className="bg-red-50 border border-red-200 px-4 py-3">
          <div className="container">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">
                  Your profile is only <span className="font-bold">{profileCompletion.percentage}%</span> complete. 
                  Complete your profile to get better internship recommendations!
                </p>
              </div>
              {onNavigateToProfile && (
                <button 
                  onClick={onNavigateToProfile}
                  className="text-red-600 hover:text-red-800 text-sm font-semibold underline whitespace-nowrap"
                >
                  Complete Profile →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ backgroundColor: '#0d9494', color: 'white', padding: '64px 0' }}>
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '24px' }}>
              <Shield className="w-5 h-5" aria-hidden="true" />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>Trusted by Government Agencies</span>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '24px', lineHeight: '1.2', color: 'white' }}>
              {getCopy('heroTitle', copyVariant)}
            </h1>

            <p style={{ fontSize: '1.25rem', marginBottom: '40px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
              {getCopy('heroSubtitle', copyVariant)}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="accent"
                size="lg"
                onClick={onStartOnboarding}
                leftIcon={<Sparkles className="w-6 h-6" />}
                className="text-lg px-8 py-5"
              >
                {getCopy('quickProfileCTA', copyVariant)}
              </Button>

              <button
                onClick={onGuestBrowse}
                style={{
                  fontSize: '16px',
                  padding: '16px 32px',
                  border: '2px solid white',
                  borderRadius: '12px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#0d9494';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'white';
                }}
              >
                {getCopy('guestMode', copyVariant)}
              </button>
            </div>

            <p style={{ marginTop: '24px', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>
              ✓ No account required • ✓ Free to use • ✓ Beginner friendly
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '64px 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '48px', color: '#1f2937', fontSize: '2rem', fontWeight: '700' }}>Why Students Love JobRasa</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div style={{ textAlign: 'center', padding: '32px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', borderRadius: '12px', backgroundColor: '#e6f7f7', color: '#0d9494', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 style={{ marginBottom: '12px', color: '#1f2937', fontSize: '1.25rem', fontWeight: '600' }}>Quick & Easy</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Just 3 steps and 2 minutes to get personalized internship recommendations
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '32px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', borderRadius: '12px', backgroundColor: '#fff4e6', color: '#ff9500', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 style={{ marginBottom: '12px', color: '#1f2937', fontSize: '1.25rem', fontWeight: '600' }}>Smart Matching</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Our algorithm matches you based on skills, interests, and location
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '32px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', borderRadius: '12px', backgroundColor: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 style={{ marginBottom: '12px', color: '#1f2937', fontSize: '1.25rem', fontWeight: '600' }}>Beginner Friendly</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
                Most positions welcome first-time interns with no prior experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      {hasCompletedOnboarding && userProfile ? (
        <section style={{ padding: '64px 0', backgroundColor: 'white' }}>
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 style={{ marginBottom: '8px', color: '#1f2937', fontSize: '1.75rem', fontWeight: '700' }}>Your Top Matches</h2>
                <p style={{ color: '#6b7280' }}>
                  Based on your profile: {userProfile.skills.slice(0, 3).join(', ')}
                </p>
              </div>
            </div>

            <div className="grid gap-6">
              {featuredInternships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  variant="default"
                  onSave={onSaveInternship}
                  onViewDetails={setSelectedInternship}
                  onApply={(id) => window.open(`/apply/${id}`, '_blank')}
                  isSaved={savedInternshipIds.includes(internship.id)}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section style={{ padding: '64px 0', backgroundColor: 'white' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', marginBottom: '16px', color: '#1f2937', fontSize: '1.75rem', fontWeight: '700' }}>Explore Sample Opportunities</h2>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '48px', maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}>
              Here's what you'll see after completing your quick profile
            </p>

            <div className="grid gap-6 max-w-4xl mx-auto">
              {featuredInternships.map((internship, index) => (
                <div key={internship.id} className="relative">
                  {index === 0 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '9999px', backgroundColor: '#ff9500', color: 'white', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(255,149,0,0.3)' }}>
                        <Sparkles className="w-4 h-4" /> Top Match
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

            <div className="text-center mt-12">
              <Button
                variant="accent"
                size="lg"
                onClick={onStartOnboarding}
                rightIcon={<ArrowRight className="w-6 h-6" />}
              >
                Get My Personalized Matches
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section style={{ padding: '64px 0', backgroundColor: '#0a7676', color: 'white' }}>
        <div className="container text-center">
          <h2 style={{ marginBottom: '16px', color: 'white', fontSize: '2rem', fontWeight: '700' }}>Ready to Start Your Journey?</h2>
          <p style={{ fontSize: '1.25rem', marginBottom: '32px', color: 'rgba(255,255,255,0.9)', maxWidth: '42rem', marginLeft: 'auto', marginRight: 'auto' }}>
            Join thousands of students finding meaningful internships in public service
          </p>
          <Button
            variant="accent"
            size="lg"
            onClick={onStartOnboarding}
            leftIcon={<Sparkles className="w-6 h-6" />}
          >
            Get Started — It's Free
          </Button>
        </div>
      </section>

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
