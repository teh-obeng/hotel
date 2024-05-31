import { useCallback, useEffect, useRef } from "react";
import "./index.css";

interface Props {
  min: number;
  max: number;
  currentMin: number;
  currentMax: number;
  valPrefix?: string;
  onChange: (min: number, max: number) => void;
}

function MultiRangeSlider({
  min,
  max,
  currentMin,
  currentMax,
  valPrefix = "",
  onChange,
}: Props) {
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(currentMin);
    const maxPercent = getPercent(currentMax);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [currentMin, currentMax, getPercent]);

  return (
    <div className="py-4">
      <input
        type="range"
        min={min}
        max={max}
        value={currentMin}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), currentMax - 1);
          onChange(value, currentMax);
        }}
        className="thumb thumb--left"
      />
      <input
        type="range"
        min={min}
        max={max}
        value={currentMax}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), currentMin + 1);
          onChange(currentMin, value);
        }}
        className="thumb thumb--right"
      />

      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />
        <div className="slider__left-value">
          {valPrefix}
          {currentMin}
        </div>
        <div className="slider__right-value">
          {valPrefix}
          {currentMax}
        </div>
      </div>
    </div>
  );
}

export default MultiRangeSlider;
