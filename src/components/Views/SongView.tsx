import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import MusicPlayerControls from "../MusicPlayer/MusicPlayerControls";
import TrackList from "../MusicPlayer/TrackList";
import AnimatedTitle from "../MusicPlayer/AnimatedTitle";
import ProgressBar from "../MusicPlayer/ProgressBar";
import ParticleEffects from "../MusicPlayer/ParticleEffects";
import { TRACKS } from "../../constants/tracks";
import { usePlaylistAudio } from "../../hooks/usePlaylistAudio";

type MotoPhase = "offLeft" | "entering" | "center" | "exiting" | "offRight";

const SongView = () => {
	const sectionRef = useRef<HTMLElement | null>(null);
	const motoImgRef = useRef<HTMLImageElement | null>(null);
	const [motoPhase, setMotoPhase] = useState<MotoPhase>("offLeft");
	const exitDirectionRef = useRef<"left" | "right">("right");
	const enterDirectionRef = useRef<"left" | "right">("left");

	const {
		audioRef,
		index,
		track,
		isPlaying,
		duration,
		currentTime,
		error,
		setIndex,
		play,
		toggle,
		next,
		prev,
		seek,
	} = usePlaylistAudio(TRACKS);

	// Gérer la lecture automatique quand on sélectionne une piste manuellement
	const shouldPlayOnLoadRef = useRef(false);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !shouldPlayOnLoadRef.current) return;

		const handleLoadedMetadata = () => {
			shouldPlayOnLoadRef.current = false;
			void play();
		};

		audio.addEventListener("loadedmetadata", handleLoadedMetadata, { once: true });

		return () => {
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
		};
	}, [track, audioRef, play]);

	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;

		// Le scroll se fait dans le conteneur parent (voir `App.tsx`).
		const scrollRoot = el.parentElement ?? null;

		// Direction de scroll (sans listener): on compare la position top entre callbacks.
		let lastTop = Number.POSITIVE_INFINITY;
		const getScrollDir = (entry: IntersectionObserverEntry): "down" | "up" => {
			const top = entry.boundingClientRect.top;
			const dir = top < lastTop ? "down" : "up";
			lastTop = top;
			return dir;
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry) return;
				const dir = getScrollDir(entry);

				// Trigger arrivée quand la section est "assez" visible
				if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
					// En descendant: gauche -> centre. En remontant: droite -> centre.
					if (motoPhase === "offLeft") {
						enterDirectionRef.current = "left";
						setMotoPhase("entering");
					} else if (motoPhase === "offRight") {
						enterDirectionRef.current = "right";
						setMotoPhase("entering");
					} else if (motoPhase === "exiting") {
						// Si on change d'avis pendant la sortie, on recolle au bon sens.
						enterDirectionRef.current = dir === "down" ? "left" : "right";
						setMotoPhase("entering");
					}
					return;
				}

				// Trigger départ quand on a suffisamment quitté la section
				if (!entry.isIntersecting || entry.intersectionRatio <= 0.1) {
					// Bas: centre -> droite, Haut: centre -> gauche
					if (motoPhase === "center") {
						exitDirectionRef.current = dir === "down" ? "right" : "left";
						setMotoPhase("exiting");
					}
				}
			},
			{
				root: scrollRoot,
				threshold: [0, 0.1, 0.35],
			}
		);

		observer.observe(el);

		return () => {
			observer.disconnect();
		};
	}, [motoPhase]);

	// Positionner l'image avant l'animation d'entrée selon la direction
	useEffect(() => {
		if (motoPhase === "entering" && motoImgRef.current) {
			const translateX =
				enterDirectionRef.current === "left" ? "-120vw" : "120vw";
			motoImgRef.current.style.transform = `translate3d(calc(-50% + ${translateX}), -50%, 0)`;
			motoImgRef.current.style.opacity = "0";
		}
	}, [motoPhase]);

	return (
		<section
			id="song"
			ref={sectionRef}
			className={`snap-section relative min-h-screen flex items-center justify-center z-10 bg-black overflow-hidden`}
		>
			{/* Arrière-plan avec effets visuels */}
			<div className="absolute inset-0 pointer-events-none">
				<motion.div
					className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"
					animate={
						isPlaying
							? {
									opacity: [0.3, 0.5, 0.3],
								}
							: { opacity: 0.2 }
					}
					transition={{
						duration: 4,
						repeat: isPlaying ? Infinity : 0,
						ease: "easeInOut",
					}}
				/>
				<ParticleEffects isPlaying={isPlaying} count={30} />
			</div>

			<div className="relative z-10 w-[92vw] max-w-[1200px] grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6">
				{/* Liste à gauche */}
				<motion.div
					className="h-[520px] md:h-[640px]"
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				>
					<TrackList
						tracks={TRACKS}
						currentIndex={index}
						onSelect={(i) => {
							shouldPlayOnLoadRef.current = true;
							setIndex(i);
						}}
					/>
				</motion.div>

				{/* Contenu principal */}
				<motion.div
					className="w-full flex flex-col items-center gap-6"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
				>
					{/* Cadre avec la moto */}
					<div className="relative w-full h-[52vh] sm:h-[56vh] max-h-[560px] overflow-hidden rounded-3xl border-2 border-white/20 bg-gradient-to-br from-purple-900/40 via-black/60 to-blue-900/40 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]">
						{/* Effet de glow animé autour du cadre */}
						<motion.div
							className="absolute -inset-1 bg-gradient-to-r from-purple-500/50 via-pink-500/50 to-blue-500/50 rounded-3xl blur-xl"
							animate={
								isPlaying
									? {
											opacity: [0.3, 0.6, 0.3],
											scale: [1, 1.02, 1],
										}
									: { opacity: 0.2, scale: 1 }
							}
							transition={{
								duration: 3,
								repeat: isPlaying ? Infinity : 0,
								ease: "easeInOut",
							}}
						/>

						{/* Overlay avec vignette */}
						<div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.1),inset_0_0_80px_rgba(0,0,0,0.6)]" />

						{/* Particules autour de la moto */}
						<ParticleEffects isPlaying={isPlaying && motoPhase === "center"} count={15} />

						{/* Image de la moto */}
						<motion.img
							ref={motoImgRef}
							src="/julmoto.png"
							alt="Illustration Jul sur une moto"
							draggable={false}
							className="pointer-events-none select-none will-change-transform absolute left-1/2 top-1/2 w-[140%] sm:w-[130%] md:w-[120%] max-w-none h-auto"
							initial={{
								x: "-50%",
								y: "-50%",
								translateX: "-120vw",
								opacity: 0,
							}}
							animate={
								motoPhase === "entering"
									? {
											x: "-50%",
											y: "-50%",
											translateX: "0vw",
											opacity: 1,
										}
									: motoPhase === "center"
										? {
												x: "-50%",
												y: "-50%",
												translateX: "0vw",
												opacity: 1,
											}
										: motoPhase === "exiting"
											? {
													x: "-50%",
													y: "-50%",
													translateX:
														exitDirectionRef.current === "left"
															? "-120vw"
															: "120vw",
													opacity: 0,
												}
											: motoPhase === "offLeft"
												? {
														x: "-50%",
														y: "-50%",
														translateX: "-120vw",
														opacity: 0,
													}
												: {
														x: "-50%",
														y: "-50%",
														translateX: "120vw",
														opacity: 0,
													}
							}
							transition={{
								duration: motoPhase === "entering" ? 0.7 : 0.65,
								ease: [0.22, 1, 0.36, 1],
							}}
							onAnimationComplete={() => {
								if (motoPhase === "entering") {
									setMotoPhase("center");
								} else if (motoPhase === "exiting") {
									setMotoPhase(
										exitDirectionRef.current === "left" ? "offLeft" : "offRight"
									);
								}
							}}
						/>

						{/* Effet de glow sur la moto quand elle joue */}
						{isPlaying && motoPhase === "center" && (
							<motion.div
								className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] sm:w-[130%] md:w-[120%] h-[140%] sm:h-[130%] md:h-[120%] bg-gradient-radial from-purple-500/20 via-pink-500/10 to-transparent blur-3xl"
								animate={{
									scale: [1, 1.1, 1],
									opacity: [0.4, 0.6, 0.4],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							/>
						)}
					</div>

					{/* Titre animé */}
					<div className="w-full">
						<AnimatedTitle title={track?.title ?? "—"} isPlaying={isPlaying} />
					</div>

					{/* Barre de progression stylisée */}
					<div className="w-full px-2">
						<ProgressBar
							currentTime={currentTime}
							duration={duration}
							onSeek={seek}
							isPlaying={isPlaying}
						/>
					</div>

					{/* Message d'erreur */}
					{error && (
						<motion.div
							className="text-xs text-red-300 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
						>
							{error}
						</motion.div>
					)}

					{/* Boutons de contrôle */}
					<MusicPlayerControls
						isPlaying={isPlaying}
						onPrev={prev}
						onNext={next}
						onToggle={toggle}
					/>

					<audio ref={audioRef} preload="metadata" />
				</motion.div>
			</div>
		</section>
	);
};

export default SongView;
