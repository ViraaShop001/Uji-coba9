import { UploadedImage } from '@/types/image';
import { ImageCard } from './ImageCard';

interface ImageGalleryProps {
  images: UploadedImage[];
  onDelete: (id: string) => void;
  onCopy: (url: string) => void;
}

export function ImageGallery({ images, onDelete, onCopy }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <div className="glass-card rounded-lg p-12 text-center">
        <div className="text-6xl mb-4">🖼️</div>
        <h3 className="text-xl font-display font-semibold text-foreground mb-2">
          No images yet
        </h3>
        <p className="text-muted-foreground">
          Upload some images to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image, index) => (
        <ImageCard
          key={image.id}
          image={image}
          onDelete={onDelete}
          onCopy={onCopy}
          index={index}
        />
      ))}
    </div>
  );
}
