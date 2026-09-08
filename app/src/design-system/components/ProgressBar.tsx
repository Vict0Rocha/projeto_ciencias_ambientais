export function ProgressBar({
  percent,
  color = 'var(--color-accent-lime)',
  height = 7,
}: {
  percent: number;
  color?: string;
  height?: number;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        height,
        borderRadius: 100,
        background: 'var(--color-progress-track)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: '100%',
          borderRadius: 100,
          background: color,
          transition: 'width 220ms ease',
        }}
      />
    </div>
  );
}
