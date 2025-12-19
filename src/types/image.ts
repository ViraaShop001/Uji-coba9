export interface UploadedImage {
  id: string;
  file: File;
  url: string;
  deleteUrl: string;
  thumbnailUrl: string;
  uploadedAt: Date;
  size: number;
  name: string;
}

export interface UploadingImage {
  id: string;
  file: File;
  progress: number;
  status: 'starting' | 'uploading' | 'almost-done' | 'complete' | 'error';
  error?: string;
}

export type UploadStatus = UploadingImage['status'];
