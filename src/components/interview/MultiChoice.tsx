import { Plus, X } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { ChoiceCard } from '@/components/interview/ChoiceCard';
import { cn } from '@/lib/utils';
import type { Question, QuestionOption } from '@/types';

interface MultiChoiceProps {
  question: Question;
  value: string[];
  onChange: (value: string[]) => void;
}

export function MultiChoice({ question, value, onChange }: MultiChoiceProps) {
  const [custom, setCustom] = useState('');
  const options = question.options ?? [];
  const customValues = value.filter((item) => !options.some((option) => option.id === item));

  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
  };

  const addCustom = () => {
    const label = custom.trim();
    if (!label || value.includes(label)) return;
    onChange([...value, label]);
    setCustom('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      addCustom();
    }
  };

  return (
    <div className="space-y-4">
      {/* Options Grid */}
      <div className={cn('grid gap-3', question.columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1')}>
        {options.map((option: QuestionOption, index) => (
          <ChoiceCard
            key={option.id}
            option={option}
            multi
            selected={value.includes(option.id)}
            shortcut={String.fromCharCode(65 + index)}
            onClick={() => toggle(option.id)}
          />
        ))}
      </div>

      {/* Custom Selected Chips */}
      {customValues.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {customValues.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/15 px-3.5 py-1 text-xs font-medium text-pink-300 shadow-sm"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((entry) => entry !== item))}
                className="rounded-full p-0.5 transition hover:bg-pink-500/30 text-pink-300"
                aria-label={`Hapus ${item}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      {/* Custom Feature Input (Outer R = 16px, padding = 6px -> Inner Button R = 10px) */}
      {question.allowCustom ? (
        <div className="flex items-center gap-2 rounded-[16px] border border-dashed border-white/15 bg-white/[0.02] p-1.5 pl-4 transition-colors focus-within:border-white/30">
          <Plus size={15} className="text-white/40" />
          <input
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder={question.id === 'features' ? 'Tambahkan fitur sendiri...' : 'Tambahkan lainnya...'}
            className="min-w-0 flex-1 bg-transparent py-1.5 text-xs sm:text-sm text-white outline-none placeholder:text-white/30 font-sans"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!custom.trim()}
            // Inner R = 10px (16px - 6px = 10px following Outer R = Inner R + Padding)
            className="h-8 px-4 rounded-[10px] bg-white/[0.08] hover:bg-white/15 text-white/90 text-xs font-semibold transition active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
          >
            Tambah
          </button>
        </div>
      ) : null}
    </div>
  );
}
