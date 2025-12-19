import { UploadingImage } from '@/types/image';

interface UploadProgressProps {
  uploads: UploadingImage[];
}

function getStatusText(status: UploadingImage['status'], progress: number): string {
  switch (status) {
    case 'starting':
      return '⏳ Starting upload…';
    case 'uploading':
      return `📤 Uploading… ${progress}%`;
    case 'almost-done':
      return '✨ Almost done…';
    case 'complete':
      return '✅ Upload complete!';
    case 'error':
      return '❌ Upload failed';
    default:
      return 'Preparing…';
  }
}

function ProgressBar({ progress, status }: { progress: number; status: UploadingImage['status'] }) {
  const isError = status === 'error';
  
  return (
    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
      <div
        className={`
          absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out
          ${isError ? 'bg-destructive' : 'gradient-bg animate-gradient-flow'}
        `}
        style={{ width: `${progress}%` }}
      />
      {!isError && progress < 100 && (
        <div
          className="absolute inset-y-0 left-0 rounded-full animate-shimmer"
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
}

export function UploadProgress({ uploads }: UploadProgressProps) {
  if (uploads.length === 0) return null;

  const activeUploads = uploads.filter(u => u.status !== 'complete');
  const completedCount = uploads.filter(u => u.status === 'complete').length;
  
  if (activeUploads.length === 0 && completedCount > 0) {
    return (
      <div className="glass-card rounded-lg p-4 animate-fade-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
            <span className="text-lg">✅</span>
          </div>
          <div>
            <p className="font-medium text-foreground">
              All uploads complete!
            </p>
            <p className="text-sm text-muted-foreground">
              {completedCount} image{completedCount !== 1 ? 's' : ''} uploaded successfully
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeUploads.map((upload) => (
        <div
          key={upload.id}
          className="glass-card rounded-lg p-4 animate-fade-slide-up"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              <img
                src={URL.createObjectURL(upload.file)}
                alt={upload.file.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {upload.file.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {getStatusText(upload.status, upload.progress)}
              </p>
            </div>
          </div>
          <ProgressBar progress={upload.progress} status={upload.status} />
        </div>
      ))}
    </div>
  );
}
