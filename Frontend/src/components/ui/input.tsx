import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs uppercase tracking-widest text-muted font-black">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          bg-surface-raised border rounded px-3 py-2.5 text-text text-sm
          focus:outline-none focus:border-gold transition-colors placeholder-muted
          ${error ? 'border-red-500' : 'border-muted-border'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
    </div>
  );
}
