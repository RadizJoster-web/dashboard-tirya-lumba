interface StepperProps {
  steps: string[];
  step: number; // zero-based
}

export default function Stepper({ steps, step }: StepperProps) {
  return (
    <ol className="mb-5 flex gap-4" aria-label="Langkah pendaftaran">
      {steps.map((s, i) => {
        const done = i < step;
        const current = i === step;
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              aria-current={current ? 'step' : undefined}
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-bold transition-colors duration-300 ${
                done || current ? 'bg-primary text-white' : 'bg-basedash text-slate-500'
              }`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span className={current ? 'text-ink font-semibold' : 'text-slate-500'}>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}
