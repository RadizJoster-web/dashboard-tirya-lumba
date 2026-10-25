import BrandLogo from '../BrandLogo';

interface SidebarToggleButtonProps {
  onToggle: () => void;
}

export default function SidebarToggleButton({ onToggle }: SidebarToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label="Tampilkan sidebar"
      title="Tampilkan sidebar"
      className="fixed top-4 left-4 z-30 hidden h-11 w-11 place-items-center rounded-xl cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 focus-visible:outline-2 outline-offset-2 outline-aqua min-[861px]:grid"
    >
      <BrandLogo sz={30} className="drop-shadow-[0_2px_6px_rgba(16,60,92,0.18)]" />
    </button>
  );
}
