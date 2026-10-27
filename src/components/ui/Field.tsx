import { useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Field({
  label,
  error,
  hint,
  id,
  type = 'text',
  className = '',
  ...rest
}: FieldProps) {
  const generatedId = useId();
  const [visible, setVisible] = useState(false);
  const inputId = id ?? generatedId;
  const isPassword = type === 'password';

  return (
    <div className={`mb-3.5 ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
        >
          {label}
        </label>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      <div className="relative">
        <input
          id={inputId}
          {...rest}
          type={isPassword && visible ? 'text' : type}
          className={`block w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#1D3557] placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#00B4D8] focus:border-transparent ${
            error ? 'border-[#FF6F59]' : 'border-gray-300'
          } ${isPassword ? 'pr-11' : ''}`}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
            aria-pressed={visible}
            className="absolute top-1/2 right-1.5 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
          >
            {visible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
          </button>
        ) : null}
      </div>
      {error ? (
        <span className="mt-1 block text-xs font-medium text-[#FF6F59]">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export default Field;
