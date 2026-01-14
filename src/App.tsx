import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Bookmark, 
  HelpCircle, 
  Settings, 
  Menu, 
  X,
  Sparkles,
  Target
} from 'lucide-react';
import { HomePage } from './pages/HomePage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { SearchPage } from './pages/SearchPage';
import { SavedPage } from './pages/SavedPage';
import { HelpPage } from './pages/HelpPage';
import { AdminPage } from './pages/AdminPage';
import { LanguageToggle, Language } from './components/LanguageToggle';
import { OnboardingModal, OnboardingData } from './components/OnboardingModal';
import { Toast, useToast } from './components/Toast';
import { CopyVariant } from './data/microcopy';

type Page = 'home' | 'recommendations' | 'search' | 'saved' | 'help' | 'admin';
type Theme = 'default' | 'high-contrast' | 'warm';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentTheme, setCurrentTheme] = useState<Theme>('default');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [copyVariant, setCopyVariant] = useState<CopyVariant>('default');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [savedInternshipIds, setSavedInternshipIds] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<OnboardingData | null>(null);

  const { toast, showToast, closeToast } = useToast();

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    // Set copy variant to 'simple' for Simple English
    if (language === 'simple') {
      setCopyVariant('simple');
    } else {
      setCopyVariant('default');
    }
  };

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    setUserProfile(data);
    setHasCompletedOnboarding(true);
    setCurrentPage('recommendations');
    showToast('success', 'Profile created! Here are your matches.', true);
  };

  const handleSaveInternship = (id: string) => {
    if (savedInternshipIds.includes(id)) {
      setSavedInternshipIds(savedInternshipIds.filter(i => i !== id));
      showToast('info', 'Internship removed from saved');
    } else {
      setSavedInternshipIds([...savedInternshipIds, id]);
      showToast('success', 'Internship saved!');
    }
  };

  const navigation = [
    { id: 'home' as Page, label: 'Home', icon: Home },
    { id: 'recommendations' as Page, label: 'For You', icon: Sparkles },
    { id: 'search' as Page, label: 'Search', icon: Search },
    { id: 'saved' as Page, label: 'Saved', icon: Bookmark, badge: savedInternshipIds.length },
    { id: 'help' as Page, label: 'Help', icon: HelpCircle },
    { id: 'admin' as Page, label: 'Admin', icon: Settings },
  ];

  const getThemeClass = () => {
    if (currentTheme === 'high-contrast') return 'theme-high-contrast';
    if (currentTheme === 'warm') return 'theme-warm';
    return '';
  };

  const renderPage = () => {
    const commonProps = {
      onSaveInternship: handleSaveInternship,
      savedInternshipIds,
      copyVariant,
      userProfile
    };

    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onStartOnboarding={() => setIsOnboardingOpen(true)}
            onGuestBrowse={() => setCurrentPage('search')}
            hasCompletedOnboarding={hasCompletedOnboarding}
            {...commonProps}
          />
        );
      case 'recommendations':
        return <RecommendationsPage {...commonProps} />;
      case 'search':
        return <SearchPage {...commonProps} />;
      case 'saved':
        return <SavedPage {...commonProps} />;
      case 'help':
        return <HelpPage copyVariant={copyVariant} />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage {...commonProps} onStartOnboarding={() => setIsOnboardingOpen(true)} onGuestBrowse={() => setCurrentPage('search')} hasCompletedOnboarding={hasCompletedOnboarding} />;
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClass()}`}>
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b-2 border-[var(--color-neutral-200)] shadow-sm">
        <div className="container">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-accent-500)] flex items-center justify-center">
                <Target className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-[var(--color-primary-700)]">VibeMatch</h1>
                <p className="text-xs text-[var(--color-neutral-600)]">Internships</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2" role="navigation" aria-label="Main navigation">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all min-h-[44px]
                      ${currentPage === item.id
                        ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
                        : 'text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]'
                      }
                      focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]
                    `}
                    aria-current={currentPage === item.id ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-accent-500)] text-white text-xs flex items-center justify-center font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Theme & Language Controls */}
            <div className="hidden md:flex items-center gap-3">
              <select
                value={currentTheme}
                onChange={(e) => handleThemeChange(e.target.value as Theme)}
                className="px-3 py-2 min-h-[44px] rounded-lg border-2 border-[var(--color-neutral-300)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                aria-label="Select color theme"
              >
                <option value="default">Default</option>
                <option value="high-contrast">High Contrast</option>
                <option value="warm">Warm</option>
              </select>

              <LanguageToggle
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-neutral-100)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-[var(--color-neutral-200)] bg-white">
            <nav className="container py-4 space-y-2" role="navigation" aria-label="Mobile navigation">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all min-h-[52px]
                      ${currentPage === item.id
                        ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
                        : 'text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]'
                      }
                      focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]
                    `}
                    aria-current={currentPage === item.id ? 'page' : undefined}
                  >
                    <Icon className="w-6 h-6" aria-hidden="true" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="w-6 h-6 rounded-full bg-[var(--color-accent-500)] text-white text-sm flex items-center justify-center font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-4 border-t-2 border-[var(--color-neutral-200)] space-y-3">
                <div>
                  <label htmlFor="mobile-theme" className="block text-sm font-medium mb-2">
                    Theme
                  </label>
                  <select
                    id="mobile-theme"
                    value={currentTheme}
                    onChange={(e) => handleThemeChange(e.target.value as Theme)}
                    className="w-full px-3 py-2 min-h-[44px] rounded-lg border-2 border-[var(--color-neutral-300)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)]"
                  >
                    <option value="default">Default</option>
                    <option value="high-contrast">High Contrast</option>
                    <option value="warm">Warm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Language
                  </label>
                  <LanguageToggle
                    currentLanguage={currentLanguage}
                    onLanguageChange={handleLanguageChange}
                  />
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-80px)]">
        {renderPage()}
      </main>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          isVisible={true}
          onClose={closeToast}
          showFeedback={toast.showFeedback}
          onFeedback={(useful) => console.log('Feedback:', useful)}
        />
      )}
    </div>
  );
}

export default App;
