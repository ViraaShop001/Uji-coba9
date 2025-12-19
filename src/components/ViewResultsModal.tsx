import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { UploadedImage } from '@/types/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ViewResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: UploadedImage[];
  onCopy: (url: string) => void;
  onCopyAll: () => void;
}

export function ViewResultsModal({ isOpen, onClose, images, onCopy, onCopyAll }: ViewResultsModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen) return null;

  const handleCopySingle = async (url: string, index: number) => {
    await onCopy(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    await onCopyAll();
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.currentTarget.select();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl max-h-[80%] glass-card rounded-lg overflow-hidden animate-fade-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-display font-semibold gradient-text">
            👁️ View Results
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-3">
          {images.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No images uploaded yet
            </p>
          ) : (
            images.map((image, index) => (
              <div key={image.id} className="flex gap-2 items-center">
                <Input
                  value={image.url}
                  readOnly
                  onClick={handleInputClick}
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopySingle(image.url, index)}
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {images.length > 0 && (
          <div className="p-4 border-t border-border">
            <Button
              onClick={handleCopyAll}
              className="w-full gradient-bg text-primary-foreground btn-3d"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  All URLs Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All URLs
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
