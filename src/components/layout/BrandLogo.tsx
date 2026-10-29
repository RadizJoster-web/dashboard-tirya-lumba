interface BrandLogoProps {
  sz?: number;
  className?: string;
}

/** Logo Tirya Lumba */
export default function BrandLogo({ sz = 28, className = '' }: BrandLogoProps) {
  return (
    <img
      src="/favicon.png"
      alt="Tirya Lumba"
      width={sz}
      height={sz}
      draggable={false}
      className={`shrink-0 select-none object-contain rounded-md ${className}`}
    />
  );
}
