"use client";

import { useEffect, useRef, useState } from "react";
import { createRenderer } from "@/lib/webgpu/createRenderer";

export function TransmissionExample() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    const renderer = createRenderer({ canvas });

    renderer.ready.catch((err) => {
      if (!cancelled) {
        setError(err instanceof Error ? err.message : "WebGPU failed to initialize.");
      }
    });

    return () => {
      cancelled = true;
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="block h-full w-full touch-none" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/70">
          {error}
        </div>
      )}
    </div>
  );
}

export default TransmissionExample;
