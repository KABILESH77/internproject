import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Upload, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Target,
  MapPin,
  Heart,
  Code,
  Clock,
  Sparkles,
  Bot,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/Button';
import { CSVUpload } from '../components/admin/CSVUpload';
import { AnalyticsCard } from '../components/admin/AnalyticsCard';
import { WeightSlider } from '../components/admin/WeightSlider';
import { RecommendationWeights } from '../services/recommendationEngine';
import { checkOllamaHealth } from '../services/ollamaService';

interface AdminPageProps {
  weights: RecommendationWeights;
  onWeightsChange: (weights: RecommendationWeights) => void;
}

export function AdminPage({ weights, onWeightsChange }: AdminPageProps) {
  const [skillWeight, setSkillWeight] = useState(weights.skill);
  const [interestWeight, setInterestWeight] = useState(weights.interest);
  const [locationWeight, setLocationWeight] = useState(weights.location);
  const [ollamaStatus, setOllamaStatus] = useState<{ available: boolean; models: string[] } | null>(null);
  const [isCheckingOllama, setIsCheckingOllama] = useState(false);

  // Sync with parent weights
  useEffect(() => {
    setSkillWeight(weights.skill);
    setInterestWeight(weights.interest);
    setLocationWeight(weights.location);
  }, [weights]);

  // Check Ollama status on mount
  useEffect(() => {
    checkOllamaStatus();
  }, []);

  const checkOllamaStatus = async () => {
    setIsCheckingOllama(true);
    try {
      const status = await checkOllamaHealth();
      setOllamaStatus(status);
    } catch {
      setOllamaStatus({ available: false, models: [] });
    }
    setIsCheckingOllama(false);
  };

  // Normalize weights to always sum to 100%
  const normalizeWeights = (changed: 'skill' | 'interest' | 'location', newValue: number) => {
    const total = 100;
    const remaining = total - newValue;

    let newSkill = skillWeight;
    let newInterest = interestWeight;
    let newLocation = locationWeight;

    if (changed === 'skill') {
      newSkill = newValue;
      const ratio = remaining / (interestWeight + locationWeight);
      newInterest = Math.round(interestWeight * ratio);
      newLocation = Math.round(locationWeight * ratio);
    } else if (changed === 'interest') {
      newInterest = newValue;
      const ratio = remaining / (skillWeight + locationWeight);
      newSkill = Math.round(skillWeight * ratio);
      newLocation = Math.round(locationWeight * ratio);
    } else {
      newLocation = newValue;
      const ratio = remaining / (skillWeight + interestWeight);
      newSkill = Math.round(skillWeight * ratio);
      newInterest = Math.round(interestWeight * ratio);
    }

    setSkillWeight(newSkill);
    setInterestWeight(newInterest);
    setLocationWeight(newLocation);

    // Notify parent of weight changes
    onWeightsChange({
      skill: newSkill,
      interest: newInterest,
      location: newLocation
    });
  };

  const auditLog = [
    {
      id: '1',
      internshipTitle: 'Software Engineering Intern',
      userId: 'user_123',
      matchScore: 87,
      breakdown: {
        skill: 35,
        interest: 32,
        location: 20
      },
      timestamp: '2026-01-14 10:23:00'
    },
    {
      id: '2',
      internshipTitle: 'Data Analysis Intern',
      userId: 'user_456',
      matchScore: 78,
      breakdown: {
        skill: 28,
        interest: 30,
        location: 20
      },
      timestamp: '2026-01-14 10:21:45'
    },
    {
      id: '3',
      internshipTitle: 'UX Research Intern',
      userId: 'user_789',
      matchScore: 92,
      breakdown: {
        skill: 38,
        interest: 35,
        location: 19
      },
      timestamp: '2026-01-14 10:19:12'
    }
  ];

  return (
    <div className="py-8 min-h-screen bg-[var(--color-neutral-50)]">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-[var(--color-primary-600)]" aria-hidden="true" />
            <h1>Admin Dashboard</h1>
          </div>
          <p className="text-[var(--color-neutral-700)]">
            Manage internships, view analytics, and tune the recommendation algorithm
          </p>
        </div>

        {/* Analytics Grid */}
        <section className="mb-8">
          <h2 className="text-xl mb-6">Overview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnalyticsCard
              title="Total Internships"
              value="247"
              change={12}
              changeLabel="vs last month"
              icon={<Briefcase className="w-6 h-6" />}
              iconBgColor="var(--color-primary-100)"
              iconColor="var(--color-primary-600)"
            />
            <AnalyticsCard
              title="Active Users"
              value="1,834"
              change={23}
              changeLabel="vs last week"
              icon={<Users className="w-6 h-6" />}
              iconBgColor="var(--color-accent-100)"
              iconColor="var(--color-accent-600)"
            />
            <AnalyticsCard
              title="Apply Rate"
              value="34%"
              change={5}
              changeLabel="vs last month"
              icon={<TrendingUp className="w-6 h-6" />}
              iconBgColor="var(--color-success-100)"
              iconColor="var(--color-success-600)"
            />
            <AnalyticsCard
              title="Avg Match Score"
              value="82"
              change={0}
              changeLabel="no change"
              icon={<Target className="w-6 h-6" />}
              iconBgColor="var(--color-primary-100)"
              iconColor="var(--color-primary-600)"
            />
          </div>
        </section>

        {/* AI System Status */}
        <section className="mb-8">
          <h2 className="text-xl mb-6 flex items-center gap-2">
            <Bot className="w-6 h-6 text-[var(--color-primary-600)]" />
            AI System Status
          </h2>
          <div className="bg-white rounded-xl border-2 border-[var(--color-neutral-200)] p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Ollama Status */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${ollamaStatus?.available ? 'bg-[var(--color-success-500)]' : 'bg-[var(--color-error-500)]'} animate-pulse`} />
                    <span className="font-medium">Ollama (Llama AI)</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={checkOllamaStatus}
                    leftIcon={<RefreshCw className={`w-4 h-4 ${isCheckingOllama ? 'animate-spin' : ''}`} />}
                    disabled={isCheckingOllama}
                  >
                    Refresh
                  </Button>
                </div>
                <div className={`p-4 rounded-lg ${ollamaStatus?.available ? 'bg-[var(--color-success-50)]' : 'bg-[var(--color-error-50)]'}`}>
                  {ollamaStatus?.available ? (
                    <div className="space-y-2">
                      <p className="text-sm text-[var(--color-success-700)]">
                        ✓ Connected to local Ollama instance
                      </p>
                      <p className="text-sm text-[var(--color-neutral-700)]">
                        Available models: {ollamaStatus.models.join(', ') || 'Checking...'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-[var(--color-error-700)]">
                        ✗ Ollama not running
                      </p>
                      <p className="text-xs text-[var(--color-neutral-600)]">
                        Run <code className="bg-white px-1 py-0.5 rounded">ollama serve</code> to enable AI chat
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ML Engine Status */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--color-success-500)]" />
                  <span className="font-medium">ML Recommendation Engine</span>
                </div>
                <div className="p-4 rounded-lg bg-[var(--color-success-50)]">
                  <p className="text-sm text-[var(--color-success-700)]">
                    ✓ Active and processing recommendations
                  </p>
                  <p className="text-sm text-[var(--color-neutral-700)] mt-2">
                    Using: Skill matching, Interest alignment, Location scoring
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[var(--color-primary-50)] rounded-lg border border-[var(--color-primary-200)]">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[var(--color-primary-600)] mt-0.5" />
                <div>
                  <h4 className="font-medium text-[var(--color-primary-700)]">Hybrid AI System</h4>
                  <p className="text-sm text-[var(--color-neutral-700)] mt-1">
                    JobRasa uses a combination of ML-based matching algorithms for accurate recommendations 
                    and Llama-powered conversational AI for interactive user experiences. The ML engine 
                    works independently, while the chat features require Ollama to be running locally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Sectors */}
        <section className="mb-8">
          <h2 className="text-xl mb-6">Top Sectors</h2>
          <div className="bg-white rounded-xl border-2 border-[var(--color-neutral-200)] p-6">
            <div className="space-y-4">
              {[
                { sector: 'Technology', count: 78, percentage: 32 },
                { sector: 'Healthcare', count: 56, percentage: 23 },
                { sector: 'Education', count: 43, percentage: 17 },
                { sector: 'Government', count: 38, percentage: 15 },
                { sector: 'Non-Profit', count: 32, percentage: 13 }
              ].map((item, index) => (
                <div key={item.sector} className="flex items-center gap-4">
                  <div className="w-8 text-center font-semibold text-[var(--color-neutral-600)]">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.sector}</span>
                      <span className="text-sm text-[var(--color-neutral-600)]">
                        {item.count} internships ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--color-neutral-200)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-accent-500)]"
                        style={{ width: `${item.percentage * 3}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* CSV Upload */}
          <section>
            <h2 className="text-xl mb-6">Upload Internships</h2>
            <CSVUpload onUpload={(file) => console.log('Uploaded:', file.name)} />
            
            <div className="mt-4 bg-[var(--color-primary-50)] rounded-lg border border-[var(--color-primary-200)] p-4">
              <h3 className="text-sm font-semibold mb-2">CSV Format Requirements</h3>
              <ul className="text-sm text-[var(--color-neutral-700)] space-y-1">
                <li>• Columns: title, organization, location, isRemote, stipend</li>
                <li>• Optional: description, requirements, responsibilities</li>
                <li>• Use TRUE/FALSE for boolean fields</li>
              </ul>
            </div>
          </section>

          {/* Manual Add Form */}
          <section>
            <h2 className="text-xl mb-6">Add Single Internship</h2>
            <div className="bg-white rounded-xl border-2 border-[var(--color-neutral-200)] p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block font-medium mb-2">Title *</label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g., Software Engineering Intern"
                  className="w-full px-4 py-3 min-h-[48px] rounded-lg border-2 border-[var(--color-neutral-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                />
              </div>

              <div>
                <label htmlFor="organization" className="block font-medium mb-2">Organization *</label>
                <input
                  id="organization"
                  type="text"
                  placeholder="e.g., Department of Technology"
                  className="w-full px-4 py-3 min-h-[48px] rounded-lg border-2 border-[var(--color-neutral-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block font-medium mb-2">Location *</label>
                  <input
                    id="location"
                    type="text"
                    placeholder="City, State"
                    className="w-full px-4 py-3 min-h-[48px] rounded-lg border-2 border-[var(--color-neutral-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  />
                </div>

                <div>
                  <label htmlFor="stipend" className="block font-medium mb-2">Stipend</label>
                  <input
                    id="stipend"
                    type="text"
                    placeholder="$1,500/month"
                    className="w-full px-4 py-3 min-h-[48px] rounded-lg border-2 border-[var(--color-neutral-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer min-h-[40px]">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-[var(--color-neutral-400)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  />
                  <span>Remote</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer min-h-[40px]">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-2 border-[var(--color-neutral-400)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  />
                  <span>Beginner Friendly</span>
                </label>
              </div>

              <Button variant="accent" size="lg" fullWidth leftIcon={<Upload className="w-5 h-5" />}>
                Add Internship
              </Button>
            </div>
          </section>
        </div>

        {/* Recommendation Weights */}
        <section className="mb-8">
          <h2 className="text-xl mb-6">Tune Recommendation Algorithm</h2>
          <div className="bg-white rounded-xl border-2 border-[var(--color-neutral-200)] p-6 mb-4">
            <p className="text-[var(--color-neutral-700)] mb-6">
              Adjust how much each factor influences internship recommendations. Changes apply immediately to all users.
            </p>
            
            <div className="space-y-6">
              <WeightSlider
                label="Skills Weight"
                description="How much should skills matter in matching?"
                value={skillWeight}
                onChange={(val) => normalizeWeights('skill', val)}
                icon={<Code className="w-5 h-5" />}
              />

              <WeightSlider
                label="Interest Weight"
                description="How much should interests matter in matching?"
                value={interestWeight}
                onChange={(val) => normalizeWeights('interest', val)}
                icon={<Heart className="w-5 h-5" />}
              />

              <WeightSlider
                label="Location Weight"
                description="How much should location matter in matching?"
                value={locationWeight}
                onChange={(val) => normalizeWeights('location', val)}
                icon={<MapPin className="w-5 h-5" />}
              />
            </div>

            <div className="mt-6 pt-6 border-t-2 border-[var(--color-neutral-200)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Total Weight</p>
                  <p className="text-sm text-[var(--color-neutral-600)]">Must equal 100%</p>
                </div>
                <div className={`text-3xl font-bold ${
                  skillWeight + interestWeight + locationWeight === 100
                    ? 'text-[var(--color-success-600)]'
                    : 'text-[var(--color-error-600)]'
                }`}>
                  {skillWeight + interestWeight + locationWeight}%
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[var(--color-accent-50)] rounded-lg border border-[var(--color-accent-200)] p-4">
            <p className="text-sm">
              <strong>Note:</strong> Weight changes take effect immediately. Monitor the "Avg Match Score" metric to ensure quality remains high.
            </p>
          </div>
        </section>

        {/* Audit Log */}
        <section>
          <h2 className="text-xl mb-6">Recommendation Audit Log</h2>
          <div className="bg-white rounded-xl border-2 border-[var(--color-neutral-200)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--color-neutral-100)] border-b-2 border-[var(--color-neutral-200)]">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Internship</th>
                    <th className="px-6 py-4 text-left font-semibold">User ID</th>
                    <th className="px-6 py-4 text-left font-semibold">Match Score</th>
                    <th className="px-6 py-4 text-left font-semibold">Breakdown</th>
                    <th className="px-6 py-4 text-left font-semibold">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-neutral-200)]">
                  {auditLog.map((log) => (
                    <tr key={log.id} className="hover:bg-[var(--color-neutral-50)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium">{log.internshipTitle}</div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm bg-[var(--color-neutral-100)] px-2 py-1 rounded">
                          {log.userId}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="text-xl font-bold text-[var(--color-primary-700)]">
                            {log.matchScore}
                          </div>
                          <span className="text-sm text-[var(--color-neutral-600)]">/ 100</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-[var(--color-primary-600)]" />
                            <span>Skill: {log.breakdown.skill}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-[var(--color-accent-600)]" />
                            <span>Interest: {log.breakdown.interest}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[var(--color-success-600)]" />
                            <span>Location: {log.breakdown.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-[var(--color-neutral-600)]">
                          <Clock className="w-4 h-4" />
                          <span>{log.timestamp}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t-2 border-[var(--color-neutral-200)] p-4 text-center">
              <Button variant="ghost" size="sm">
                Load More Entries
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
