import type { ReactNode } from 'react';

export interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Card({
  title,
  subtitle,
  action,
  children,
  footer,
  className = '',
  bodyClassName = '',
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-2xs transition-shadow duration-200 ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
          <div>
            {title && (
              <h3 className="font-display text-base font-bold text-[#1D3557]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs font-normal text-slate-500">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={title || subtitle || action ? `p-5 ${bodyClassName}` : `p-5 ${bodyClassName}`}>
        {children}
      </div>
      {footer && (
        <div className="border-t border-gray-100 bg-slate-50/50 px-5 py-3 rounded-b-xl">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
