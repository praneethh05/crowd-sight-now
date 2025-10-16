import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Download } from 'lucide-react';

interface ControlPanelProps {
  isAnalyzing: boolean;
  hasVideo: boolean;
  onStartAnalysis: () => void;
  onPauseAnalysis: () => void;
  onStopAnalysis: () => void;
  onDownload: () => void;
}

export const ControlPanel = ({
  isAnalyzing,
  hasVideo,
  onStartAnalysis,
  onPauseAnalysis,
  onStopAnalysis,
  onDownload,
}: ControlPanelProps) => {
  return (
    <div className="flex items-center gap-3">
      {!isAnalyzing ? (
        <Button
          onClick={onStartAnalysis}
          disabled={!hasVideo}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 shadow-glow"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Analysis
        </Button>
      ) : (
        <>
          <Button
            onClick={onPauseAnalysis}
            variant="secondary"
            size="lg"
          >
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </Button>
          <Button
            onClick={onStopAnalysis}
            variant="destructive"
            size="lg"
          >
            <Square className="w-5 h-5 mr-2" />
            Stop
          </Button>
        </>
      )}
      <Button
        onClick={onDownload}
        disabled={!hasVideo}
        variant="outline"
        size="lg"
      >
        <Download className="w-5 h-5 mr-2" />
        Download Results
      </Button>
    </div>
  );
};
