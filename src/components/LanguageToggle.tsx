import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export type Language = 'en' | 'es' | 'hi' | 'simple';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'simple', name: 'Simple English', nativeName: 'Simple English', flag: '🔤' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

interface LanguageToggleProps {
  currentLanguage?: Language;
  onLanguageChange?: (language: Language) => void;
  className?: string;
}

export function LanguageToggle({ 
  currentLanguage = 'en', 
  onLanguageChange,
  className = '' 
}: LanguageToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleSelect = (language: Language) => {
    onLanguageChange?.(language);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-lg bg-white border-2 border-[var(--color-neutral-300)] text-[var(--color-neutral-900)] hover:border-[var(--color-primary-500)] focus:outline-none focus:ring-3 focus:ring-[var(--color-primary-500)] focus:ring-offset-2 transition-colors"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-5 h-5 text-[var(--color-primary-600)]" aria-hidden="true" />
        <span className="text-lg" aria-hidden="true">{selected.flag}</span>
        <span className="font-medium">{selected.nativeName}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          aria-hidden="true" 
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <ul
            role="listbox"
            className="absolute right-0 mt-2 w-64 bg-white border-2 border-[var(--color-neutral-300)] rounded-lg shadow-lg z-20 py-2"
            aria-label="Language options"
          >
            {languages.map((lang) => (
              <li key={lang.code} role="option" aria-selected={lang.code === currentLanguage}>
                <button
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`
                    w-full text-left px-4 py-3 flex items-center gap-3 min-h-[48px]
                    hover:bg-[var(--color-primary-50)] transition-colors
                    ${lang.code === currentLanguage ? 'bg-[var(--color-primary-100)] font-semibold' : ''}
                    focus:outline-none focus:bg-[var(--color-primary-100)]
                  `}
                >
                  <span className="text-2xl" aria-hidden="true">{lang.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-sm text-[var(--color-neutral-600)]">{lang.name}</div>
                  </div>
                  {lang.code === currentLanguage && (
                    <span className="text-[var(--color-primary-600)]" aria-label="Selected">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
