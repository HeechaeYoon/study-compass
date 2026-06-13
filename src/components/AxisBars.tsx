import { AXES } from "../data/questions";
import { AXIS_COLORS, AXIS_DESCRIPTIONS, AXIS_NAMES } from "../data/learningTypes";
import type { AxisScores, AxisLabels } from "../types";

type AxisBarsProps = {
  scores: AxisScores;
  labels: AxisLabels;
  compact?: boolean;
};

export function AxisBars({ scores, labels, compact = false }: AxisBarsProps) {
  return (
    <div className={compact ? "axis-bars axis-bars--compact" : "axis-bars"}>
      {AXES.map((axis) => (
        <div className="axis-row" key={axis}>
          <div className="axis-meta">
            <span>{AXIS_NAMES[axis]}</span>
            {!compact && <small>{AXIS_DESCRIPTIONS[axis]}</small>}
          </div>
          <div className="axis-meter" aria-hidden="true">
            <span
              className="axis-meter__fill"
              style={{ width: `${scores[axis]}%`, backgroundColor: AXIS_COLORS[axis] }}
            />
          </div>
          <span className={`axis-label axis-label--${labels[axis].replace(" ", "-")}`}>
            {labels[axis]}
          </span>
        </div>
      ))}
    </div>
  );
}
