export const PARALLAX_CONFIG = {
  layers: [
    { image: '/background/7.png', speed: 0.08, zIndex: 1 },
    { image: '/background/6.png', speed: 0.12, zIndex: 2 },
    { image: '/background/5.png', speed: 0.18, zIndex: 3 },
    { image: '/background/4.png', speed: 0.25, zIndex: 4 },
    { image: '/background/3.png', speed: 0.35, zIndex: 5 },
    { image: '/background/2.png', speed: 0.45, zIndex: 6 },
    { image: '/background/1.png', speed: 0.6, zIndex: 7 },
  ],
  intensity: {
    mobile: 20,
    tablet: 35,
    desktop: 50,
  },
} as const;
