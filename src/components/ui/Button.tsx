import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'outline';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-[#005f8f]',
  ghost: 'bg-transparent text-ink border border-gray-200 hover:bg-azure',
  danger: 'bg-[#B3341F] text-white hover:brightness-95',
  outline: 'bg-transparent text-primary border border-aqua hover:bg-azure',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-lg px-3.5 py-2 min-h-[44px] inline-flex items-center justify-center font-semibold cursor-pointer transition-all duration-300 ease-in-out disabled:opacity-50 ${variantClass[variant]} ${className}`}
      {...rest}
    />
  );
}
