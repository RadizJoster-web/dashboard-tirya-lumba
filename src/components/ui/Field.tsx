import type { InputHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Field({ label, error, id, ...rest }: FieldProps) {
  return (
    <label htmlFor={id} className="block font-semibold mb-3">
      {label}
      <input
        id={id}
        className="mt-1 block w-full font-medium bg-white border border-gray-300 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out focus:outline-none focus:border-aqua focus:ring-2 focus:ring-aqua/40"
        {...rest}
      />
      {error ? <span className="block text-[#B3341F] text-[13px] font-medium mt-1">{error}</span> : null}
    </label>
  );
}
