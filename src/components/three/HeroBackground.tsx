"use client";

import { useEffect, useRef } from "react";

/**
 * Three.js is imported at RUNTIME inside useEffect — not at module level.
 * This keeps it out of the esbuild analysis graph at build time so the
 * Cloudflare Worker bundle stays fast and lightweight.
 */
export default function HeroBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let active = true;
    let frame = 0;
    let threeCleanup: (() => void) | null = null;

    import("three").then((THREE) => {
      if (!active) return;

      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.z = 6;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const COUNT = 220;
      const positions = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: 0x2f88ff,
        size: 0.05,
        transparent: true,
        opacity: 0.55,
        sizeAttenuation: true,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const tick = () => {
        if (!active) return;
        points.rotation.y += 0.0009;
        points.rotation.x += 0.0004;
        renderer.render(scene, camera);
        if (!reduceMotion) frame = requestAnimationFrame(tick);
      };
      if (reduceMotion) renderer.render(scene, camera);
      else tick();

      const onResize = () => {
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener("resize", onResize);

      threeCleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", onResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        try { mount.removeChild(renderer.domElement); } catch { /* already removed */ }
      };
    });

    return () => {
      active = false;
      threeCleanup?.();
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden />;
}
