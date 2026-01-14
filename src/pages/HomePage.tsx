import React, { useState } from 'react';
import { Sparkles, Users, Shield, Zap, ArrowRight } from 'lucide-react';
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
}

export function HomePage({
  onStartOnboarding,
  onGuestBrowse,
  hasCompletedOnboarding,
  onSaveInternship,
  savedInternshipIds,
  copyVariant,
  userProfile
}: HomePageProps) {
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null);

  const featuredInternships = mockInternships.slice(0, 3);
  const selectedDetail = mockInternships.find(i => i.id === selectedInternship) || null;

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-primary-500)] text-white py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white mb-6">
              <Shield className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm font-medium">Trusted by Government Agencies</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              {getCopy('heroTitle', copyVariant)}
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-[var(--color-primary-100)] leading-relaxed">
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

              <Button
                variant="outline"
                size="lg"
                onClick={onGuestBrowse}
                className="text-lg px-8 py-5 border-white text-white hover:bg-white hover:text-[var(--color-primary-700)]"
              >
                {getCopy('guestMode', copyVariant)}
              </Button>
            </div>

            <p className="mt-6 text-[var(--color-primary-100)] text-sm">
              ✓ No account required • ✓ Free to use • ✓ Beginner friendly
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-center mb-12">Why Students Love VibeMatch</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[var(--color-primary-100)] text-[var(--color-primary-700)] flex items-center justify-center">
                <Zap className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="mb-3">Quick & Easy</h3>
              <p className="text-[var(--color-neutral-700)] leading-relaxed">
                Just 3 steps and 2 minutes to get personalized internship recommendations
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[var(--color-accent-100)] text-[var(--color-accent-700)] flex items-center justify-center">
                <Sparkles className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="mb-3">Smart Matching</h3>
              <p className="text-[var(--color-neutral-700)] leading-relaxed">
                Our algorithm matches you based on skills, interests, and location
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[var(--color-success-100)] text-[var(--color-success-700)] flex items-center justify-center">
                <Users className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="mb-3">Beginner Friendly</h3>
              <p className="text-[var(--color-neutral-700)] leading-relaxed">
                Most positions welcome first-time interns with no prior experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      {hasCompletedOnboarding && userProfile ? (
        <section className="py-16 bg-[var(--color-neutral-50)]">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="mb-2">Your Top Matches</h2>
                <p className="text-[var(--color-neutral-700)]">
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
        <section className="py-16 bg-[var(--color-neutral-50)]">
          <div className="container">
            <h2 className="text-center mb-4">Explore Sample Opportunities</h2>
            <p className="text-center text-[var(--color-neutral-700)] mb-12 max-w-2xl mx-auto">
              Here's what you'll see after completing your quick profile
            </p>

            <div className="grid gap-6 max-w-4xl mx-auto">
              {featuredInternships.map((internship, index) => (
                <div key={internship.id} className="relative">
                  {index === 0 && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent-500)] text-white text-sm font-semibold shadow-lg">
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
      <section className="py-16 bg-gradient-to-r from-[var(--color-primary-700)] to-[var(--color-primary-600)] text-white">
        <div className="container text-center">
          <h2 className="mb-4 text-white">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-[var(--color-primary-100)] max-w-2xl mx-auto">
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
