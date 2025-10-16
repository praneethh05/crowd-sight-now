import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  detections: Array<{ x: number; y: number; width: number; height: number }>;
  isPlaying: boolean;
}

export const VideoPlayer = ({ videoUrl, detections, isPlaying }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.play();
      } else {
        video.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    const drawDetections = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      if (!canvas || !video) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw detection boxes
      ctx.strokeStyle = 'hsl(195 100% 50%)';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'hsl(195 100% 50% / 0.5)';
      ctx.shadowBlur = 10;

      detections.forEach((detection) => {
        ctx.strokeRect(
          detection.x * canvas.width,
          detection.y * canvas.height,
          detection.width * canvas.width,
          detection.height * canvas.height
        );
      });
    };

    const interval = setInterval(drawDetections, 100);
    return () => clearInterval(interval);
  }, [detections]);

  return (
    <div className="relative w-full h-full bg-secondary rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        loop
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};
