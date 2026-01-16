import { useId } from "react";

interface RangeInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

const RangeInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: RangeInputProps) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-white/70 text-sm font-medium">
        {label}: <span className="text-white">{value}</span>
      </label>
      <input
        id={id}
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#e94560]"
      />
    </div>
  );
};

export default RangeInput;
