import React, { useState } from 'react';
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
    <div className="py-8 min-h-screen bg-[var(--color-neutral-50)]">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-6">Search Internships</h1>

          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-[var(--color-neutral-500)]" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by title, organization, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-4 py-4 min-h-[56px] rounded-xl border-2 border-[var(--color-neutral-300)] bg-white text-lg focus:outline-none focus:ring-3 focus:ring-[var(--color-primary-500)] focus:border-[var(--color-primary-500)]"
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
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--color-accent-500)] text-white text-sm flex items-center justify-center font-semibold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border-2 border-[var(--color-neutral-300)] p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3>Filter Results</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] font-medium focus:outline-none focus:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sector Filter */}
              <div>
                <label className="flex items-center gap-2 font-medium mb-3">
                  <Briefcase className="w-5 h-5 text-[var(--color-primary-600)]" aria-hidden="true" />
                  Sector
                </label>
                <div className="space-y-2">
                  {sectors.slice(0, 4).map(sector => (
                    <label key={sector} className="flex items-center gap-2 cursor-pointer min-h-[40px]">
                      <input
                        type="checkbox"
                        checked={selectedSector.includes(sector)}
                        onChange={() => toggleSector(sector)}
                        className="w-5 h-5 rounded border-2 border-[var(--color-neutral-400)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-500)] cursor-pointer"
                      />
                      <span>{sector}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div>
                <label htmlFor="city-filter" className="flex items-center gap-2 font-medium mb-3">
                  <MapPin className="w-5 h-5 text-[var(--color-primary-600)]" aria-hidden="true" />
                  Location
                </label>
                <select
                  id="city-filter"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 min-h-[48px] rounded-lg border-2 border-[var(--color-neutral-300)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Quick Filters */}
              <div>
                <label className="font-medium mb-3 block">Quick Filters</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer min-h-[40px]">
                    <input
                      type="checkbox"
                      checked={showRemoteOnly}
                      onChange={(e) => setShowRemoteOnly(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-[var(--color-neutral-400)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-500)] cursor-pointer"
                    />
                    <span>Remote only</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer min-h-[40px]">
                    <input
                      type="checkbox"
                      checked={showBeginnerOnly}
                      onChange={(e) => setShowBeginnerOnly(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-[var(--color-neutral-400)] text-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-500)] cursor-pointer"
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
                <label htmlFor="sort-select" className="font-medium mb-3 block">Sort By</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-3 min-h-[48px] rounded-lg border-2 border-[var(--color-neutral-300)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
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
          <p className="text-[var(--color-neutral-700)]">
            Showing <span className="font-semibold">{filteredInternships.length}</span> internship{filteredInternships.length !== 1 ? 's' : ''}
            {searchQuery && <> for "<span className="font-semibold">{searchQuery}</span>"</>}
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
                onApply={(id) => window.open(`/apply/${id}`, '_blank')}
                isSaved={savedInternshipIds.includes(internship.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-[var(--color-neutral-200)]">
            <Search className="w-16 h-16 mx-auto mb-4 text-[var(--color-neutral-400)]" />
            <h3 className="mb-2">No internships found</h3>
            <p className="text-[var(--color-neutral-700)] mb-6">
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
        onApply={(id) => window.open(`/apply/${id}`, '_blank')}
        onSave={onSaveInternship}
        isSaved={selectedInternship ? savedInternshipIds.includes(selectedInternship) : false}
      />
    </div>
  );
}
