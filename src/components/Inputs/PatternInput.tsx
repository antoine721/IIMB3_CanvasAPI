import { PatternType, PATTERN_OPTIONS } from "../../constants/cover";

interface PatternInputProps {
  value: PatternType;
  onChange: (value: PatternType) => void;
}

const PatternInput = ({ value, onChange }: PatternInputProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-white/70 text-sm font-medium">Pattern Type</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as PatternType)}
      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm cursor-pointer appearance-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.75rem center",
        backgroundSize: "1rem",
      }}
    >
      {PATTERN_OPTIONS.map((option) => (
        <option
          key={option.type}
          value={option.type}
          className="bg-[#1a1a2e] text-white"
        >
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

export default PatternInput;
