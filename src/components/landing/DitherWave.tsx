import { useEffect, useRef } from 'react';

interface DitherWaveProps {
  className?: string;
  pixelSize?: number;
  speed?: number;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  waveBaseHeight?: number; // 0.0 - 1.0 (relative to canvas height)
  amplitude?: number;
  ditherDepth?: number;
  interactive?: boolean;
}

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export function DitherWave({
  className = '',
  pixelSize = 5,
  speed = 0.6,
  primaryColor = '#7C3AED', // Electric purple from Image 1
  secondaryColor = '#4C1D95', // Deep violet back layer
  backgroundColor = 'transparent',
  waveBaseHeight = 0.55,
  amplitude = 55,
  ditherDepth = 90,
  interactive = true,
}: DitherWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let time = 0;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = (e.clientY - rect.top) / rect.height;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const render = () => {
      if (!ctx || width === 0 || height === 0) return;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (!prefersReducedMotion) {
        time += 0.016 * speed;
      }

      ctx.clearRect(0, 0, width, height);

      if (backgroundColor && backgroundColor !== 'transparent') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      const pSize = pixelSize;
      const cols = Math.ceil(width / pSize);
      const rows = Math.ceil(height / pSize);
      const baseH = height * waveBaseHeight;
      const mouseFactorX = (mouseRef.current.x - 0.5) * 40;
      const mouseFactorY = (mouseRef.current.y - 0.5) * 30;

      // We render 2 wave layers:
      // Layer 1: Secondary deeper violet wave (behind)
      // Layer 2: Primary electric violet wave (in front)

      // Precalculate wave heights for performance
      const waveFront = new Float32Array(cols);
      const waveBack = new Float32Array(cols);

      for (let c = 0; c < cols; c++) {
        const x = c * pSize;
        const normX = x / width;

        // Dynamic multi-frequency sinusoidal waves that morph over time
        const frontCurve =
          Math.sin(normX * 4.2 + time * 1.1 + mouseFactorX * 0.02) * (amplitude * 0.65) +
          Math.cos(normX * 7.5 - time * 0.8) * (amplitude * 0.35) +
          Math.sin(normX * 12.0 + time * 1.8) * 8 +
          mouseFactorY * 0.5;

        const backCurve =
          Math.cos(normX * 3.6 + time * 0.7 - 1.2) * (amplitude * 0.85) +
          Math.sin(normX * 6.8 + time * 0.9) * (amplitude * 0.4) +
          Math.cos(normX * 11.2 - time * 1.4) * 10 -
          35; // Positioned slightly higher

        waveFront[c] = baseH + frontCurve;
        waveBack[c] = baseH + backCurve;
      }

      // Draw Layer 1: Secondary wave (deep violet back)
      ctx.fillStyle = secondaryColor;
      for (let r = 0; r < rows; r++) {
        const y = r * pSize;
        for (let c = 0; c < cols; c++) {
          const wY = waveBack[c];
          if (y < wY) continue;

          if (y >= wY + ditherDepth * 0.9) {
            // Full fill in back
            ctx.fillRect(c * pSize, y, pSize, pSize);
          } else {
            // Dither zone
            const ratio = (y - wY) / (ditherDepth * 0.9);
            const bayerVal = BAYER_4X4[c % 4][r % 4] / 16;
            if (ratio >= bayerVal) {
              ctx.fillRect(c * pSize, y, pSize, pSize);
            }
          }
        }
      }

      // Draw Layer 2: Primary wave (electric purple front)
      ctx.fillStyle = primaryColor;
      for (let r = 0; r < rows; r++) {
        const y = r * pSize;
        for (let c = 0; c < cols; c++) {
          const wY = waveFront[c];
          if (y < wY) continue;

          if (y >= wY + ditherDepth) {
            // Solid wave body
            ctx.fillRect(c * pSize, y, pSize, pSize);
          } else {
            // Bayer Dither transition
            const ratio = (y - wY) / ditherDepth;
            const bayerVal = BAYER_4X4[c % 4][r % 4] / 16;
            if (ratio >= bayerVal) {
              ctx.fillRect(c * pSize, y, pSize, pSize);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [
    pixelSize,
    speed,
    primaryColor,
    secondaryColor,
    backgroundColor,
    waveBaseHeight,
    amplitude,
    ditherDepth,
    interactive,
  ]);

  return <canvas ref={canvasRef} className={`w-full h-full block ${className}`} />;
}
