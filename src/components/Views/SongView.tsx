import { useEffect, useRef } from "react";
import MusicPlayerControls from "../MusicPlayer/MusicPlayerControls";
import TrackList from "../MusicPlayer/TrackList";
import { TRACKS } from "../../constants/tracks";
import { formatTime, usePlaylistAudio } from "../../hooks/usePlaylistAudio";

const SongView = () => {
	const sectionRef = useRef<HTMLElement | null>(null);
	const motoRef = useRef<HTMLImageElement | null>(null);
	const motoAnimRef = useRef<Animation | null>(null);
	const motoPhaseRef = useRef<"offLeft" | "entering" | "center" | "exiting" | "offRight">(
		"offLeft"
	);

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

	useEffect(() => {
		const el = sectionRef.current;
		const img = motoRef.current;
		if (!el || !img) return;

		// Le scroll se fait dans le conteneur parent (voir `App.tsx`).
		const scrollRoot = el.parentElement ?? null;

		// État initial: hors-cadre à gauche.
		// L'image est animée DANS un cadre centré, donc on centre aussi en Y.
		img.style.transform = "translate3d(calc(-50% - 120vw), -50%, 0)";
		img.style.opacity = "0";

		const cancelCurrent = () => {
			motoAnimRef.current?.cancel();
			motoAnimRef.current = null;
		};

		const playEnter = (from: "left" | "right") => {
			if (motoPhaseRef.current === "entering" || motoPhaseRef.current === "center") return;
			motoPhaseRef.current = "entering";

			cancelCurrent();

			motoAnimRef.current = img.animate(
				[
					{
						transform:
							from === "right"
								? "translate3d(calc(-50% + 120vw), -50%, 0)"
								: "translate3d(calc(-50% - 120vw), -50%, 0)",
						opacity: 0,
					},
					{
						transform: "translate3d(-50%, -50%, 0)",
						opacity: 1,
					},
				],
				{
					duration: 700,
					easing: "cubic-bezier(0.22, 1, 0.36, 1)",
					fill: "both",
				}
			);

			motoAnimRef.current.onfinish = () => {
				motoAnimRef.current = null;
				motoPhaseRef.current = "center";
			};
		};

		const playExit = (to: "left" | "right") => {
			if (motoPhaseRef.current !== "center") return;
			motoPhaseRef.current = "exiting";

			cancelCurrent();
			motoAnimRef.current = img.animate(
				[
					{
						transform: "translate3d(-50%, -50%, 0)",
						opacity: 1,
					},
					{
						transform:
							to === "left"
								? "translate3d(calc(-50% - 120vw), -50%, 0)"
								: "translate3d(calc(-50% + 120vw), -50%, 0)",
						opacity: 0,
					},
				],
				{
					duration: 650,
					easing: "cubic-bezier(0.22, 1, 0.36, 1)",
					fill: "both",
				}
			);

			motoAnimRef.current.onfinish = () => {
				motoAnimRef.current = null;
				motoPhaseRef.current = to === "left" ? "offLeft" : "offRight";
			};
		};

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
					if (motoPhaseRef.current === "offLeft") playEnter("left");
					else if (motoPhaseRef.current === "offRight") playEnter("right");
					else if (motoPhaseRef.current === "exiting") {
						// Si on change d'avis pendant la sortie, on recolle au bon sens.
						playEnter(dir === "down" ? "left" : "right");
					}
					return;
				}

				// Trigger départ quand on a suffisamment quitté la section
				if (!entry.isIntersecting || entry.intersectionRatio <= 0.1) {
					// Bas: centre -> droite, Haut: centre -> gauche
					playExit(dir === "down" ? "right" : "left");
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
			motoAnimRef.current?.cancel();
			motoAnimRef.current = null;
		};
	}, []);

	return (
		<section
			id="song"
			ref={sectionRef}
			className={`snap-section relative min-h-screen flex items-center justify-center z-10 bg-black `}
		>
			<div className="w-[92vw] max-w-[1200px] grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4">
				{/* Liste à gauche */}
				<div className="h-[520px] md:h-[640px]">
					<TrackList
						tracks={TRACKS}
						currentIndex={index}
						onSelect={(i) => {
							setIndex(i);
							void play();
						}}
					/>
				</div>

				{/* Contenu principal */}
				<div className="w-full flex flex-col items-center gap-4">
					<div className="relative w-full h-[52vh] sm:h-[56vh] max-h-[560px] overflow-hidden bg-purple-500 rounded-2xl border border-white/25 bg-black/30 backdrop-blur-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_80px_rgba(0,0,0,0.65)]">
						{/* “Cadre” (effet vignette/overlay) */}
						<div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.06),inset_0_0_60px_rgba(0,0,0,0.55)]" />

						<img
							ref={motoRef}
							src="/julmoto.png"
							alt="Illustration Jul sur une moto"
							draggable={false}
							className="pointer-events-none select-none will-change-transform absolute left-1/2 top-1/2 w-[140%] sm:w-[130%] md:w-[120%] max-w-none h-auto"
						/>
					</div>

					<div className="w-full text-center">
						<div className="text-white font-extrabold leading-tight text-2xl sm:text-3xl md:text-4xl">
							{track?.title ?? "—"}
						</div>

						<div className="mt-3">
							<input
								type="range"
								min={0}
								max={duration || 0}
								step={0.1}
								value={Math.min(currentTime, duration || 0)}
								onChange={(e) => seek(Number(e.target.value))}
								className="w-full accent-white"
								aria-label="Barre de progression"
							/>
							<div className="mt-1 flex items-center justify-between text-xs text-white/60 tabular-nums">
								<span>{formatTime(currentTime)}</span>
								<span>{formatTime(duration)}</span>
							</div>
						</div>

						{error && <div className="mt-2 text-xs text-red-300">{error}</div>}
					</div>

					{/* Boutons SOUS la moto */}
					<MusicPlayerControls
						isPlaying={isPlaying}
						onPrev={prev}
						onNext={next}
						onToggle={toggle}
					/>

					<audio ref={audioRef} preload="metadata" />
				</div>
			</div>
		</section>
	);
};

export default SongView;
