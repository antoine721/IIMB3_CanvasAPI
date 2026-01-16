import { useEffect, useMemo, useRef, useState } from "react";
import { PARALLAX_CONFIG } from "../../constants/parallax";
import { isMobile, isTablet } from "../../constants/responsive";

type Point = { x: number; y: number; timestamp: number };

const GYROSCOPE_INTENSITY = 0.3;
const TOUCH_INTENSITY = 0.5;
const CLEANUP_FPS = 16;
const MAX_CURSOR_TRAIL_DISPLAY = 5;

const ParallaxBackground = () => {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [cursorTrail, setCursorTrail] = useState<Point[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isInHomeSection, setIsInHomeSection] = useState(true);
	const animationFrameRef = useRef<number | undefined>(undefined);
	const rafMouseRef = useRef<number | undefined>(undefined);
	const mouseQueueRef = useRef<{
		x: number;
		y: number;
		px: number;
		py: number;
	} | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const lastUpdateRef = useRef<number>(0);
	const canvasAnimationRef = useRef<number | undefined>(undefined);

	useEffect(() => {
		const processMouseMove = () => {
			if (mouseQueueRef.current) {
				const { x, y, px, py } = mouseQueueRef.current;
				mouseQueueRef.current = null;

				const mobile = isMobile();
				const tablet = isTablet();

				const xNorm = (x / window.innerWidth) * 2 - 1;
				const yNorm = (y / window.innerHeight) * 2 - 1;
				setMousePosition({ x: xNorm, y: yNorm });

				const threshold = mobile
					? PARALLAX_CONFIG.trail.threshold.mobile
					: PARALLAX_CONFIG.trail.threshold.desktop;
				const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2);

				if (distance > threshold) {
					setCursorTrail((prev) => {
						const newPoint: Point = { x, y, timestamp: Date.now() };
						const updated = [...prev, newPoint];
						const maxPoints = mobile
							? PARALLAX_CONFIG.trail.maxPoints.mobile
							: tablet
								? PARALLAX_CONFIG.trail.maxPoints.tablet
								: PARALLAX_CONFIG.trail.maxPoints.desktop;
						return updated.slice(-maxPoints);
					});
				}
			}
			rafMouseRef.current = requestAnimationFrame(processMouseMove);
		};

		const handleMouseMove = (e: MouseEvent) => {
			if (!mouseQueueRef.current) {
				mouseQueueRef.current = {
					x: e.clientX,
					y: e.clientY,
					px: e.clientX,
					py: e.clientY,
				};
			} else {
				mouseQueueRef.current.px = mouseQueueRef.current.x;
				mouseQueueRef.current.py = mouseQueueRef.current.y;
				mouseQueueRef.current.x = e.clientX;
				mouseQueueRef.current.y = e.clientY;
			}
		};

		const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
			if (isMobile() && e.gamma !== null && e.beta !== null) {
				const xNorm = Math.max(-1, Math.min(1, e.gamma / 45));
				const yNorm = Math.max(-1, Math.min(1, (e.beta - 45) / 45));
				setMousePosition({
					x: xNorm * GYROSCOPE_INTENSITY,
					y: yNorm * GYROSCOPE_INTENSITY,
				});
			}
		};

		const handleTouchMove = (e: TouchEvent) => {
			if (isMobile() && e.touches.length > 0) {
				const touch = e.touches[0];
				const xNorm = (touch.clientX / window.innerWidth) * 2 - 1;
				const yNorm = (touch.clientY / window.innerHeight) * 2 - 1;
				setMousePosition({
					x: xNorm * TOUCH_INTENSITY,
					y: yNorm * TOUCH_INTENSITY,
				});
			}
		};

		const mobile = isMobile();
		if (!mobile) {
			rafMouseRef.current = requestAnimationFrame(processMouseMove);
			window.addEventListener("mousemove", handleMouseMove, { passive: true });
		} else {
			if (window.DeviceOrientationEvent) {
				window.addEventListener("deviceorientation", handleDeviceOrientation, {
					passive: true,
				});
			}
			window.addEventListener("touchmove", handleTouchMove, { passive: true });
		}

		const cleanupTrail = () => {
			const now = Date.now();
			if (now - lastUpdateRef.current > CLEANUP_FPS) {
				setCursorTrail((prev) =>
					prev.filter(
						(point) => now - point.timestamp < PARALLAX_CONFIG.trail.duration,
					),
				);
				lastUpdateRef.current = now;
			}
			animationFrameRef.current = requestAnimationFrame(cleanupTrail);
		};
		animationFrameRef.current = requestAnimationFrame(cleanupTrail);

		return () => {
			if (!mobile) {
				window.removeEventListener("mousemove", handleMouseMove);
			} else {
				window.removeEventListener(
					"deviceorientation",
					handleDeviceOrientation,
				);
				window.removeEventListener("touchmove", handleTouchMove);
			}
			if (rafMouseRef.current) cancelAnimationFrame(rafMouseRef.current);
			if (animationFrameRef.current)
				cancelAnimationFrame(animationFrameRef.current);
		};
	}, []);

	const layers = useMemo(() => PARALLAX_CONFIG.layers, []);

	useEffect(() => {
		setIsLoaded(true);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const homeSection = document.getElementById("home");
			if (homeSection) {
				const rect = homeSection.getBoundingClientRect();
				const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
				setIsInHomeSection(isVisible);
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;

		const resizeCanvas = () => {
			const dpr = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();
			const displayWidth = rect.width;
			const displayHeight = rect.height;

			if (
				canvas.width !== displayWidth * dpr ||
				canvas.height !== displayHeight * dpr
			) {
				canvas.width = displayWidth * dpr;
				canvas.height = displayHeight * dpr;
				canvas.style.width = displayWidth + "px";
				canvas.style.height = displayHeight + "px";

				ctx.setTransform(1, 0, 0, 1, 0, 0);
				ctx.scale(dpr, dpr);
			}
		};
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		let isActive = true;

		const drawMask = () => {
			if (!isActive) return;

			const rect = canvas.getBoundingClientRect();
			ctx.clearRect(0, 0, rect.width, rect.height);

			if (cursorTrail.length > 0) {
				const now = Date.now();
				const mobile = isMobile();
				cursorTrail.forEach((point, index) => {
					const age = now - point.timestamp;
					if (age > PARALLAX_CONFIG.trail.duration) return;

					const opacity = Math.max(0, 1 - age / PARALLAX_CONFIG.trail.duration);
					const baseSize = mobile
						? PARALLAX_CONFIG.cursor.baseSize.mobile
						: PARALLAX_CONFIG.cursor.baseSize.desktop;
					const sizeIncrement = mobile
						? PARALLAX_CONFIG.cursor.sizeIncrement.mobile
						: PARALLAX_CONFIG.cursor.sizeIncrement.desktop;
					const size = baseSize + (cursorTrail.length - index) * sizeIncrement;

					const gradient = ctx.createRadialGradient(
						point.x,
						point.y,
						0,
						point.x,
						point.y,
						size,
					);
					gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
					gradient.addColorStop(0.6, `rgba(255, 255, 255, ${opacity * 0.7})`);
					gradient.addColorStop(1, "transparent");

					ctx.fillStyle = gradient;
					ctx.beginPath();
					ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
					ctx.fill();
				});
			}

			canvasAnimationRef.current = requestAnimationFrame(drawMask);
		};

		drawMask();

		return () => {
			isActive = false;
			window.removeEventListener("resize", resizeCanvas);
			if (canvasAnimationRef.current) {
				cancelAnimationFrame(canvasAnimationRef.current);
			}
		};
	}, [cursorTrail]);

	const baseLayers = useMemo(() => {
		const mobile = isMobile();
		const tablet = isTablet();
		const intensity = mobile
			? PARALLAX_CONFIG.intensity.mobile
			: tablet
				? PARALLAX_CONFIG.intensity.tablet
				: PARALLAX_CONFIG.intensity.desktop;

		return layers.map((layer, index) => {
			const translateX = mousePosition.x * layer.speed * intensity;
			const translateY = mousePosition.y * layer.speed * intensity;
			return { ...layer, translateX, translateY, index };
		});
	}, [layers, mousePosition.x, mousePosition.y]);

	const [maskUrl, setMaskUrl] = useState<string>("");

	useEffect(() => {
		if (!canvasRef.current || cursorTrail.length === 0) {
			setMaskUrl("");
			return;
		}

		const updateMask = () => {
			if (canvasRef.current) {
				try {
					setMaskUrl(canvasRef.current.toDataURL());
				} catch (e) {
					// Ignorer les erreurs de toDataURL
				}
			}
		};

		const interval = setInterval(
			updateMask,
			PARALLAX_CONFIG.mask.updateInterval,
		);
		return () => clearInterval(interval);
	}, [cursorTrail]);

	if (!isInHomeSection) {
		return null;
	}

	return (
		<>
			<canvas
				ref={canvasRef}
				className="fixed inset-0 pointer-events-none"
				style={{ zIndex: 49, opacity: 0 }}
			/>

			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				{baseLayers.map(({ image, zIndex, translateX, translateY, index }) => (
					<div
						key={`base-${index}`}
						className="absolute inset-0 flex items-center justify-center"
						style={{
							zIndex,
							transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
							willChange: "transform",
						}}
					>
						<img
							src={image}
							alt={`Parallax layer ${index + 1}`}
							className="w-full h-full sm:w-[110%] sm:h-[110%] md:w-[120%] md:h-[120%] object-cover sm:object-contain select-none transition-all duration-1000 ease-out"
							style={{
								filter: isLoaded ? "blur(0px)" : `blur(${20 - index * 2}px)`,
								opacity: isLoaded ? 1 : 0,
								transitionDelay: `${index * 100}ms`,
							}}
							draggable={false}
							loading="eager"
						/>
					</div>
				))}

				{maskUrl && (
					<div
						className="absolute inset-0 overflow-hidden pointer-events-none"
						style={{
							zIndex: 50,
							WebkitMaskImage: `url(${maskUrl})`,
							maskImage: `url(${maskUrl})`,
							WebkitMaskSize: "100% 100%",
							maskSize: "100% 100%",
							WebkitMaskRepeat: "no-repeat",
							maskRepeat: "no-repeat",
						}}
					>
						{baseLayers.map(
							({ image, zIndex, translateX, translateY, index }) => (
								<div
									key={`inverted-${index}`}
									className="absolute inset-0 flex items-center justify-center"
									style={{
										zIndex,
										transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
										willChange: "transform",
									}}
								>
									<img
										src={image}
										alt={`Parallax inverted layer ${index + 1}`}
										className="w-full h-full sm:w-[110%] sm:h-[110%] md:w-[120%] md:h-[120%] object-cover sm:object-contain select-none transition-all duration-1000 ease-out"
										style={{
											filter: `invert(1) ${isLoaded ? "blur(0px)" : `blur(${20 - index * 2}px)`}`,
											opacity: isLoaded ? 1 : 0,
											transitionDelay: `${index * 100}ms`,
										}}
										draggable={false}
										loading="eager"
									/>
								</div>
							),
						)}
					</div>
				)}
			</div>

			{cursorTrail.length > 0 && (
				<div
					className="fixed inset-0 pointer-events-none"
					style={{ zIndex: 100 }}
				>
					{cursorTrail.slice(-MAX_CURSOR_TRAIL_DISPLAY).map((point, index) => {
						const age = Date.now() - point.timestamp;
						if (age > PARALLAX_CONFIG.trail.duration) return null;
						const opacity =
							Math.max(0, 1 - age / PARALLAX_CONFIG.trail.duration) * 0.5;
						const scale = 1 - index * 0.1;

						return (
							<div
								key={`cursor-${point.timestamp}-${index}`}
								className="absolute rounded-full border border-white/40 hidden md:block"
								style={{
									left: point.x - 12,
									top: point.y - 12,
									width: 24,
									height: 24,
									opacity,
									transform: `translate3d(0, 0, 0) scale(${scale})`,
									background:
										"radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
									boxShadow: "0 0 15px rgba(255,255,255,0.2)",
									willChange: "opacity, transform",
								}}
							/>
						);
					})}
				</div>
			)}
		</>
	);
};

export default ParallaxBackground;
