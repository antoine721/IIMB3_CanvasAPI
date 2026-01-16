import { motion } from "motion/react";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";

type Props = {
	isPlaying: boolean;
	onPrev: () => void;
	onNext: () => void;
	onToggle: () => void;
};

export default function MusicPlayerControls({
	isPlaying,
	onPrev,
	onNext,
	onToggle,
}: Props) {
	return (
		<div className="relative w-full flex items-center justify-center gap-4 rounded-2xl border border-white/20 bg-gradient-to-br from-black/50 via-purple-900/20 to-black/50 backdrop-blur-xl px-6 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]">
			{/* Effet de glow animé */}
			<motion.div
				className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl"
				animate={
					isPlaying
						? {
								opacity: [0.3, 0.6, 0.3],
							}
						: { opacity: 0.2 }
				}
				transition={{
					duration: 2,
					repeat: isPlaying ? Infinity : 0,
					ease: "easeInOut",
				}}
			/>

			{/* Bouton précédent */}
			<motion.button
				type="button"
				onClick={onPrev}
				whileHover={{ scale: 1.1, x: -2 }}
				whileTap={{ scale: 0.95 }}
				className="relative z-10 h-12 w-12 grid place-items-center rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm text-white shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(147,51,234,0.4)] transition-all duration-300"
				aria-label="Piste précédente"
			>
				<motion.div
					animate={{
						x: [0, -2, 0],
					}}
					transition={{
						duration: 1.5,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				>
					<FaStepBackward />
				</motion.div>
			</motion.button>

			{/* Bouton play/pause principal */}
			<motion.button
				type="button"
				onClick={onToggle}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
				className="relative z-10 h-16 w-16 grid place-items-center rounded-full bg-gradient-to-br from-white via-purple-100 to-blue-100 text-black shadow-[0_10px_40px_rgba(147,51,234,0.5),inset_0_2px_10px_rgba(255,255,255,0.5)] hover:shadow-[0_15px_50px_rgba(147,51,234,0.7)] transition-all duration-300"
				aria-label={isPlaying ? "Pause" : "Lecture"}
			>
				{/* Effet de pulse */}
				{isPlaying && (
					<motion.div
						className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/50 to-blue-400/50"
						animate={{
							scale: [1, 1.3, 1],
							opacity: [0.5, 0, 0.5],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				)}

				<motion.div
					animate={
						isPlaying
							? {
									rotate: [0, 360],
								}
							: {}
					}
					transition={{
						duration: 20,
						repeat: isPlaying ? Infinity : 0,
						ease: "linear",
					}}
				>
					{isPlaying ? (
						<FaPause className="text-lg" />
					) : (
						<FaPlay className="translate-x-[2px] text-lg" />
					)}
				</motion.div>
			</motion.button>

			{/* Bouton suivant */}
			<motion.button
				type="button"
				onClick={onNext}
				whileHover={{ scale: 1.1, x: 2 }}
				whileTap={{ scale: 0.95 }}
				className="relative z-10 h-12 w-12 grid place-items-center rounded-full border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm text-white shadow-[0_4px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)] transition-all duration-300"
				aria-label="Piste suivante"
			>
				<motion.div
					animate={{
						x: [0, 2, 0],
					}}
					transition={{
						duration: 1.5,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				>
					<FaStepForward />
				</motion.div>
			</motion.button>
		</div>
	);
}

