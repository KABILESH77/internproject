import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, Briefcase, Award } from 'lucide-react';
import { Button } from '../components/Button';
import { InternshipCard } from '../components/InternshipCard';
import { InternshipDetailSlideOver } from '../components/InternshipDetailSlideOver';
import { mockInternships } from '../data/mockInternships';
import { CopyVariant } from '../data/microcopy';
import { OnboardingData } from '../components/OnboardingModal';

interface SearchPageProps {
  onSaveInternship: (id: string) => void;
  savedInternshipIds: string[];
  copyVariant: CopyVariant;
  userProfile: OnboardingData | null;
}

type SortOption = 'best-match' | 'nearest' | 'newest';

export function SearchPage({
  onSaveInternship,
  savedInternshipIds,
  copyVariant,
  userProfile
}: SearchPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);
  const [showBeginnerOnly, setShowBeginnerOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('best-match');
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null);

  const sectors = ['Technology', 'Healthcare', 'Education', 'Finance', 'Non-Profit', 'Government', 'Media & Arts', 'Environment'];
  const cities = ['All Locations', 'Washington, DC', 'San Francisco, CA', 'New York, NY', 'Boston, MA', 'Austin, TX'];

  // Filter and search logic
  const filteredInternships = mockInternships.filter(internship => {
    const matchesSearch = searchQuery === '' || 
      internship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      internship.organization.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRemote = !showRemoteOnly || internship.isRemote;
    const matchesBeginner = !showBeginnerOnly || internship.isBeginner;
    const matchesCity = !selectedCity || selectedCity === 'All Locations' || internship.location.includes(selectedCity);
    
    return matchesSearch && matchesRemote && matchesBeginner && matchesCity;
  });

  const selectedDetail = mockInternships.find(i => i.id === selectedInternship) || null;
  const activeFilterCount = [
    selectedSector.length > 0,
    selectedCity && selectedCity !== 'All Locations',
    showRemoteOnly,
    showBeginnerOnly
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedSector([]);
    setSelectedCity('');
    setShowRemoteOnly(false);
    setShowBeginnerOnly(false);
  };

  const toggleSector = (sector: string) => {
    if (selectedSector.includes(sector)) {
      setSelectedSector(selectedSector.filter(s => s !== sector));
    } else {
      setSelectedSector([...selectedSector, sector]);
    }
  };

  return (
    <div style={{ padding: '32px 0', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ marginBottom: '24px', color: '#1f2937', fontSize: '1.75rem', fontWeight: '700' }}>Search Internships</h1>

          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', color: '#9ca3af' }} aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by title, organization, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '56px',
                  paddingRight: '16px',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  borderRadius: '12px',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  fontSize: '16px',
                  color: '#1f2937',
                  outline: 'none',
                }}
                aria-label="Search internships"
              />
            </div>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal className="w-5 h-5" />}
              className="lg:min-w-[160px] relative"
            >
              Filters
              {activeFilterCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#ff9500', color: 'white', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '24px', marginBottom: '32px' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 style={{ color: '#1f2937', fontSize: '1.125rem', fontWeight: '600' }}>Filter Results</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  style={{ color: '#0d9494', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sector Filter */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', marginBottom: '12px', color: '#374151' }}>
                  <Briefcase style={{ width: '20px', height: '20px', color: '#0d9494' }} aria-hidden="true" />
                  Sector
                </label>
                <div className="space-y-2">
                  {sectors.slice(0, 4).map(sector => (
                    <label key={sector} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', minHeight: '40px', color: '#4b5563' }}>
                      <input
                        type="checkbox"
                        checked={selectedSector.includes(sector)}
                        onChange={() => toggleSector(sector)}
                        style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#0d9494' }}
                      />
                      <span>{sector}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div>
                <label htmlFor="city-filter" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', marginBottom: '12px', color: '#374151' }}>
                  <MapPin style={{ width: '20px', height: '20px', color: '#0d9494' }} aria-hidden="true" />
                  Location
                </label>
                <select
                  id="city-filter"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', minHeight: '48px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#1f2937', fontSize: '16px' }}
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Quick Filters */}
              <div>
                <label style={{ fontWeight: '500', marginBottom: '12px', display: 'block', color: '#374151' }}>Quick Filters</label>
                <div className="space-y-3">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', minHeight: '40px', color: '#4b5563' }}>
                    <input
                      type="checkbox"
                      checked={showRemoteOnly}
                      onChange={(e) => setShowRemoteOnly(e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#0d9494' }}
                    />
                    <span>Remote only</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', minHeight: '40px', color: '#4b5563' }}>
                    <input
                      type="checkbox"
                      checked={showBeginnerOnly}
                      onChange={(e) => setShowBeginnerOnly(e.target.checked)}
                      style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#0d9494' }}
                    />
                    <span>
                      <Award className="w-4 h-4 inline mr-1" aria-hidden="true" />
                      Beginner friendly
                    </span>
                  </label>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label htmlFor="sort-select" style={{ fontWeight: '500', marginBottom: '12px', display: 'block', color: '#374151' }}>Sort By</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  style={{ width: '100%', padding: '12px 16px', minHeight: '48px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#1f2937', fontSize: '16px' }}
                >
                  <option value="best-match">Best Match</option>
                  <option value="nearest">Nearest First</option>
                  <option value="newest">Newly Posted</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-6">
          <p style={{ color: '#4b5563' }}>
            Showing <span style={{ fontWeight: '600', color: '#1f2937' }}>{filteredInternships.length}</span> internship{filteredInternships.length !== 1 ? 's' : ''}
            {searchQuery && <> for "<span style={{ fontWeight: '600', color: '#1f2937' }}>{searchQuery}</span>"</>}
          </p>
        </div>

        {/* Internships Grid */}
        {filteredInternships.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {filteredInternships.map((internship) => (
              <InternshipCard
                key={internship.id}
                internship={internship}
                variant="default"
                onSave={onSaveInternship}
                onViewDetails={setSelectedInternship}
                onApply={(id) => navigate(`/apply/${id}`)}
                isSaved={savedInternshipIds.includes(internship.id)}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '64px 0', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
            <Search style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#9ca3af' }} />
            <h3 style={{ marginBottom: '8px', color: '#1f2937', fontSize: '1.25rem', fontWeight: '600' }}>No internships found</h3>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Try adjusting your filters or search query
            </p>
            {activeFilterCount > 0 && (
              <Button variant="primary" onClick={clearFilters}>
                Clear All Filters
              </Button>
            )}
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
