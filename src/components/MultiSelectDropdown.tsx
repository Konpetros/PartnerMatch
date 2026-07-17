import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  required?: boolean;
  maxSelections?: number;
}

export default function MultiSelectDropdown({ label, options, selected, onChange, required = false, maxSelections }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggle = (option: string) => {
    const isSelected = selected.includes(option);
    if (!isSelected && maxSelections !== undefined && selected.length >= maxSelections) {
      return;
    }
    onChange(isSelected ? selected.filter((o) => o !== option) : [...selected, option]);
  };

  const summary =
    selected.length === 0
      ? 'Select...'
      : selected.length <= 2
      ? selected.join(', ')
      : `${selected.length} selected`;

  const labelSuffix = required
    ? ` * (Select at least 1${maxSelections ? `, up to ${maxSelections}` : ''})`
    : maxSelections
    ? ` (Optional, up to ${maxSelections})`
    : ' (Optional)';

  return (
    <div className="space-y-1" ref={ref}>
      <span className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
        {label}
        {labelSuffix}
      </span>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-brand-primary transition-all cursor-pointer text-left"
        >
          <span className={`truncate ${selected.length === 0 ? 'text-slate-400 font-medium' : ''}`}>{summary}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-y-auto p-2">
            {options.map((option) => {
              const isChecked = selected.includes(option);
              const atCap = !isChecked && maxSelections !== undefined && selected.length >= maxSelections;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={atCap}
                  onClick={() => toggle(option)}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all ${
                    atCap
                      ? 'opacity-40 cursor-not-allowed text-slate-400'
                      : isChecked
                      ? 'bg-blue-50 text-brand-primary cursor-pointer'
                      : 'text-slate-600 hover:bg-slate-50 cursor-pointer'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-brand-primary border-brand-primary' : 'border-slate-300'}`}>
                    {isChecked && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                  </div>
                  <span className="truncate">{option}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
