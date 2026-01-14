import React, { useState } from 'react';

interface WeightSliderProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
}

export function WeightSlider({
  label,
  description,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  icon
}: WeightSliderProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="bg-white rounded-xl border-2 border-[var(--color-neutral-200)] p-6">
      <div className="flex items-start gap-3 mb-4">
        {icon && (
          <div className="flex-shrink-0 p-2 rounded-lg bg-[var(--color-primary-100)] text-[var(--color-primary-600)]" aria-hidden="true">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <label htmlFor={`slider-${label}`} className="font-semibold block mb-1">
            {label}
          </label>
          {description && (
            <p className="text-sm text-[var(--color-neutral-600)]">{description}</p>
          )}
        </div>
        <div className="flex-shrink-0 min-w-[60px] text-right">
          <span className="text-2xl font-bold text-[var(--color-primary-700)]">
            {value}
          </span>
          <span className="text-sm text-[var(--color-neutral-600)]">%</span>
        </div>
      </div>

      <div className="relative">
        {/* Track Background */}
        <div className="h-3 bg-[var(--color-neutral-200)] rounded-full overflow-hidden">
          {/* Filled Track */}
          <div
            className="h-full bg-gradient-to-r from-[var(--color-primary-500)] to-[var(--color-accent-500)] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${percentage}%` }}
            aria-hidden="true"
          />
        </div>

        {/* Slider Input */}
        <input
          id={`slider-${label}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer
            focus:outline-none
          `}
          aria-label={`${label} weight: ${value}%`}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />

        {/* Custom Thumb */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300
            ${isFocused ? 'scale-125' : 'scale-100'}
          `}
          style={{ left: `calc(${percentage}% - 12px)` }}
          aria-hidden="true"
        >
          <div 
            className={`
              w-6 h-6 rounded-full bg-white border-3 shadow-lg
              ${isFocused 
                ? 'border-[var(--color-accent-500)]' 
                : 'border-[var(--color-primary-600)]'
              }
            `}
          />
        </div>
      </div>

      {/* Value Markers */}
      <div className="flex justify-between mt-2 text-xs text-[var(--color-neutral-500)]">
        <span>{min}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
}
