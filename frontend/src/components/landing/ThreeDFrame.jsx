// src/components/landing/ThreeDFrame.jsx
// Single prominent 3D picture frame — the hero visual of the landing page.
// Auto-rotates slowly, tilts with mouse. Product image as texture on inner canvas.
import { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

// ── Shared frame geometry builder ─────────────────────────────────────────────
const W = 1.55, H = 2.0, DEPTH = 0.14, BORDER = 0.17;

function FrameGeometry({ artworkMaterial }) {
  const frameMat = new THREE.MeshStandardMaterial({
    color: '#0a0a0a',
    roughness: 0.35,
    metalness: 0.22,
  });
  const matteMat = new THREE.MeshStandardMaterial({
    color: '#f8f8f8',
    roughness: 0.95,
  });

  return (
    <group>
      {/* Top bar */}
      <mesh position={[0, H / 2 - BORDER / 2, 0]} material={frameMat} castShadow>
        <boxGeometry args={[W, BORDER, DEPTH]} />
      </mesh>
      {/* Bottom bar */}
      <mesh position={[0, -(H / 2 - BORDER / 2), 0]} material={frameMat} castShadow>
        <boxGeometry args={[W, BORDER, DEPTH]} />
      </mesh>
      {/* Left bar */}
      <mesh position={[-(W / 2 - BORDER / 2), 0, 0]} material={frameMat} castShadow>
        <boxGeometry args={[BORDER, H - BORDER * 2, DEPTH]} />
      </mesh>
      {/* Right bar */}
      <mesh position={[(W / 2 - BORDER / 2), 0, 0]} material={frameMat} castShadow>
        <boxGeometry args={[BORDER, H - BORDER * 2, DEPTH]} />
      </mesh>
      {/* White matte liner */}
      <mesh position={[0, 0, DEPTH / 2 - 0.002]} material={matteMat}>
        <planeGeometry args={[W - BORDER * 2 + 0.06, H - BORDER * 2 + 0.06]} />
      </mesh>
      {/* Artwork surface */}
      <mesh position={[0, 0, DEPTH / 2 + 0.003]} material={artworkMaterial}>
        <planeGeometry args={[W - BORDER * 2 - 0.02, H - BORDER * 2 - 0.02]} />
      </mesh>
    </group>
  );
}

// ── Frame with texture (suspends until loaded) ────────────────────────────────
function FrameWithTexture({ textureUrl, groupRef, mouseRef }) {
  const texture = useLoader(TextureLoader, textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter  = THREE.LinearFilter;
  texture.magFilter  = THREE.LinearFilter;

  const artworkMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.65,
    metalness: 0.0,
  });

  return <FrameGeometry artworkMaterial={artworkMat} />;
}

// ── Plain frame (no texture) ──────────────────────────────────────────────────
function FrameNoTexture() {
  const artworkMat = new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    roughness: 0.85,
  });
  return <FrameGeometry artworkMaterial={artworkMat} />;
}

// ── Animated wrapper (handles rotation + mouse tilt) ─────────────────────────
function AnimatedFrame({ product }) {
  const groupRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });
  const imageUrl = product?.images?.[0];

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    // Slow dramatic Y rotation
    groupRef.current.rotation.y += delta * 0.18;
    // Mouse-driven X tilt — smooth lerp
    groupRef.current.rotation.x +=
      (mouseRef.current.y * -0.35 - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {imageUrl ? (
        <Suspense fallback={<FrameNoTexture />}>
          <FrameWithTexture
            textureUrl={imageUrl}
            groupRef={groupRef}
            mouseRef={mouseRef}
          />
        </Suspense>
      ) : (
        <FrameNoTexture />
      )}
    </group>
  );
}

// ── Scene lighting ────────────────────────────────────────────────────────────
function Scene({ product }) {
  return (
    <>
      {/* Warm key light from top-right */}
      <pointLight position={[4, 5, 4]}  intensity={2.2}  color="#ffffff" />
      {/* Cool fill from bottom-left */}
      <pointLight position={[-3, -2, 3]} intensity={0.6}  color="#d0d8ff" />
      {/* Rim light from behind-right for edge separation */}
      <pointLight position={[3, 0, -3]} intensity={0.4}  color="#ffffff" />
      {/* Ambient base */}
      <ambientLight intensity={0.5} />
      <AnimatedFrame product={product} />
    </>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────
export default function ThreeDFrame({ product }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.2], fov: 46 }}
      gl={{
        powerPreference: 'high-performance',
        antialias:       false,
        alpha:           true,
      }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <Scene product={product} />
    </Canvas>
  );
}
