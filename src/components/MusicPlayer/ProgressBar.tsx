import { motion } from "motion/react";
import { useEffect, useRef } from "react";

type Props = {
	currentTime: number;
	duration: number;
	onSeek: (time: number) => void;
	isPlaying: boolean;
};

export default function ProgressBar({
	currentTime,
	duration,
	onSeek,
	isPlaying,
}: Props) {
	const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
	const sliderRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (sliderRef.current && isPlaying) {
			// Effet de pulse sur la barre pendant la lecture
			sliderRef.current.style.setProperty("--progress", `${progress}%`);
		}
	}, [progress, isPlaying]);

	const formatTime = (seconds: number) => {
		if (!isFinite(seconds)) return "0:00";
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	return (
		<div className="w-full space-y-2">
			{/* Barre de progression stylisée */}
			<div className="relative h-2 w-full rounded-full bg-white/10 overflow-visible backdrop-blur-sm">
				{/* Input range invisible pour le contrôle - doit être au-dessus */}
				<input
					ref={sliderRef}
					type="range"
					min={0}
					max={duration || 0}
					step={0.1}
					value={Math.min(currentTime, duration || 0)}
					onChange={(e) => onSeek(Number(e.target.value))}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
					style={{ WebkitAppearance: "none", appearance: "none" }}
					aria-label="Barre de progression"
				/>

				{/* Fond avec gradient animé */}
				<motion.div
					className="absolute inset-0 pointer-events-none"
					animate={
						isPlaying
							? {
									background: [
										"linear-gradient(90deg, rgba(147,51,234,0.3) 0%, rgba(59,130,246,0.3) 100%)",
										"linear-gradient(90deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)",
										"linear-gradient(90deg, rgba(147,51,234,0.3) 0%, rgba(59,130,246,0.3) 100%)",
									],
								}
							: {
									background:
										"linear-gradient(90deg, rgba(147,51,234,0.2) 0%, rgba(59,130,246,0.2) 100%)",
								}
					}
					transition={{
						duration: 2,
						repeat: isPlaying ? Infinity : 0,
						ease: "easeInOut",
					}}
				/>

				{/* Barre de progression */}
				<motion.div
					className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.6)] pointer-events-none"
					initial={{ width: 0 }}
					animate={{ width: `${progress}%` }}
					transition={{ duration: 0.1, ease: "linear" }}
				>
					{/* Effet de glow */}
					<motion.div
						className="absolute inset-0 bg-white/30 rounded-full blur-sm"
						animate={
							isPlaying
								? {
										opacity: [0.3, 0.6, 0.3],
									}
								: { opacity: 0.3 }
						}
						transition={{
							duration: 1.5,
							repeat: isPlaying ? Infinity : 0,
							ease: "easeInOut",
						}}
					/>
				</motion.div>

				{/* Curseur stylisé */}
				<motion.div
					className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] border-2 border-purple-500 pointer-events-none z-10"
					style={{ left: `calc(${progress}% - 8px)` }}
					animate={
						isPlaying
							? {
									scale: [1, 1.2, 1],
									boxShadow: [
										"0_0_15px_rgba(255,255,255,0.8)",
										"0_0_25px_rgba(147,51,234,1)",
										"0_0_15px_rgba(255,255,255,0.8)",
									],
								}
							: {}
					}
					transition={{
						duration: 1.5,
						repeat: isPlaying ? Infinity : 0,
						ease: "easeInOut",
					}}
				/>
			</div>

			{/* Temps */}
			<div className="flex items-center justify-between text-xs text-white/70 tabular-nums">
				<motion.span
					key={currentTime}
					initial={{ opacity: 0, y: -5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2 }}
				>
					{formatTime(currentTime)}
				</motion.span>
				<motion.span
					key={duration}
					initial={{ opacity: 0, y: -5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2 }}
				>
					{formatTime(duration)}
				</motion.span>
			</div>
		</div>
	);
}
