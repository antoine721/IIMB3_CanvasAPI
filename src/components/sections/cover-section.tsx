import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
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
      className="snap-section relative min-h-screen flex flex-col items-center z-10 pt-24 sm:pt-32 pb-20 bg-black overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#b900ff]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#e94560]/10 rounded-full blur-[120px]" />
      </div>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-12 sm:mb-16"
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#b900ff]/50 to-transparent" />
          <span className="text-[#b900ff] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase">
            Create
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#b900ff]/50 to-transparent" />
        </div>
        <h2 className="font-jaro text-center text-white font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight">
          Your Cover
        </h2>
        <p className="text-center text-white/50 mt-4 max-w-md mx-auto text-sm sm:text-base">
          Customize and download your unique album cover
        </p>
      </motion.div>

      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center lg:items-start justify-center">
          {/* Canvas preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative group">
              {/* Glow effect behind canvas */}
              <div
                className="absolute -inset-4 rounded-2xl opacity-50 blur-xl transition-opacity duration-500 group-hover:opacity-75"
                style={{
                  background: `linear-gradient(135deg, ${settings.bgColor}40, ${settings.borderColor}40)`,
                }}
              />
              {/* Canvas container */}
              <div className="relative overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10">
                <canvas
                  ref={canvasRef}
                  className="size-[280px] sm:size-[320px] md:size-[380px] lg:size-[400px]"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="px-8 py-3 bg-gradient-to-r from-[#e94560] to-[#b900ff] hover:from-[#d63d56] hover:to-[#a000e0] text-white font-bold uppercase tracking-wider rounded-lg transition-all duration-300 flex items-center gap-3 shadow-lg shadow-[#e94560]/25"
            >
              {DownloadIcon}
              Download
            </motion.button>
          </motion.div>

          {/* Controls panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-md lg:max-w-sm space-y-6 bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-2 h-2 rounded-full bg-[#b900ff]" />
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                Customize
              </h3>
            </div>

            {/* Colors section */}
            <div className="space-y-4">
              <h4 className="text-[#f9e0ff] text-xs font-semibold uppercase tracking-[0.2em]">
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

            {/* Effects section */}
            <div className="space-y-4">
              <h4 className="text-[#f9e0ff] text-xs font-semibold uppercase tracking-[0.2em]">
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

            {/* Pattern section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[#f9e0ff] text-xs font-semibold uppercase tracking-[0.2em]">
                  Pattern
                </h4>
                <button
                  onClick={randomizePattern}
                  className="px-3 py-1.5 text-xs bg-[#b900ff]/20 hover:bg-[#b900ff]/30 text-[#f9e0ff] rounded-lg transition-colors flex items-center gap-1.5 border border-[#b900ff]/30"
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
                <div className="space-y-4 pl-3 border-l-2 border-[#b900ff]/30">
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
                </div>
              )}
            </div>

            {/* Center Image section */}
            <div className="space-y-3">
              <h4 className="text-[#f9e0ff] text-xs font-semibold uppercase tracking-[0.2em]">
                Center Image
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {AVAILABLE_IMAGES.map((img) => (
                  <button
                    key={img.src}
                    onClick={() => updateSetting("centerImage", img.src)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      settings.centerImage === img.src
                        ? "border-[#b900ff] scale-105 shadow-lg shadow-[#b900ff]/25"
                        : "border-white/10 hover:border-[#b900ff]/50"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={img.name}
                      width={100}
                      height={64}
                      className="w-full h-14 object-cover"
                    />
                    <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent text-white text-[10px] py-1 text-center font-medium">
                      {img.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Presets section */}
            <div className="space-y-3">
              <h4 className="text-[#f9e0ff] text-xs font-semibold uppercase tracking-[0.2em]">
                Presets
              </h4>
              <div className="flex flex-wrap gap-2">
                {COVER_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-1.5 rounded-lg text-white text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${preset.bgColor}, ${preset.borderColor})`,
                    }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
