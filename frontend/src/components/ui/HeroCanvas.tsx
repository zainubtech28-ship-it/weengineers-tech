import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const HeroCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasWebGlError, setHasWebGlError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGlError(true);
        return;
      }
    } catch {
      setHasWebGlError(true);
      return;
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
    camera.position.z = 9;

    const rootGroup = new THREE.Group();
    const logoGroup = new THREE.Group();
    rootGroup.add(logoGroup);
    scene.add(rootGroup);

    let loadedCount = 0;
    const W = 4.8;
    const H = (W * 490) / 560;
    const N = 12;
    const c0 = new THREE.Color(0x9a6f16);
    const c1 = new THREE.Color(0x261a04);

    const checkReady = () => {
      loadedCount++;
      if (loadedCount >= 4) {
        setIsReady(true);
      }
    };

    interface StackObject {
      group: THREE.Group;
      materials: THREE.MeshBasicMaterial[];
    }

    const textureLoader = new THREE.TextureLoader();

    const createStack = (src: string): StackObject => {
      const texture = textureLoader.load(src, checkReady, undefined, () => checkReady());
      const group = new THREE.Group();
      const materials: THREE.MeshBasicMaterial[] = [];

      for (let i = N; i >= 0; i--) {
        const mat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          opacity: 0,
          color: i === 0 ? new THREE.Color(0xffffff) : c0.clone().lerp(c1, i / N),
        });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(W, H), mat);
        plane.position.z = -i * 0.03;
        group.add(plane);
        materials.push(mat);
      }
      logoGroup.add(group);
      return { group, materials };
    };

    const ring = createStack('/hero/ring.png');
    const wm = createStack('/hero/w.png');
    const left = createStack('/hero/left.png');
    const right = createStack('/hero/right.png');

    const setOpacity = (stack: StackObject, val: number) => {
      stack.materials.forEach((m) => {
        m.opacity = val;
      });
    };

    // Flare sprite texture
    const flareCanvas = document.createElement('canvas');
    flareCanvas.width = 256;
    flareCanvas.height = 256;
    const ctx = flareCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(255,226,150,0.9)');
      gradient.addColorStop(0.3, 'rgba(232,184,74,0.3)');
      gradient.addColorStop(1, 'rgba(232,184,74,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }
    const flareTex = new THREE.CanvasTexture(flareCanvas);
    const flareMat = new THREE.SpriteMaterial({
      map: flareTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0,
    });
    const flareSprite = new THREE.Sprite(flareMat);
    flareSprite.position.set(0, -0.25, 0.3);
    rootGroup.add(flareSprite);

    // Shockwave torus ring
    const shockMat = new THREE.MeshBasicMaterial({
      color: 0xffe29a,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const shockMesh = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 6, 120), shockMat);
    shockMesh.position.set(0, -0.25, 0);
    rootGroup.add(shockMesh);

    let mx = 0;
    let my = 0;
    const t0 = performance.now();
    let isVisible = true;
    let animationFrameId: number;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mx = (e.clientX - rect.left) / rect.width - 0.5;
      my = (e.clientY - rect.top) / rect.height - 0.5;
    };
    container.addEventListener('pointermove', handlePointerMove);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rootGroup.scale.setScalar(Math.max(0.55, Math.min(1, w / h / 1.05)));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !reduce) {
        animationFrameId = requestAnimationFrame(loop);
      }
    });
    observer.observe(container);

    const ease = (x: number) => {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };

    const renderFrame = (now: number) => {
      const t = reduce ? 9 : (now - t0) / 1000;
      const a = Math.min(Math.max(t / 0.7, 0), 1);
      const e = ease(Math.min(Math.max((t - 0.4) / 2.4, 0), 1));
      const f = Math.max(0, t - 2.8);
      const d = (1 - e) * 4.4;
      const w = ease(Math.min(Math.max((f - 0.15) / 1.1, 0), 1));
      const rg = ease(Math.min(Math.max((f - 0.9) / 1, 0), 1));

      setOpacity(left, a);
      setOpacity(right, a);
      setOpacity(wm, w);
      setOpacity(ring, rg);

      left.group.position.set(-d, Math.sin(t * 2.2) * 0.12 * (1 - e), 0);
      right.group.position.set(d, -Math.sin(t * 2.2) * 0.12 * (1 - e), 0);

      left.group.rotation.y = (1 - e) * 0.6;
      right.group.rotation.y = -(1 - e) * 0.6;
      left.group.rotation.z = -(1 - e) * 0.12;
      right.group.rotation.z = (1 - e) * 0.12;

      wm.group.scale.setScalar(0.82 + 0.18 * w);
      wm.group.position.z = -0.04;
      ring.group.scale.setScalar(0.88 + 0.12 * rg);

      const pop = f > 0 && f < 0.5 ? 1 + Math.sin((f / 0.5) * Math.PI) * 0.04 : 1;
      logoGroup.scale.setScalar(pop);

      flareMat.opacity = f > 0 ? Math.exp(-f * 1.8) : 0;
      flareSprite.scale.setScalar(2 + f * 3);
      shockMesh.scale.setScalar(0.3 + f * 5.5);
      shockMat.opacity = f > 0 ? Math.max(0, 0.9 - f * 0.5) : 0;

      const targetY = Math.sin(t * 0.5) * 0.25 + mx * 0.7;
      const targetX = my * 0.25 + Math.sin(t * 0.4) * 0.04;

      logoGroup.rotation.y += (targetY - logoGroup.rotation.y) * 0.06;
      logoGroup.rotation.x += (targetX - logoGroup.rotation.x) * 0.06;
      logoGroup.position.y = Math.sin(t * 0.9) * 0.08;

      renderer.render(scene, camera);
    };

    const loop = (now: number) => {
      if (!isVisible) return;
      renderFrame(now);
      if (!reduce) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    renderFrame(performance.now());
    if (!reduce) {
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      flareTex.dispose();
      shockMesh.geometry.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[360px] sm:h-[450px] lg:h-[560px] flex items-center justify-center select-none"
      role="img"
      aria-label="WEENGINEERSTECH 3D Interactive Emblem: Hands uniting into the golden technology mark"
    >
      {/* Fallback & Initial State Loader */}
      {(!isReady || hasWebGlError) && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700 ${
            isReady && !hasWebGlError ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="relative w-48 sm:w-64 h-48 sm:h-64 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#e8b84a]/20 via-[#a87a1c]/10 to-transparent blur-2xl animate-pulse" />
            <img
              src="/hero/logo.png"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/LOGO.jpeg';
              }}
              alt="WEENGINEERS TECH Logo"
              className="w-40 sm:w-56 h-auto object-contain filter drop-shadow-[0_0_35px_rgba(232,184,74,0.35)]"
            />
          </div>
        </div>
      )}
    </div>
  );
};
