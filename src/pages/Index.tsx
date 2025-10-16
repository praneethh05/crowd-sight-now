import { useState, useEffect, useCallback } from 'react';
import { VideoUpload } from '@/components/VideoUpload';
import { VideoPlayer } from '@/components/VideoPlayer';
import { HeatmapCanvas } from '@/components/HeatmapCanvas';
import { AnalyticsPanel } from '@/components/AnalyticsPanel';
import { ControlPanel } from '@/components/ControlPanel';
import { toast } from 'sonner';
import { Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Simulated detection data generator
const generateDetections = (frameNumber: number, intensity: number = 1) => {
  const count = Math.floor(Math.random() * 15 * intensity) + 5;
  return Array.from({ length: count }, () => ({
    x: Math.random() * 0.8 + 0.1,
    y: Math.random() * 0.8 + 0.1,
    width: 0.05 + Math.random() * 0.05,
    height: 0.08 + Math.random() * 0.08,
  }));
};

const Index = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames] = useState(300);
  const [detections, setDetections] = useState<Array<{ x: number; y: number; width: number; height: number }>>([]);
  const [detectionHistory, setDetectionHistory] = useState<Array<Array<{ x: number; y: number }>>>([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [peakCount, setPeakCount] = useState(0);
  const [fps] = useState(25);

  const handleVideoSelect = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setVideoFile(file);
    setCurrentFrame(0);
    setDetections([]);
    setDetectionHistory([]);
    setCurrentCount(0);
    setPeakCount(0);
    toast.success('Video uploaded successfully!');
  }, []);

  const handleStartAnalysis = useCallback(() => {
    if (!videoFile) return;
    setIsAnalyzing(true);
    toast.info('Analysis started - Watch live detections!');
  }, [videoFile]);

  const handlePauseAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    toast.info('Analysis paused');
  }, []);

  const handleStopAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    setCurrentFrame(0);
    setDetections([]);
    toast.info('Analysis stopped');
  }, []);

  const handleDownload = useCallback(() => {
    toast.success('Processed video ready for download!');
    // In real implementation, this would trigger video download
  }, []);

  const handleReset = useCallback(() => {
    setIsAnalyzing(false);
    setVideoFile(null);
    setVideoUrl('');
    setCurrentFrame(0);
    setDetections([]);
    setDetectionHistory([]);
    setCurrentCount(0);
    setPeakCount(0);
    toast.info('Ready for new video upload');
  }, []);

  // Simulate real-time analysis
  useEffect(() => {
    if (!isAnalyzing) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        if (prev >= totalFrames) {
          setIsAnalyzing(false);
          toast.success('Analysis complete!');
          return prev;
        }

        // Generate detections with varying intensity
        const intensity = 0.5 + Math.sin(prev / 30) * 0.5; // Oscillating crowd density
        const newDetections = generateDetections(prev, intensity);
        
        setDetections(newDetections);
        
        // Update count
        const count = newDetections.length;
        setCurrentCount(count);
        setPeakCount((prevPeak) => Math.max(prevPeak, count));
        
        // Store detection positions for heatmap
        setDetectionHistory((prevHistory) => {
          const newHistory = [
            ...prevHistory,
            newDetections.map((d) => ({ x: d.x, y: d.y })),
          ];
          // Keep last 100 frames for heatmap
          return newHistory.slice(-100);
        });

        return prev + 1;
      });
    }, 1000 / fps); // Run at specified FPS

    return () => clearInterval(interval);
  }, [isAnalyzing, totalFrames, fps]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Eye className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Crowd Density Analyzer</h1>
                <p className="text-sm text-muted-foreground">YOLOv11 Real-time Detection</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Upload Section */}
        {!videoFile && (
          <div className="max-w-2xl mx-auto mb-8">
            <VideoUpload onVideoSelect={handleVideoSelect} />
          </div>
        )}

        {/* Analysis Dashboard */}
        {videoFile && (
          <div className="space-y-6">
            {/* Back Button */}
            <div className="flex justify-start">
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Upload New Video
              </Button>
            </div>

            {/* Controls */}
            <div className="flex justify-center">
              <ControlPanel
                isAnalyzing={isAnalyzing}
                hasVideo={!!videoFile}
                onStartAnalysis={handleStartAnalysis}
                onPauseAnalysis={handlePauseAnalysis}
                onStopAnalysis={handleStopAnalysis}
                onDownload={handleDownload}
              />
            </div>

            {/* Video and Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Video Player */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card rounded-lg p-4 border border-border shadow-card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Live Detection Feed</h2>
                    {isAnalyzing && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-sm text-muted-foreground">Live</span>
                      </div>
                    )}
                  </div>
                  <div className="aspect-video">
                    <VideoPlayer
                      videoUrl={videoUrl}
                      detections={detections}
                      isPlaying={isAnalyzing}
                    />
                  </div>
                </div>

                {/* Heatmap */}
                <div className="bg-card rounded-lg p-4 border border-border shadow-card">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Density Heatmap</h2>
                  <div className="aspect-video">
                    <HeatmapCanvas
                      detectionHistory={detectionHistory}
                      width={640}
                      height={360}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Analytics Panel */}
              <div>
                <AnalyticsPanel
                  currentCount={currentCount}
                  peakCount={peakCount}
                  totalFrames={totalFrames}
                  currentFrame={currentFrame}
                  fps={fps}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
