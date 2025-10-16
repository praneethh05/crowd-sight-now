import { useEffect, useRef } from 'react';

interface HeatmapCanvasProps {
  detectionHistory: Array<Array<{ x: number; y: number }>>;
  width: number;
  height: number;
}

export const HeatmapCanvas = ({ detectionHistory, width, height }: HeatmapCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.fillStyle = 'hsl(220 20% 12%)';
    ctx.fillRect(0, 0, width, height);

    // Create heatmap from detection history
    const heatmapData: number[][] = Array(height)
      .fill(0)
      .map(() => Array(width).fill(0));

    // Accumulate detections
    detectionHistory.forEach((frame) => {
      frame.forEach((detection) => {
        const x = Math.floor(detection.x * width);
        const y = Math.floor(detection.y * height);
        
        // Add heat around detection point
        for (let dy = -20; dy <= 20; dy++) {
          for (let dx = -20; dx <= 20; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const distance = Math.sqrt(dx * dx + dy * dy);
              const intensity = Math.max(0, 1 - distance / 20);
              heatmapData[ny][nx] += intensity;
            }
          }
        }
      });
    });

    // Find max value for normalization
    const maxHeat = Math.max(...heatmapData.flat());

    // Draw heatmap
    if (maxHeat > 0) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const normalizedHeat = heatmapData[y][x] / maxHeat;
          
          if (normalizedHeat > 0.1) {
            // Create color gradient from yellow to red
            let color;
            if (normalizedHeat < 0.5) {
              // Yellow to orange
              const t = normalizedHeat * 2;
              color = `rgba(255, ${255 - t * 100}, 0, ${normalizedHeat * 0.8})`;
            } else {
              // Orange to red
              const t = (normalizedHeat - 0.5) * 2;
              color = `rgba(255, ${155 - t * 155}, 0, ${normalizedHeat * 0.8})`;
            }
            
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    }

    // Add grid overlay
    ctx.strokeStyle = 'hsl(220 15% 20% / 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
  }, [detectionHistory, width, height]);

  return (
    <div className="relative w-full h-full bg-secondary rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full object-contain" />
      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border">
        <p className="text-xs font-medium text-foreground">Crowd Density Heatmap</p>
      </div>
    </div>
  );
};
