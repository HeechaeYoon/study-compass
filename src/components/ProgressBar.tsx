type ProgressBarProps = {
  current: number;
  total: number;
  label?: string;
};

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="progress-row" aria-label={label ?? `진행률 ${current} / ${total}`}>
      <div className="progress-track" aria-hidden="true">
        <span className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <strong className="progress-count">
        {current} / {total}
      </strong>
    </div>
  );
}
