import { UploadedImage, UploadingImage } from '@/types/image';

const API_KEY = '37da3f5a407cb10f5de04aaddd3b23b1';
const API_URL = 'https://api.imgbb.com/1/upload';
const TIMEOUT = 60000; // 60 seconds

export async function uploadImage(
  file: File,
  onProgress: (progress: number, status: UploadingImage['status']) => void
): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', API_KEY);

  onProgress(0, 'starting');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    // Timeout handling
    const timeoutId = setTimeout(() => {
      xhr.abort();
      reject(new Error('Upload timeout - please try again'));
    }, TIMEOUT);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        
        if (progress < 30) {
          onProgress(progress, 'starting');
        } else if (progress < 90) {
          onProgress(progress, 'uploading');
        } else {
          onProgress(progress, 'almost-done');
        }
      }
    });

    xhr.addEventListener('load', () => {
      clearTimeout(timeoutId);
      
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          
          if (response.success) {
            onProgress(100, 'complete');
            
            resolve({
              id: response.data.id,
              file,
              url: response.data.url,
              deleteUrl: response.data.delete_url,
              thumbnailUrl: response.data.thumb?.url || response.data.url,
              uploadedAt: new Date(),
              size: file.size,
              name: file.name,
            });
          } else {
            reject(new Error(response.error?.message || 'Upload failed'));
          }
        } catch {
          reject(new Error('Failed to parse response'));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      clearTimeout(timeoutId);
      reject(new Error('Network error - please check your connection'));
    });

    xhr.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      reject(new Error('Upload cancelled'));
    });

    xhr.open('POST', API_URL);
    xhr.send(formData);
  });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return success;
  } catch {
    return false;
  }
}
