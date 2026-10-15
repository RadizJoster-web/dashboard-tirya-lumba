import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'outline';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-aqua text-white hover:bg-primary',
  ghost: 'bg-transparent text-ink border border-gray-200 hover:bg-azure',
  danger: 'bg-coral text-white hover:brightness-95',
  outline: 'bg-transparent text-primary border border-aqua hover:bg-azure',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-lg px-3.5 py-2 font-semibold cursor-pointer transition-all duration-300 ease-in-out disabled:opacity-50 ${variantClass[variant]} ${className}`}
      {...rest}
    />
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>{children}</div>
  );
}

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
      {error ? <span className="block text-coral text-[13px] font-medium mt-1">{error}</span> : null}
    </label>
  );
}

export function RoleTag({ children }: { children: ReactNode }) {
  return (
    <span className="bg-azure text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">
      {children}
    </span>
  );
}
