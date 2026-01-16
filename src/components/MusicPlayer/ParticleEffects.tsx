import { motion } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
	isPlaying: boolean;
	count?: number;
};

export default function ParticleEffects({ isPlaying, count = 20 }: Props) {
	const [particles, setParticles] = useState<
		Array<{ id: number; x: number; y: number; delay: number }>
	>([]);

	useEffect(() => {
		if (isPlaying) {
			const newParticles = Array.from({ length: count }, (_, i) => ({
				id: i,
				x: Math.random() * 100,
				y: Math.random() * 100,
				delay: Math.random() * 2,
			}));
			setParticles(newParticles);
		} else {
			setParticles([]);
		}
	}, [isPlaying, count]);

	if (!isPlaying) return null;

	return (
		<div className="absolute inset-0 pointer-events-none overflow-hidden">
			{particles.map((particle) => (
				<motion.div
					key={particle.id}
					className="absolute w-1 h-1 rounded-full"
					initial={{
						x: `${particle.x}%`,
						y: `${particle.y}%`,
						opacity: 0,
						scale: 0,
					}}
					animate={{
						y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y - 40}%`],
						x: [
							`${particle.x}%`,
							`${particle.x + (Math.random() - 0.5) * 10}%`,
							`${particle.x + (Math.random() - 0.5) * 20}%`,
						],
						opacity: [0, 0.8, 0.6, 0],
						scale: [0, 1.5, 1, 0],
					}}
					transition={{
						duration: 3 + Math.random() * 2,
						repeat: Infinity,
						delay: particle.delay,
						ease: "easeOut",
					}}
					style={{
						background: `radial-gradient(circle, ${
							Math.random() > 0.5 ? "rgba(147,51,234,0.8)" : "rgba(59,130,246,0.8)"
						} 0%, transparent 70%)`,
						boxShadow: `0 0 ${4 + Math.random() * 4}px ${
							Math.random() > 0.5 ? "rgba(147,51,234,0.6)" : "rgba(59,130,246,0.6)"
						}`,
					}}
				/>
			))}
		</div>
	);
}
