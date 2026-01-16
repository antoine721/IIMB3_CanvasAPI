import { useCallback, useRef, useState } from "react";
import {
  AVAILABLE_IMAGES,
  COVER_PRESETS,
  CoverSettings,
  DEFAULT_COVER_SETTINGS,
} from "../../constants/cover";
import { useCanvasCover } from "../../hooks/use-canvas-cover";
import { getRandomPattern } from "../../utils/patterns";
import { ColorInput, PatternInput, RangeInput } from "../inputs";

const DownloadIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const RandomIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

export default function CoverSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [settings, setSettings] = useState<CoverSettings>(
    DEFAULT_COVER_SETTINGS
  );
  const { handleDownload } = useCanvasCover(canvasRef, settings);

  const updateSetting = useCallback(
    <K extends keyof CoverSettings>(key: K, value: CoverSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const applyPreset = useCallback((preset: (typeof COVER_PRESETS)[number]) => {
    setSettings((prev) => ({
      ...prev,
      bgColor: preset.bgColor,
      borderColor: preset.borderColor,
    }));
  }, []);

  const updatePatternSetting = useCallback(
    <K extends keyof CoverSettings["pattern"]>(
      key: K,
      value: CoverSettings["pattern"][K]
    ) => {
      setSettings((prev) => ({
        ...prev,
        pattern: { ...prev.pattern, [key]: value },
      }));
    },
    []
  );

  const randomizePattern = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      pattern: getRandomPattern(),
    }));
  }, []);

  return (
    <section
      id="cover"
      className="snap-section relative min-h-screen flex items-center justify-center z-10 pt-40 bg-black"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
          <div className="flex flex-col items-center gap-4">
            <div className="relative overflow-hidden transform -rotate-3 duration-300">
              <canvas
                ref={canvasRef}
                className="size-[300px] sm:size-[350px] md:size-[400px]"
              />
            </div>
            <button
              onClick={handleDownload}
              className="px-6 py-2.5 bg-[#e94560] hover:bg-[#d63d56] text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {DownloadIcon}
              Download
            </button>
          </div>

          <div className="w-full max-w-96 space-y-6">
            <h3 className="text-xl font-bold text-white border-b border-white/20 pb-3">
              Customize
            </h3>

            <div className="space-y-4">
              <h4 className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                Colors
              </h4>
              <ColorInput
                label="Background"
                value={settings.bgColor}
                onChange={(v) => updateSetting("bgColor", v)}
              />
              <ColorInput
                label="Border"
                value={settings.borderColor}
                onChange={(v) => updateSetting("borderColor", v)}
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                Effects
              </h4>
              <RangeInput
                label="Border Width"
                value={settings.borderWidth}
                onChange={(v) => updateSetting("borderWidth", v)}
                min={0}
                max={100}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                  Pattern
                </h4>
                <button
                  onClick={randomizePattern}
                  className="px-3 py-1 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {RandomIcon}
                  Random
                </button>
              </div>
              <PatternInput
                value={settings.pattern.type}
                onChange={(v) => updatePatternSetting("type", v)}
              />
              {settings.pattern.type !== "none" && (
                <>
                  <ColorInput
                    label="Pattern Color"
                    value={settings.pattern.color}
                    onChange={(v) => updatePatternSetting("color", v)}
                  />
                  <RangeInput
                    label="Pattern Opacity"
                    value={settings.pattern.opacity}
                    onChange={(v) => updatePatternSetting("opacity", v)}
                    min={0.05}
                    max={0.5}
                    step={0.05}
                  />
                  <RangeInput
                    label="Pattern Scale"
                    value={settings.pattern.scale}
                    onChange={(v) => updatePatternSetting("scale", v)}
                    min={0.5}
                    max={2}
                    step={0.1}
                  />
                </>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                Center Image
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {AVAILABLE_IMAGES.map((img) => (
                  <button
                    key={img.src}
                    onClick={() => updateSetting("centerImage", img.src)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      settings.centerImage === img.src
                        ? "border-[#e94560] scale-105"
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.name}
                      width={100}
                      height={64}
                      className="w-full h-16 object-cover"
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1 text-center">
                      {img.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                Presets
              </h4>
              <div className="flex flex-wrap gap-2">
                {COVER_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 rounded-lg text-white text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{
                      background: `linear-gradient(to right, ${preset.bgColor}, ${preset.borderColor})`,
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
