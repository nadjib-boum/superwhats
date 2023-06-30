import { useEffect, useState } from "react";

type ProgressCircleProps = {
  size: number;
  progress: number;
  trackWidth: number;
  trackColor: string;
  indicatorWidth: number;
  indicatorColor: string;
  indicatorCap: "inherit" | "round" | "butt" | "square" | undefined;
  label: string;
  labelColor: string;
  spinnerMode: boolean;
  spinnerSpeed: number;
};

const ProgressCircle: React.FC<Partial<ProgressCircleProps>> = (props) => {
  let {
    size = 180,
    progress = 0,
    trackWidth = 5,
    trackColor = `#ddd`,
    indicatorWidth = 5,
    indicatorColor = `#07c`,
    indicatorCap = `round`,
    label = `Loading...`,
    labelColor = `#111`,
    spinnerMode = false,
    spinnerSpeed = 1,
  } = props;

  const center = size / 2,
    radius =
      center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth),
    dashArray = 2 * Math.PI * radius,
    dashOffset = dashArray * ((100 - progress) / 100);

  let hideLabel = size < 100 || !label.length || spinnerMode ? true : false;

  return (
    <div className="progress-circle">
      <div className="svg-pi-wrapper" style={{ width: size, height: size }}>
        <svg className="svg-pi" style={{ width: size, height: size }}>
          <circle
            className="svg-pi-track"
            cx={center}
            cy={center}
            fill="transparent"
            r={radius}
            stroke={trackColor}
            strokeWidth={trackWidth}
          />
          <circle
            className={`svg-pi-indicator ${
              spinnerMode ? "svg-pi-indicator--spinner" : ""
            }`}
            style={{ animationDuration: `${spinnerSpeed * 1000}` }}
            cx={center}
            cy={center}
            fill="transparent"
            r={radius}
            stroke={indicatorColor}
            strokeWidth={indicatorWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap={indicatorCap}
          />
        </svg>

        {!hideLabel && (
          <div className="svg-pi-label" style={{ color: labelColor }}>
            {!spinnerMode && (
              <span className="svg-pi-label__progress">
                {`${progress > 100 ? 100 : progress}%`}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressCircle;
