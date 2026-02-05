import React, { useState, useMemo } from 'react';
import { ArrowLeft, MapPin, Clock, Building2, Award, CheckCircle, Upload, Send, Volume2 } from 'lucide-react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { TextToSpeechButton } from '../components/TextToSpeechButton';
import { mockInternships } from '../data/mockInternships';

// Helper function to generate full job description text for TTS
function generateFullJobDescriptionTTS(internship: any): string {
  const parts = [
    `Job Title: ${internship.title} at ${internship.organization}.`,
    internship.location && `Location: ${internship.location}.`,
    internship.isRemote && 'This is a remote position.',
    internship.isBeginner && 'This internship is beginner friendly.',
    internship.stipend && `Stipend: ${internship.stipend}.`,
    internship.duration && `Duration: ${internship.duration}.`,
    internship.description && `About this internship: ${internship.description}`,
    internship.responsibilities?.length > 0 && 
      `Responsibilities: ${internship.responsibilities.join('. ')}.`,
    internship.requirements?.length > 0 && 
      `Requirements: ${internship.requirements.join('. ')}.`,
    internship.aboutCompany && `About the company: ${internship.aboutCompany}`,
    internship.whatYoullLearn?.length > 0 && 
      `What you'll learn: ${internship.whatYoullLearn.join('. ')}.`,
    internship.benefits?.length > 0 && 
      `Benefits: ${internship.benefits.join('. ')}.`,
  ];
  
  return parts.filter(Boolean).join(' ');
}

interface ApplyPageProps {
  internshipId: string;
  onBack: () => void;
}

export function ApplyPage({ internshipId, onBack }: ApplyPageProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    university: '',
    major: '',
    graduationYear: '',
    coverLetter: '',
    linkedIn: '',
    portfolio: '',
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Find the internship from mock data
  const internship = useMemo(() => {
    return mockInternships.find(i => i.id === internshipId);
  }, [internshipId]);

  if (!internship) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '100px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>
            Internship Not Found
          </h1>
          <p style={{ color: '#4b5563', marginBottom: '24px' }}>
            The internship you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={onBack}>
            <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '100px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            backgroundColor: '#d1fae5', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <CheckCircle style={{ width: '40px', height: '40px', color: '#059669' }} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', marginBottom: '16px' }}>
            Application Submitted!
          </h1>
          <p style={{ color: '#4b5563', marginBottom: '8px', fontSize: '18px' }}>
            Your application for <strong>{internship.title}</strong> at <strong>{internship.organization}</strong> has been submitted successfully.
          </p>
          <p style={{ color: '#6b7280', marginBottom: '32px' }}>
            You'll receive a confirmation email shortly. The hiring team will review your application and get back to you within 2-3 weeks.
          </p>
          <Button variant="primary" onClick={onBack}>
            <ArrowLeft style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            Back to Internships
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              color: '#4b5563', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            <ArrowLeft style={{ width: '20px', height: '20px' }} />
            Back to Internships
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
          {/* Left Column - Job Description */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }}>
            
            {/* Job Description Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1f2937', flex: 1 }}>
                  {internship.title}
                </h1>
                <TextToSpeechButton 
                  text={generateFullJobDescriptionTTS(internship)} 
                  size="md" 
                  variant="pill"
                  label="Listen"
                  className="flex-shrink-0"
                />
              </div>
              <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '16px' }}>
                {internship.organization}
              </p>
              
              {/* Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {internship.isBeginner && (
                  <Badge variant="beginner">
                    <Award style={{ width: '12px', height: '12px' }} /> Beginner Friendly
                  </Badge>
                )}
                {internship.isRemote && <Badge variant="remote">Remote</Badge>}
                {internship.stipend && <Badge variant="stipend">{internship.stipend}</Badge>}
                {internship.isVerified && <Badge variant="verified">Verified</Badge>}
              </div>

              {/* Location & Duration */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4b5563' }}>
                  <MapPin style={{ width: '20px', height: '20px', color: '#0d9494' }} />
                  <span style={{ fontSize: '16px' }}>{internship.location}</span>
                </div>
                {internship.duration && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4b5563' }}>
                    <Clock style={{ width: '20px', height: '20px', color: '#0d9494' }} />
                    <span style={{ fontSize: '16px' }}>{internship.duration}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  About this Internship
                </h2>
                <p style={{ color: '#4b5563', lineHeight: '1.7' }}>
                  {internship.description}
                </p>
              </div>

              {/* Responsibilities */}
              {internship.responsibilities && internship.responsibilities.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                    What You'll Do
                  </h2>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {internship.responsibilities.map((item, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                        <span style={{ 
                          flexShrink: 0,
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          backgroundColor: '#b3e6e6', 
                          color: '#075959', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontSize: '12px', 
                          fontWeight: '600' 
                        }}>
                          {index + 1}
                        </span>
                        <span style={{ color: '#4b5563' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {internship.requirements && internship.requirements.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                    Requirements
                  </h2>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {internship.requirements.map((item, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ color: '#0d9494', marginTop: '4px' }}>•</span>
                        <span style={{ color: '#4b5563' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* About Company */}
              {internship.aboutCompany && (
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 style={{ width: '20px', height: '20px', color: '#0d9494' }} />
                    About {internship.organization}
                  </h2>
                  <p style={{ color: '#4b5563', lineHeight: '1.7' }}>
                    {internship.aboutCompany}
                  </p>
                </div>
              )}

              {/* What You'll Learn */}
              {internship.whatYoullLearn && internship.whatYoullLearn.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                    What You'll Learn
                  </h2>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {internship.whatYoullLearn.map((item, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ color: '#22c55e', marginTop: '4px' }}>✓</span>
                        <span style={{ color: '#4b5563' }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills You'll Gain */}
              {internship.skillsYoullGain && internship.skillsYoullGain.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                    Skills You'll Gain
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {internship.skillsYoullGain.map((skill, index) => (
                      <span
                        key={index}
                        style={{ 
                          padding: '6px 14px', 
                          backgroundColor: '#b3e6e6', 
                          color: '#043b3b', 
                          borderRadius: '9999px', 
                          fontSize: '14px', 
                          fontWeight: '500' 
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {internship.benefits && internship.benefits.length > 0 && (
                <div style={{ backgroundColor: '#f0fdf4', borderRadius: '12px', padding: '16px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                    Benefits & Perks
                  </h2>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {internship.benefits.map((benefit, index) => (
                      <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ color: '#22c55e', marginTop: '4px' }}>★</span>
                        <span style={{ color: '#4b5563' }}>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Application Form */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '8px' }}>
                Apply for this Position
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Fill out the form below to submit your application
              </p>

              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Personal Information
                  </h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '16px',
                        color: '#1f2937',
                        backgroundColor: 'white'
                      }}
                      placeholder="John Doe"
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '16px',
                        color: '#1f2937',
                        backgroundColor: 'white'
                      }}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '16px',
                        color: '#1f2937',
                        backgroundColor: 'white'
                      }}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                {/* Education */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Education
                  </h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      University/College *
                    </label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '16px',
                        color: '#1f2937',
                        backgroundColor: 'white'
                      }}
                      placeholder="University of Example"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        Major/Field of Study *
                      </label>
                      <input
                        type="text"
                        name="major"
                        value={formData.major}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          fontSize: '16px',
                          color: '#1f2937',
                          backgroundColor: 'white'
                        }}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                        Expected Graduation *
                      </label>
                      <select
                        name="graduationYear"
                        value={formData.graduationYear}
                        onChange={handleInputChange}
                        required
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          border: '1px solid #d1d5db',
                          fontSize: '16px',
                          color: '#1f2937',
                          backgroundColor: 'white'
                        }}
                      >
                        <option value="">Select Year</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                        <option value="2029">2029</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Resume */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Resume
                  </h3>
                  
                  <div 
                    style={{
                      border: '2px dashed #d1d5db',
                      borderRadius: '12px',
                      padding: '24px',
                      textAlign: 'center',
                      backgroundColor: '#f9fafb',
                      cursor: 'pointer'
                    }}
                    onClick={() => document.getElementById('resume-upload')?.click()}
                  >
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    <Upload style={{ width: '32px', height: '32px', color: '#9ca3af', margin: '0 auto 12px' }} />
                    {resumeFile ? (
                      <p style={{ color: '#059669', fontWeight: '500' }}>{resumeFile.name}</p>
                    ) : (
                      <>
                        <p style={{ color: '#4b5563', marginBottom: '4px' }}>
                          Click to upload your resume
                        </p>
                        <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                          PDF, DOC, or DOCX (max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Cover Letter
                  </h3>
                  
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '16px',
                      color: '#1f2937',
                      backgroundColor: 'white',
                      resize: 'vertical'
                    }}
                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                  />
                </div>

                {/* Links */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Links (Optional)
                  </h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '16px',
                        color: '#1f2937',
                        backgroundColor: 'white'
                      }}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                      Portfolio/GitHub
                    </label>
                    <input
                      type="url"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '16px',
                        color: '#1f2937',
                        backgroundColor: 'white'
                      }}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
