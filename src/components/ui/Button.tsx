import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'outline' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#00B4D8] text-white hover:bg-[#0077B6] shadow-xs active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#00B4D8]/50',
  secondary:
    'bg-white text-[#1D3557] border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-2xs active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#0077B6]/30',
  ghost:
    'bg-white text-[#1D3557] border border-gray-200 hover:bg-[#E0FBFC]/50 hover:text-[#0077B6] hover:border-[#0077B6]/30 shadow-2xs active:scale-[0.99]',
  danger:
    'bg-[#FF6F59] text-white hover:bg-[#E0533C] shadow-xs active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[#FF6F59]/50',
  outline:
    'bg-transparent text-[#0077B6] border border-[#00B4D8] hover:bg-[#E0FBFC]/60 active:scale-[0.99]',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg min-h-[34px] gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg min-h-[40px] gap-2',
  lg: 'px-5 py-2.5 text-base rounded-xl min-h-[46px] gap-2.5',
  icon: 'h-9 w-9 p-0 rounded-lg shrink-0 justify-center',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center font-medium tracking-normal transition-all duration-200 ease-in-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none select-none focus:outline-hidden ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
