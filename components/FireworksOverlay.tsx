"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
};

type FireworksOverlayProps = {
  active: boolean;
};

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function FireworksOverlay({ active }: FireworksOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrame = 0;
    let particles: Particle[] = [];
    let burstTimer = 0;
    const durationMs = 5200;
    const startedAt = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;

      if (!parent) {
        return;
      }

      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnBurst = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const originX = randomBetween(width * 0.18, width * 0.82);
      const originY = randomBetween(height * 0.18, height * 0.48);
      const hue = randomBetween(18, 58);
      const count = Math.floor(randomBetween(28, 44));

      for (let index = 0; index < count; index += 1) {
        const angle = randomBetween(0, Math.PI * 2);
        const speed = randomBetween(1.4, 4.8);
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: randomBetween(42, 72),
          hue: hue + randomBetween(-16, 16),
          size: randomBetween(1.4, 2.8)
        });
      }
    };

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      context.clearRect(0, 0, width, height);
      burstTimer += 1;

      if (burstTimer % 14 === 0 && elapsed < durationMs - 600) {
        spawnBurst();
      }

      particles = particles.filter((particle) => {
        particle.life += 1;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.045;
        particle.vx *= 0.985;

        const alpha = 1 - particle.life / particle.maxLife;

        if (alpha <= 0) {
          return false;
        }

        context.beginPath();
        context.fillStyle = `hsla(${particle.hue}, 92%, 62%, ${alpha})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();

        return true;
      });

      if (elapsed < durationMs || particles.length > 0) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    resize();
    spawnBurst();
    spawnBurst();
    animationFrame = window.requestAnimationFrame(tick);

    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return <canvas ref={canvasRef} className="fireworks-overlay" aria-hidden="true" />;
}
