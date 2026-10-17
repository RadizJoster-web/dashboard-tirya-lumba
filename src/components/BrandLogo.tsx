interface BrandLogoProps {
  sz?: number;
  className?: string;
}

/** Logo Tirya Lumba (subset shape besar dari logo hasil VTracer, aman untuk ukuran kecil). */
export default function BrandLogo({ sz = 28, className = '' }: BrandLogoProps) {
  return (
    <img
      src="/logo-mark.svg"
      alt=""
      aria-hidden="true"
      width={sz}
      height={sz}
      draggable={false}
      className={`shrink-0 select-none ${className}`}
    />
  );
}
