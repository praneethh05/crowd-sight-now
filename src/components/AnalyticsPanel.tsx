import { Users, TrendingUp, Activity } from 'lucide-react';

interface AnalyticsPanelProps {
  currentCount: number;
  peakCount: number;
  totalFrames: number;
  currentFrame: number;
  fps: number;
}

export const AnalyticsPanel = ({
  currentCount,
  peakCount,
  totalFrames,
  currentFrame,
  fps,
}: AnalyticsPanelProps) => {
  const progress = totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Live Count */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-card animate-slide-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Current Count</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-5xl font-bold text-foreground animate-pulse-glow">
            {currentCount}
          </p>
          <span className="text-lg text-muted-foreground">people</span>
        </div>
      </div>

      {/* Peak Count */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-card animate-slide-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-heat-high/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-heat-high" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Peak Density</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-4xl font-bold text-foreground">{peakCount}</p>
          <span className="text-lg text-muted-foreground">max</span>
        </div>
      </div>

      {/* Processing Stats */}
      <div className="bg-card rounded-lg p-6 border border-border shadow-card animate-slide-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Activity className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">Processing Status</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Frame Progress</span>
              <span className="text-foreground font-medium">
                {currentFrame} / {totalFrames}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Processing Rate</span>
            <span className="text-foreground font-medium">{fps.toFixed(1)} fps</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-card rounded-lg p-4 border border-border shadow-card animate-slide-in" style={{ animationDelay: '0.3s' }}>
        <h4 className="text-xs font-medium text-muted-foreground mb-3">Density Scale</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-heat-low" />
            <span className="text-xs text-muted-foreground">Low (1-5 people)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-heat-medium" />
            <span className="text-xs text-muted-foreground">Medium (6-15 people)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-heat-high" />
            <span className="text-xs text-muted-foreground">High (15+ people)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
