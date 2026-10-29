import type { ReactNode } from 'react';

interface RoleTagProps {
  children?: ReactNode;
  role?: string;
  className?: string;
}

export function RoleTag({ children, role, className = '' }: RoleTagProps) {
  const content = children ?? role;
  const str = typeof content === 'string' ? content.toLowerCase() : '';

  let styleClasses = 'bg-[#E0FBFC] text-[#0077B6] border-[#00B4D8]/20';

  if (str.includes('instructor') || str.includes('pelatih') || str.includes('guru')) {
    styleClasses = 'bg-[#F3E8FF] text-[#6B21A8] border-[#A855F7]/25';
  } else if (str.includes('admin') || str.includes('pusat')) {
    styleClasses = 'bg-[#E0E7FF] text-[#3730A3] border-[#6366F1]/25';
  } else if (str.includes('pengelola') || str.includes('pool_manager') || str.includes('manager')) {
    styleClasses = 'bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]/25';
  } else if (str.includes('student') || str.includes('murid') || str.includes('siswa')) {
    styleClasses = 'bg-[#E0FBFC] text-[#0077B6] border-[#00B4D8]/25';
  }

  return (
    <span
      className={`anim-scale inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-normal transition-colors ${styleClasses} ${className}`}
    >
      {content}
    </span>
  );
}

export default RoleTag;
