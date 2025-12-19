import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { DropZone } from '@/components/DropZone';
import { UploadProgress } from '@/components/UploadProgress';
import { ImageGallery } from '@/components/ImageGallery';
import { UploadStats } from '@/components/UploadStats';
import { ViewResultsModal } from '@/components/ViewResultsModal';
import { Button } from '@/components/ui/button';
import { uploadImage, copyToClipboard } from '@/lib/api';
import { UploadedImage, UploadingImage } from '@/types/image';
import { Eye, Trash2 } from 'lucide-react';

const Index = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newUploads: UploadingImage[] = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      progress: 0,
      status: 'starting' as const,
    }));

    setUploadingImages(prev => [...prev, ...newUploads]);

    for (const upload of newUploads) {
      try {
        const result = await uploadImage(
          upload.file,
          (progress, status) => {
            setUploadingImages(prev =>
              prev.map(u =>
                u.id === upload.id ? { ...u, progress, status } : u
              )
            );
          }
        );

        setUploadedImages(prev => [result, ...prev]);
        
        setTimeout(() => {
          setUploadingImages(prev => prev.filter(u => u.id !== upload.id));
        }, 1500);

        toast.success(`✅ ${upload.file.name} uploaded successfully!`);
      } catch (error) {
        setUploadingImages(prev =>
          prev.map(u =>
            u.id === upload.id
              ? { ...u, status: 'error', error: (error as Error).message }
              : u
          )
        );
        
        toast.error(`❌ Failed to upload ${upload.file.name}`);
        
        setTimeout(() => {
          setUploadingImages(prev => prev.filter(u => u.id !== upload.id));
        }, 3000);
      }
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
    toast.success('🗑️ Image deleted');
  }, []);

  const handleDeleteAll = useCallback(() => {
    if (showDeleteAllConfirm) {
      setUploadedImages([]);
      setShowDeleteAllConfirm(false);
      toast.success('🗑️ All images deleted');
    } else {
      setShowDeleteAllConfirm(true);
      setTimeout(() => setShowDeleteAllConfirm(false), 3000);
    }
  }, [showDeleteAllConfirm]);

  const handleCopy = useCallback(async (url: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      toast.success('🔗 URL copied to clipboard!');
    } else {
      toast.error('Failed to copy URL');
    }
  }, []);

  const handleCopyAll = useCallback(async () => {
    const urls = uploadedImages.map(img => img.url).join('\n');
    const success = await copyToClipboard(urls);
    if (success) {
      toast.success(`🔗 ${uploadedImages.length} URLs copied!`);
    } else {
      toast.error('Failed to copy URLs');
    }
  }, [uploadedImages]);

  const isUploading = uploadingImages.some(u => u.status !== 'complete' && u.status !== 'error');

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center animate-fade-slide-up">
          <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-3">
            📸 Image Uploader
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload, manage, and share your images instantly
          </p>
        </header>

        {/* Stats */}
        {uploadedImages.length > 0 && (
          <div className="animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
            <UploadStats images={uploadedImages} />
          </div>
        )}

        {/* Drop Zone */}
        <div className="animate-fade-slide-up" style={{ animationDelay: '200ms' }}>
          <DropZone onFilesSelected={handleFilesSelected} disabled={isUploading} />
        </div>

        {/* Upload Progress */}
        <UploadProgress uploads={uploadingImages} />

        {/* Action Buttons */}
        {uploadedImages.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center animate-fade-slide-up">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="gradient-bg text-primary-foreground btn-3d gap-2"
            >
              <Eye className="w-4 h-4" />
              👁️ View Results
            </Button>
            
            <Button
              variant={showDeleteAllConfirm ? "destructive" : "outline"}
              onClick={handleDeleteAll}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {showDeleteAllConfirm ? '🗑️ Confirm Delete All' : '🗑️ Delete All'}
            </Button>
          </div>
        )}

        {/* Gallery */}
        <section>
          <h2 className="text-2xl font-display font-semibold gradient-text mb-4">
            🖼️ Gallery
          </h2>
          <ImageGallery
            images={uploadedImages}
            onDelete={handleDelete}
            onCopy={handleCopy}
          />
        </section>

        {/* View Results Modal */}
        <ViewResultsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          images={uploadedImages}
          onCopy={handleCopy}
          onCopyAll={handleCopyAll}
        />

        {/* Footer */}
        <footer className="text-center pt-8 pb-4 border-t border-border/30">
          <a
            href="https://github.com/rangga-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
          >
            © {new Date().getFullYear()} @rangga-code
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Index;
