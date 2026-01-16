import { motion } from "motion/react";
import { FaMusic } from "react-icons/fa";
import type { Track } from "../../constants/tracks";

type Props = {
	tracks: Track[];
	currentIndex: number;
	onSelect: (index: number) => void;
};

export default function TrackList({ tracks, currentIndex, onSelect }: Props) {
	return (
		<div className="relative w-full h-full rounded-2xl border border-white/20 bg-gradient-to-br from-black/50 via-purple-900/20 to-black/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden">
			{/* Effet de glow animé */}
			<motion.div
				className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-purple-500/20 to-transparent blur-2xl"
				animate={{
					opacity: [0.3, 0.5, 0.3],
				}}
				transition={{
					duration: 3,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>

			{/* Header stylisé */}
			<div className="relative z-10 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-transparent via-white/5 to-transparent">
				<div className="flex items-center gap-3">
					<motion.div
						animate={{
							rotate: [0, 360],
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "linear",
						}}
					>
						<FaMusic className="text-purple-400 text-lg" />
					</motion.div>
					<div>
						<div className="text-xs uppercase tracking-wider text-white/50 font-medium">
							Playlist
						</div>
						<div className="text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
							{tracks.length} titres
						</div>
					</div>
				</div>
			</div>

			{/* Liste des pistes */}
			<div className="relative z-10 max-h-[520px] overflow-y-auto custom-scrollbar">
				{tracks.map((t, i) => {
					const active = i === currentIndex;
					return (
						<motion.button
							key={`${t.src}-${i}`}
							type="button"
							onClick={() => onSelect(i)}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: i * 0.03, duration: 0.3 }}
							whileHover={{ x: 4 }}
							whileTap={{ scale: 0.98 }}
							className={`relative w-full text-left px-5 py-4 border-b border-white/5 transition-all duration-300 ${
								active
									? "bg-gradient-to-r from-purple-500/20 via-pink-500/10 to-blue-500/20 text-white shadow-[inset_0_0_20px_rgba(147,51,234,0.2)]"
									: "text-white/70 hover:bg-white/5 hover:text-white hover:shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]"
							}`}
							aria-current={active ? "true" : undefined}
						>
							{/* Indicateur de lecture actif */}
							{active && (
								<motion.div
									className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-pink-400 to-blue-400"
									layoutId="activeTrack"
									transition={{ type: "spring", stiffness: 300, damping: 30 }}
								/>
							)}

							{/* Effet de glow pour la piste active */}
							{active && (
								<motion.div
									className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10"
									animate={{
										opacity: [0.3, 0.6, 0.3],
									}}
									transition={{
										duration: 2,
										repeat: Infinity,
										ease: "easeInOut",
									}}
								/>
							)}

							<div className="relative z-10 flex items-center gap-4">
								{/* Numéro avec style artistique */}
								<motion.div
									className={`text-sm font-bold tabular-nums ${
										active
											? "text-transparent bg-gradient-to-br from-purple-300 to-blue-300 bg-clip-text"
											: "text-white/30"
									}`}
									animate={
										active
											? {
													scale: [1, 1.1, 1],
												}
											: {}
									}
									transition={{
										duration: 2,
										repeat: active ? Infinity : 0,
										ease: "easeInOut",
									}}
								>
									{String(i + 1).padStart(2, "0")}
								</motion.div>

								{/* Titre */}
								<div className="flex-1 min-w-0">
									<motion.div
										className={`truncate font-semibold ${
											active ? "text-base" : "text-sm"
										}`}
										animate={
											active
												? {
														textShadow: [
															"0_0_10px_rgba(147,51,234,0.5)",
															"0_0_20px_rgba(59,130,246,0.5)",
															"0_0_10px_rgba(147,51,234,0.5)",
														],
													}
												: {}
										}
										transition={{
											duration: 2,
											repeat: active ? Infinity : 0,
											ease: "easeInOut",
										}}
									>
										{t.title}
									</motion.div>
								</div>

								{/* Indicateur de lecture */}
								{active && (
									<motion.div
										className="w-2 h-2 rounded-full bg-gradient-to-br from-purple-400 to-blue-400"
										animate={{
											scale: [1, 1.3, 1],
											opacity: [0.8, 1, 0.8],
										}}
										transition={{
											duration: 1.5,
											repeat: Infinity,
											ease: "easeInOut",
										}}
									/>
								)}
							</div>
						</motion.button>
					);
				})}
			</div>
		</div>
	);
}

