import { useState } from 'react';
import { Copy, Trash2, ExternalLink, Check } from 'lucide-react';
import { UploadedImage } from '@/types/image';
import { Button } from '@/components/ui/button';

interface ImageCardProps {
  image: UploadedImage;
  onDelete: (id: string) => void;
  onCopy: (url: string) => void;
  index: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function ImageCard({ image, onDelete, onCopy, index }: ImageCardProps) {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleCopy = async () => {
    await onCopy(image.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(image.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div
      className="glass-card rounded-lg overflow-hidden hover-lift animate-fade-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={image.thumbnailUrl || image.url}
          alt={image.name}
          className="w-full h-full object-cover image-zoom"
        />
        <a
          href={image.url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-foreground/0 hover:bg-foreground/40 transition-colors duration-300 group"
        >
          <ExternalLink className="w-8 h-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </a>
      </div>

      {/* Image info */}
      <div className="p-4">
        <p className="font-medium text-foreground truncate mb-1" title={image.name}>
          {image.name}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span>💾 {formatFileSize(image.size)}</span>
          <span>•</span>
          <span>🕐 {formatTime(image.uploadedAt)}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="flex-1 gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy URL
              </>
            )}
          </Button>

          <Button
            variant={showDeleteConfirm ? "destructive" : "outline"}
            size="sm"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {showDeleteConfirm ? 'Confirm' : ''}
          </Button>
        </div>
      </div>
    </div>
  );
}
