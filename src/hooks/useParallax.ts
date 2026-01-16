import { useEffect, useRef, useState } from "react";
import { PARALLAX_CONFIG } from "../constants/parallax";
import { isMobile, isTablet } from "../constants/responsive";

const GYROSCOPE_INTENSITY = 0.3;
const TOUCH_INTENSITY = 0.5;

export const useParallax = () => {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [scrollY, setScrollY] = useState(0);
	const rafMouseRef = useRef<number | undefined>(undefined);
	const mouseQueueRef = useRef<{ x: number; y: number } | null>(null);

	// Mouse/touch/gyroscope handling
	useEffect(() => {
		const processMouseMove = () => {
			if (mouseQueueRef.current) {
				const { x, y } = mouseQueueRef.current;
				mouseQueueRef.current = null;

				const xNorm = (x / window.innerWidth) * 2 - 1;
				const yNorm = (y / window.innerHeight) * 2 - 1;
				setMousePosition({ x: xNorm, y: yNorm });
			}
			rafMouseRef.current = requestAnimationFrame(processMouseMove);
		};

		const handleMouseMove = (e: MouseEvent) => {
			mouseQueueRef.current = { x: e.clientX, y: e.clientY };
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

		return () => {
			if (!mobile) {
				window.removeEventListener("mousemove", handleMouseMove);
			} else {
				window.removeEventListener("deviceorientation", handleDeviceOrientation);
				window.removeEventListener("touchmove", handleTouchMove);
			}
			if (rafMouseRef.current) cancelAnimationFrame(rafMouseRef.current);
		};
	}, []);

	// Scroll handling
	useEffect(() => {
		let rafId: number | undefined;

		const handleScroll = () => {
			if (rafId) return;
			rafId = requestAnimationFrame(() => {
				const homeSection = document.getElementById("home");
				if (homeSection) {
					const rect = homeSection.getBoundingClientRect();
					const scrollProgress = Math.max(0, -rect.top);
					setScrollY(scrollProgress);
				}
				rafId = undefined;
			});
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		handleScroll();

		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, []);

	const getTransform = (speed: number, scrollMultiplier = 0.5) => {
		const mobile = isMobile();
		const tablet = isTablet();
		const intensity = mobile
			? PARALLAX_CONFIG.intensity.mobile
			: tablet
				? PARALLAX_CONFIG.intensity.tablet
				: PARALLAX_CONFIG.intensity.desktop;

		const mouseX = mousePosition.x * speed * intensity;
		const mouseY = mousePosition.y * speed * intensity;
		const scrollOffset = scrollY * speed * scrollMultiplier;

		return `translate3d(${mouseX}px, ${mouseY - scrollOffset}px, 0)`;
	};

	return { mousePosition, scrollY, getTransform };
};
