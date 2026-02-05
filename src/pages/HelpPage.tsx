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
      answer: 'No! JobRasa works without requiring an account. Your profile is stored locally on your device. You can browse as a guest anytime.'
    },
    {
      question: 'Are all internships really beginner-friendly?',
      answer: 'Most positions on JobRasa welcome beginners, but not all. Look for the "Beginner Friendly" badge to find internships that don\'t require prior experience.'
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
      question: 'Is JobRasa really free?',
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
    <div style={{ padding: '32px 0', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#b3e6e6', color: '#075959', marginBottom: '16px' }}>
            <HelpCircle className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 style={{ marginBottom: '16px', color: '#1f2937', fontSize: '2rem', fontWeight: '700' }}>{getCopy('helpTitle', copyVariant)}</h1>
          <p style={{ fontSize: '20px', color: '#4b5563' }}>
            Everything you need to know to get started
          </p>
        </div>

        {/* Tutorial Section */}
        <section style={{ backgroundColor: 'white', borderRadius: '12px', border: '2px solid #e5e5e5', padding: '32px', marginBottom: '32px' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Play style={{ width: '24px', height: '24px', color: '#ff9500' }} aria-hidden="true" />
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>Interactive Tutorial</h2>
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
            <div className="space-y-6" style={{ paddingTop: '24px', borderTop: '2px solid #e5e5e5' }}>
              {tutorialSteps.map((step, index) => (
                <div key={index} className="flex gap-4" style={{ padding: '24px', backgroundColor: '#e6f7f7', borderRadius: '12px' }}>
                  <div style={{ flexShrink: 0, width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>{step.title}</h3>
                    <p style={{ color: '#4b5563' }}>{step.description}</p>
                  </div>
                </div>
              ))}

              <div style={{ backgroundColor: '#fff4e6', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                <CheckCircle style={{ width: '48px', height: '48px', margin: '0 auto 12px', color: '#22c55e' }} />
                <h3 style={{ marginBottom: '8px', color: '#1f2937', fontWeight: '600' }}>That's it!</h3>
                <p style={{ color: '#4b5563', marginBottom: '16px' }}>
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
        <section style={{ background: 'linear-gradient(to right, #fff4e6, #e6f7f7)', borderRadius: '12px', border: '2px solid #ffe0b3', padding: '32px', marginBottom: '32px' }}>
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb style={{ width: '24px', height: '24px', color: '#cc7700' }} aria-hidden="true" />
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>Quick Tips</h2>
          </div>
          <ul className="space-y-3">
            {quickTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle style={{ width: '20px', height: '20px', color: '#22c55e', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                <span style={{ color: '#1f2937' }}>{tip}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ Section */}
        <section style={{ backgroundColor: 'white', borderRadius: '12px', border: '2px solid #e5e5e5', padding: '32px', marginBottom: '32px' }}>
          <div className="flex items-center gap-3 mb-6">
            <BookOpen style={{ width: '24px', height: '24px', color: '#0d9494' }} aria-hidden="true" />
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} style={{ border: '2px solid #e5e5e5', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                  style={{ width: '100%', padding: '16px 24px', textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', backgroundColor: 'white', border: 'none', cursor: 'pointer', color: '#1f2937' }}
                  aria-expanded={activeFAQ === index}
                >
                  <span style={{ fontWeight: '600', paddingRight: '16px' }}>{faq.question}</span>
                  <ChevronDown
                    style={{ width: '20px', height: '20px', flexShrink: 0, transition: 'transform 0.2s', transform: activeFAQ === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    aria-hidden="true"
                  />
                </button>
                {activeFAQ === index && (
                  <div style={{ padding: '16px 24px', backgroundColor: '#fafafa', borderTop: '2px solid #e5e5e5' }}>
                    <p style={{ color: '#4b5563', lineHeight: '1.6' }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section style={{ background: 'linear-gradient(to right, #0a7676, #0d9494)', color: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
          <MessageCircle style={{ width: '48px', height: '48px', margin: '0 auto 16px' }} aria-hidden="true" />
          <h2 style={{ fontSize: '24px', marginBottom: '12px', color: 'white', fontWeight: '700' }}>Still Need Help?</h2>
          <p style={{ color: '#b3e6e6', marginBottom: '24px', fontSize: '18px' }}>
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
          <p style={{ marginTop: '16px', fontSize: '14px', color: '#b3e6e6' }}>
            Available Monday-Friday, 9am-5pm EST
          </p>
        </section>
      </div>
    </div>
  );
}
