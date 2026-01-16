import { motion } from "motion/react";
import { useEffect, useState } from "react";

type Props = {
	title: string;
	isPlaying: boolean;
};

export default function AnimatedTitle({ title, isPlaying }: Props) {
	const [displayTitle, setDisplayTitle] = useState(title);

	useEffect(() => {
		setDisplayTitle(title);
	}, [title]);

	return (
		<div className="relative w-full overflow-hidden">
			{/* Effet de glow derrière */}
			<motion.div
				className="absolute inset-0 blur-3xl opacity-30"
				animate={{
					background: isPlaying
						? [
								"radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 70%)",
								"radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
								"radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 70%)",
							]
						: "radial-gradient(circle, rgba(147,51,234,0.2) 0%, transparent 70%)",
				}}
				transition={{
					duration: 3,
					repeat: isPlaying ? Infinity : 0,
					ease: "easeInOut",
				}}
			/>

			{/* Texte principal avec effet de glitch */}
			<motion.div
				className="relative z-10 text-white font-extrabold leading-tight text-lg sm:text-xl md:text-2xl lg:text-3xl"
				key={title}
				initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
				animate={{
					opacity: 1,
					y: 0,
					filter: "blur(0px)",
				}}
				transition={{
					duration: 0.6,
					ease: [0.22, 1, 0.36, 1],
				}}
			>
				<motion.span
					className="block bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
					animate={
						isPlaying
							? {
									backgroundPosition: ["0%", "100%", "0%"],
								}
							: {}
					}
					transition={{
						duration: 3,
						repeat: isPlaying ? Infinity : 0,
						ease: "linear",
					}}
					style={{
						backgroundSize: "200% auto",
					}}
				>
					{displayTitle}
				</motion.span>

				{/* Effet de glitch overlay */}
				{isPlaying && (
					<motion.span
						className="absolute inset-0 block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent opacity-0"
						animate={{
							opacity: [0, 0.3, 0, 0.3, 0],
							x: [0, -2, 2, -2, 0],
						}}
						transition={{
							duration: 0.3,
							repeat: Infinity,
							repeatDelay: 2,
						}}
					>
						{displayTitle}
					</motion.span>
				)}
			</motion.div>

			{/* Particules flottantes */}
			{isPlaying && (
				<div className="absolute inset-0 pointer-events-none">
					{[...Array(6)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-1 h-1 rounded-full bg-purple-400/60"
							initial={{
								x: `${20 + i * 15}%`,
								y: "100%",
								opacity: 0,
							}}
							animate={{
								y: "-20%",
								opacity: [0, 1, 1, 0],
								scale: [0.5, 1, 1, 0.5],
							}}
							transition={{
								duration: 3 + i * 0.5,
								repeat: Infinity,
								delay: i * 0.3,
								ease: "easeOut",
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
}
