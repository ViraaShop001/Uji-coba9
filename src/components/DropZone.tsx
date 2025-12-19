import { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_SIZE = 32 * 1024 * 1024; // 32MB
const MAX_FILES = 999;

export function DropZone({ onFilesSelected, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const validateFiles = useCallback((files: FileList | File[]): File[] => {
    const fileArray = Array.from(files);
    return fileArray
      .filter(file => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          console.warn(`Invalid file type: ${file.name}`);
          return false;
        }
        if (file.size > MAX_SIZE) {
          console.warn(`File too large: ${file.name}`);
          return false;
        }
        return true;
      })
      .slice(0, MAX_FILES);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    const validFiles = validateFiles(e.dataTransfer.files);
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  }, [disabled, validateFiles, onFilesSelected]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && !disabled) {
      const validFiles = validateFiles(e.target.files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
    e.target.value = '';
  }, [disabled, validateFiles, onFilesSelected]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative overflow-hidden rounded-lg transition-all duration-300
        ${isDragging ? 'animate-pulse-scale' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {/* Gradient border wrapper */}
      <div className={`
        gradient-border p-[3px] rounded-lg
        ${isDragging ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
        transition-opacity duration-300
      `}>
        <label
          className={`
            gradient-border-inner flex flex-col items-center justify-center
            p-8 md:p-12 rounded-lg bg-card
            ${!disabled ? 'hover:bg-muted/50' : ''}
            transition-colors duration-300
          `}
        >
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.gif"
            onChange={handleFileInput}
            disabled={disabled}
            className="sr-only"
          />
          
          <div className={`
            w-20 h-20 rounded-full gradient-bg flex items-center justify-center
            mb-6 transition-transform duration-300
            ${isDragging ? 'scale-110' : ''}
          `}>
            {isDragging ? (
              <ImageIcon className="w-10 h-10 text-primary-foreground" />
            ) : (
              <Upload className="w-10 h-10 text-primary-foreground" />
            )}
          </div>
          
          <h3 className="text-xl md:text-2xl font-display font-semibold gradient-text mb-2">
            {isDragging ? '📸 Drop images here!' : '📸 Upload Images'}
          </h3>
          
          <p className="text-muted-foreground text-center mb-4">
            Drag & drop or <span className="text-primary font-medium">browse</span> to select
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-muted">JPG</span>
            <span className="px-3 py-1 rounded-full bg-muted">PNG</span>
            <span className="px-3 py-1 rounded-full bg-muted">GIF</span>
            <span className="px-3 py-1 rounded-full bg-muted">Max 32MB</span>
          </div>
        </label>
      </div>
    </div>
  );
}
