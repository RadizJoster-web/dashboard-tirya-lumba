import { useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Field({ label, error, id, type = 'text', ...rest }: FieldProps) {
  const generatedId = useId();
  const [visible, setVisible] = useState(false);
  const inputId = id ?? generatedId;
  const isPassword = type === 'password';

  return (
    <div className="mb-3">
      <label htmlFor={inputId} className="block font-semibold">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={inputId}
          {...rest}
          type={isPassword && visible ? 'text' : type}
          className={`block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium transition-all duration-300 ease-in-out focus:border-aqua focus:ring-2 focus:ring-aqua/40 focus:outline-none ${isPassword ? 'pr-12' : ''}`}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Sembunyikan password' : 'Tampilkan password'}
            aria-pressed={visible}
            className="absolute top-1/2 right-0 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-slate-500 transition-colors hover:bg-azure hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua"
          >
            {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        ) : null}
      </div>
      {error ? <span className="mt-1 block text-[13px] font-medium text-[#B3341F]">{error}</span> : null}
    </div>
  );
}
