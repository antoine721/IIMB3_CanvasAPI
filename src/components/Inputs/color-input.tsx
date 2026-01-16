import { useId } from "react";

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorInput = ({ label, value, onChange }: ColorInputProps) => {
  const id = useId();
  const colorId = `${id}-color`;
  const textId = `${id}-text`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={textId} className="text-white/70 text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          id={colorId}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="size-12 rounded-lg cursor-pointer border-2 border-white/20 bg-transparent"
          aria-label={`${label} color picker`}
        />
        <input
          id={textId}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm font-mono"
        />
      </div>
    </div>
  );
};

export default ColorInput;
