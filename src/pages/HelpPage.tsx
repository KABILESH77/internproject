import React, { useState } from 'react';
import { 
  HelpCircle, 
  Play, 
  BookOpen, 
  MessageCircle, 
  ChevronDown,
  CheckCircle,
  Lightbulb,
  Phone
} from 'lucide-react';
import { Button } from '../components/Button';
import { getCopy, CopyVariant } from '../data/microcopy';

interface HelpPageProps {
  copyVariant: CopyVariant;
}

interface FAQItem {
  question: string;
  answer: string;
}

export function HelpPage({ copyVariant }: HelpPageProps) {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const tutorialSteps = [
    {
      title: getCopy('tutorialStep1', copyVariant),
      description: 'Click "Quick Profile" and answer 3 simple questions about your education, skills, and interests. You can use voice input for skills!',
      icon: '1️⃣'
    },
    {
      title: getCopy('tutorialStep2', copyVariant),
      description: 'Our smart algorithm finds internships that match your profile. See exactly why each one was recommended for you.',
      icon: '2️⃣'
    },
    {
      title: getCopy('tutorialStep3', copyVariant),
      description: 'Save interesting opportunities and apply with one click. Track all your saved internships in one place.',
      icon: '3️⃣'
    }
  ];

  const faqs: FAQItem[] = [
    {
      question: 'Do I need to create an account?',
      answer: 'No! VibeMatch works without requiring an account. Your profile is stored locally on your device. You can browse as a guest anytime.'
    },
    {
      question: 'Are all internships really beginner-friendly?',
      answer: 'Most positions on VibeMatch welcome beginners, but not all. Look for the "Beginner Friendly" badge to find internships that don\'t require prior experience.'
    },
    {
      question: 'How does the matching algorithm work?',
      answer: 'We use three factors: skills match (40%), interest alignment (35%), and location (25%). You can see exactly why each internship was recommended for you.'
    },
    {
      question: 'Can I apply to internships directly?',
      answer: 'Yes! Each internship has an "Apply" button that takes you to the official application. We don\'t store your personal information.'
    },
    {
      question: 'Is VibeMatch really free?',
      answer: 'Yes, completely free for students. No hidden fees, no premium tiers. Our mission is to make government internships accessible to everyone.'
    },
    {
      question: 'What if I can\'t find matches?',
      answer: 'Try updating your profile with different skills or interests. You can also browse all internships using the Search page without creating a profile.'
    },
    {
      question: 'Are the internships paid?',
      answer: 'Many are! Look for the stipend badge on each card. Amounts vary by agency and location, typically ranging from $1,000-$2,000 per month.'
    },
    {
      question: 'How do I use voice input?',
      answer: 'When adding skills during profile setup, click the microphone button and speak your skills clearly. Say them one by one, like "Python, JavaScript, React".'
    }
  ];

  const quickTips = [
    'Complete your profile for better matches',
    'Save internships to review later',
    'Apply early - positions fill quickly',
    'Check "Beginner Friendly" if you\'re new',
    'Use voice input to save time'
  ];

  return (
    <div className="py-8 min-h-screen bg-[var(--color-neutral-50)]">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)] mb-4">
            <HelpCircle className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="mb-4">{getCopy('helpTitle', copyVariant)}</h1>
          <p className="text-xl text-[var(--color-neutral-700)]">
            Everything you need to know to get started
          </p>
        </div>

        {/* Tutorial Section */}
        <section className="bg-white rounded-xl border-2 border-[var(--color-neutral-200)] p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Play className="w-6 h-6 text-[var(--color-accent-500)]" aria-hidden="true" />
              <h2 className="text-xl">Interactive Tutorial</h2>
            </div>
            <Button
              variant="accent"
              size="md"
              onClick={() => setShowTutorial(!showTutorial)}
              leftIcon={<Play className="w-5 h-5" />}
            >
              {showTutorial ? 'Hide' : 'Start'} Tutorial
            </Button>
          </div>

          {showTutorial && (
            <div className="space-y-6 pt-6 border-t-2 border-[var(--color-neutral-200)]">
              {tutorialSteps.map((step, index) => (
                <div key={index} className="flex gap-4 p-6 bg-[var(--color-primary-50)] rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-[var(--color-neutral-700)]">{step.description}</p>
                  </div>
                </div>
              ))}

              <div className="bg-[var(--color-accent-50)] rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-[var(--color-success-600)]" />
                <h3 className="mb-2">That's it!</h3>
                <p className="text-[var(--color-neutral-700)] mb-4">
                  You're ready to find your perfect internship match.
                </p>
                <Button variant="accent" size="lg">
                  Get Started Now
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Quick Tips */}
        <section className="bg-gradient-to-r from-[var(--color-accent-50)] to-[var(--color-primary-50)] rounded-xl border-2 border-[var(--color-accent-200)] p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-[var(--color-accent-600)]" aria-hidden="true" />
            <h2 className="text-xl">Quick Tips</h2>
          </div>
          <ul className="space-y-3">
            {quickTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--color-success-600)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-[var(--color-neutral-800)]">{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-xl border-2 border-[var(--color-neutral-200)] p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-6 h-6 text-[var(--color-primary-600)]" aria-hidden="true" />
            <h2 className="text-xl">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border-2 border-[var(--color-neutral-200)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[var(--color-neutral-50)] transition-colors min-h-[64px] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary-500)]"
                  aria-expanded={activeFAQ === index}
                >
                  <span className="font-semibold pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${
                      activeFAQ === index ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {activeFAQ === index && (
                  <div className="px-6 py-4 bg-[var(--color-neutral-50)] border-t-2 border-[var(--color-neutral-200)]">
                    <p className="text-[var(--color-neutral-700)] leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)] text-white rounded-xl p-8 text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl mb-3 text-white">Still Need Help?</h2>
          <p className="text-[var(--color-primary-100)] mb-6 text-lg">
            Our support team is here to help you succeed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="accent"
              size="lg"
              leftIcon={<MessageCircle className="w-5 h-5" />}
            >
              Chat with Support
            </Button>
            <Button
              variant="outline"
              size="lg"
              leftIcon={<Phone className="w-5 h-5" />}
              className="border-white text-white hover:bg-white hover:text-[var(--color-primary-700)]"
            >
              Call Us
            </Button>
          </div>
          <p className="mt-4 text-sm text-[var(--color-primary-100)]">
            Available Monday-Friday, 9am-5pm EST
          </p>
        </section>
      </div>
    </div>
  );
}
