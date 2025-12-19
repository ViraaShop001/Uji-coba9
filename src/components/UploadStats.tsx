import { UploadedImage } from '@/types/image';

interface UploadStatsProps {
  images: UploadedImage[];
}

function formatTotalSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function UploadStats({ images }: UploadStatsProps) {
  const totalSize = images.reduce((acc, img) => acc + img.size, 0);
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="glass-card rounded-lg p-6 hover-lift">
        <div className="text-3xl mb-2">📸</div>
        <p className="text-3xl font-display font-bold gradient-text">
          {images.length}
        </p>
        <p className="text-sm text-muted-foreground">
          Total Images
        </p>
      </div>
      
      <div className="glass-card rounded-lg p-6 hover-lift">
        <div className="text-3xl mb-2">💾</div>
        <p className="text-3xl font-display font-bold gradient-text">
          {formatTotalSize(totalSize)}
        </p>
        <p className="text-sm text-muted-foreground">
          Total Size
        </p>
      </div>
    </div>
  );
}
