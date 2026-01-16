import { Component, Suspense, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows, Environment, Sparkles, useCursor, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

import DecryptedText from '../DecryptedText/DecryptedText';
import SplitText from '../SplitText/SplitText';
import { useSectionTransition } from '../../hooks/useSectionTransition';
import { getTransitionClass, getContentTransitionClass } from '../../utils/transitionUtils';

type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

import coverModelUrl from '../../Meshy_AI_Album_Cover_Art_0114182349_texture.glb?url';
const MODEL_URL = coverModelUrl;

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function CoverAlbum3D({ transitionState }: { transitionState: TransitionState }) {
  const { scene } = useGLTF(MODEL_URL);

  const content = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<THREE.Group>(null);
  const hitboxRef = useRef<THREE.Mesh>(null);
  const boundsRef = useRef<{ size: THREE.Vector3; center: THREE.Vector3 } | null>(null);
  const [hitboxArgs, setHitboxArgs] = useState<[number, number, number]>([2, 2, 0.4]);
  const [isHoveringAlbum, setIsHoveringAlbum] = useState(false);

  const hoverRef = useRef({
    dirX: 0,
    dirY: 0,
    intensity: 0,
    hovering: false,
  });

  const appearRef = useRef(1);
  useCursor(isHoveringAlbum);

  useLayoutEffect(() => {
    // Qualité/ombres + calcul bounds
    content.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        const mat = obj.material as THREE.Material | THREE.Material[];
        if (Array.isArray(mat)) {
          mat.forEach((m) => {
            if ('envMapIntensity' in m) (m as THREE.MeshStandardMaterial).envMapIntensity = 1.2;
          });
        } else if ('envMapIntensity' in mat) {
          (mat as THREE.MeshStandardMaterial).envMapIntensity = 1.2;
        }
      }
    });

    const box = new THREE.Box3().setFromObject(content);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    boundsRef.current = { size, center };

    // Recentrer le modèle à l'origine pour que la hitbox matche
    content.position.sub(center);

    setHitboxArgs([
      Math.max(0.5, size.x),
      Math.max(0.5, size.y),
      Math.max(0.15, size.z),
    ]);
  }, [content]);

  const onPointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!hitboxRef.current || !boundsRef.current) return;
    e.stopPropagation();
    setIsHoveringAlbum(true);

    const local = hitboxRef.current.worldToLocal(e.point.clone());
    const { size } = boundsRef.current;
    const halfX = Math.max(0.0001, size.x / 2);
    const halfY = Math.max(0.0001, size.y / 2);

    const xN = THREE.MathUtils.clamp(local.x / halfX, -1, 1);
    const yN = THREE.MathUtils.clamp(local.y / halfY, -1, 1);

    // Zone "bord" : plus on est proche du bord, plus on pousse
    const edge = Math.max(Math.abs(xN), Math.abs(yN));
    const edgeStart = 0.62;
    const intensity = clamp01((edge - edgeStart) / (1 - edgeStart));

    // Direction dominante : gauche/droite ou haut/bas
    let dirX = 0;
    let dirY = 0;
    if (Math.abs(xN) >= Math.abs(yN)) dirX = Math.sign(xN);
    else dirY = Math.sign(yN);

    hoverRef.current.hovering = true;
    hoverRef.current.intensity = intensity;
    hoverRef.current.dirX = dirX;
    hoverRef.current.dirY = dirY;
  };

  const onPointerOut = () => {
    hoverRef.current.hovering = false;
    setIsHoveringAlbum(false);
  };

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // Apparition/disparition synchronisée avec la section
    const appearTarget = transitionState === 'exiting' || transitionState === 'exited' ? 0 : 1;
    appearRef.current = THREE.MathUtils.damp(appearRef.current, appearTarget, 7, delta);

    // Hover bord → tilt + push directionnel
    const { hovering, intensity, dirX, dirY } = hoverRef.current;
    const i = hovering ? intensity : 0;

    const targetRotX = (-dirY * 0.35 - state.pointer.y * 0.08) * i;
    const targetRotY = (dirX * 0.45 + state.pointer.x * 0.10) * i;
    const targetPosZ = -0.20 * i;

    // Micro-float + respiration
    const t = state.clock.getElapsedTime();
    const floatY = Math.sin(t * 1.2) * 0.06;

    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 10, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 10, delta);
    g.position.z = THREE.MathUtils.damp(g.position.z, targetPosZ, 10, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, floatY, 6, delta);

    const s = 0.88 + 0.12 * appearRef.current;
    g.scale.setScalar(s);

    // Lumière qui suit légèrement le pointeur (effet "studio")
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, state.pointer.x * 0.6, 3, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 0.2 + state.pointer.y * 0.35, 3, delta);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <primitive object={content} />

      <mesh
        ref={hitboxRef}
        onPointerMove={onPointerMove}
        onPointerOut={onPointerOut}
        position={[0, 0, 0]}
      >
        <boxGeometry args={hitboxArgs} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

class ModelErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function LoadingAlbum() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.8, 1.8, 0.25]} />
        <meshStandardMaterial color="#111111" roughness={0.35} metalness={0.6} />
      </mesh>
      <Sparkles count={60} speed={0.35} opacity={0.35} scale={[6, 3, 4]} size={1} />
    </group>
  );
}

function MissingAlbum() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.8, 1.8, 0.25]} />
        <meshStandardMaterial color="#0b0b0b" roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  );
}

const CoverView = () => {
  const { transitionState, isVisible } = useSectionTransition('cover');

  return (
    <section
      id="cover"
      className={`snap-section relative min-h-screen overflow-hidden flex items-center justify-center z-10 bg-black ${getTransitionClass(transitionState)}`}
    >
      <div className="absolute inset-0">
        {/* Glow/backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent_45%)]" />
      </div>

      {isVisible && (
        <div className={`relative w-full h-full ${getContentTransitionClass(transitionState)}`}>
          <div className="absolute inset-0">
            <Canvas
              shadows
              dpr={[1, 2]}
              camera={{ position: [0, 0.35, 3.2], fov: 38 }}
              gl={{ antialias: true, alpha: true }}
            >
              <color attach="background" args={['#000000']} />
              <fog attach="fog" args={['#000000', 4.5, 9.5]} />

              <ambientLight intensity={0.35} />
              <directionalLight
                position={[3, 4, 2]}
                intensity={1.2}
                castShadow
                shadow-mapSize={[1024, 1024]}
              />
              <pointLight position={[-3, 1.5, 2.5]} intensity={0.8} color="#ffffff" />
              <spotLight position={[0, 3.5, 4]} intensity={1.1} angle={0.45} penumbra={1} />

              <ModelErrorBoundary fallback={<MissingAlbum />}>
                <Suspense fallback={<LoadingAlbum />}>
                  <CoverAlbum3D transitionState={transitionState} />
                  <Sparkles count={120} speed={0.45} opacity={0.45} scale={[8, 4, 6]} size={1.1} />
                  <Environment preset="warehouse" />
                  <ContactShadows opacity={0.45} blur={2.2} scale={7} far={7} resolution={512} />
                </Suspense>
              </ModelErrorBoundary>
            </Canvas>
          </div>

          {/* Overlay UI (texte/effets) */}
          <div className="relative z-20 w-full h-full pointer-events-none">
            <div className="absolute inset-x-0 top-0 px-4 sm:px-6 md:px-10 pt-10 sm:pt-12">
              <div className="flex items-start justify-between gap-6">
                <div className="max-w-[70ch]">
                  <div className="text-white/70 font-mono text-xs sm:text-sm tracking-[0.35em] uppercase">
                    <DecryptedText text="INTERACTION // COVER" speed={18} />
                  </div>
                  <div className="mt-3 sm:mt-4 text-white font-jaro uppercase leading-[0.92] text-3xl sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-[0_10px_40px_rgba(255,255,255,0.08)]">
                    <SplitText splitBy="letters" delay={0.1}>
                      LA COVER
                    </SplitText>
                  </div>
                  <div className="mt-3 text-white/75 text-xs sm:text-sm md:text-base max-w-[52ch]">
                    <SplitText splitBy="words" delay={0.35}>
                      Survole les bords de l’album pour le “presser” dans la direction.
                    </SplitText>
                  </div>
                </div>

                <div className="hidden md:block text-right">
                  <div className="text-white/60 font-mono text-xs tracking-[0.25em] uppercase">
                    <DecryptedText text="MODE: EDGE PRESS" speed={22} />
                  </div>
                  <div className="mt-2 text-white/40 font-mono text-[10px] tracking-[0.2em] uppercase">
                    gauche / droite / haut / bas
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 px-4 sm:px-6 md:px-10 pb-10 sm:pb-12">
              <AnimatePresence mode="wait">
                {transitionState !== 'exiting' && transitionState !== 'exited' ? (
                  <motion.div
                    key="hint"
                    initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                    transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="flex items-end justify-between gap-6"
                  >
                    <div className="text-white/65 text-xs sm:text-sm font-mono tracking-[0.22em] uppercase">
                      <DecryptedText text="TIP: vise les coins pour une pression maximale" speed={16} />
                    </div>
                    <div className="hidden sm:block text-white/35 text-[10px] font-mono tracking-[0.25em] uppercase">
                      scroll → artiste
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="out"
                    initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="text-white/45 text-[10px] font-mono tracking-[0.3em] uppercase"
                  >
                    <DecryptedText text="SORTIE // FONDU" speed={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Vignettage */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.85)_100%)]" />
          </div>
        </div>
      )}

      {/* Petite note si le GLB n'est pas encore présent */}
      <noscript />
    </section>
  );
};

useGLTF.preload(MODEL_URL);

export default CoverView;
