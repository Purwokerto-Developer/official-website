'use client';

import React from 'react';
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';

import { useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';

export default function InputImage({
  value,
  onChange,
  previousImage,
  disabled,
}: {
  value?: any;
  onChange?: (file: any) => void;
  previousImage?: string;
  disabled?: boolean;
}) {
  const maxSizeMB = 5; // allow up to 5 MB per image
  const maxSize = maxSizeMB * 1024 * 1024;
  const [isCompressing, setIsCompressing] = React.useState(false);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif',
    maxSize,
    multiple: false,
    initialFiles: value ? [value] : [],
    onFilesAdded: async (addedFiles) => {
      // Compress images after they're added
      if (addedFiles.length > 0 && addedFiles[0].file instanceof File) {
        const file = addedFiles[0].file;
        if (file.type.startsWith('image/') && !file.type.includes('svg')) {
          setIsCompressing(true);
          try {
            const compressedFile = await imageCompression(file, {
              maxSizeMB: 1, // Compress to max 1MB
              maxWidthOrHeight: 1920, // Max width/height
              useWebWorker: true,
              fileType: 'image/jpeg', // Convert to JPEG for better compression
            });

            // Replace the file in the files array
            const updatedFiles = [...files];
            const fileIndex = updatedFiles.findIndex((f) => f.id === addedFiles[0].id);
            if (fileIndex !== -1) {
              updatedFiles[fileIndex] = {
                ...updatedFiles[fileIndex],
                file: compressedFile,
                preview: URL.createObjectURL(compressedFile),
              };
              // Update the parent form
              if (onChange) {
                onChange({ file: compressedFile, preview: URL.createObjectURL(compressedFile) });
              }
            }
            setIsCompressing(false);
          } catch (error) {
            console.error('Image compression failed:', error);
            setIsCompressing(false);
          }
        }
      }
    },
  });

  // Sync with parent form
  React.useEffect(() => {
    if (onChange) {
      onChange(files[0] || null);
    }
  }, [files, onChange]);

  const previewUrl = files[0]?.preview || previousImage || null;

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div
          onDragEnter={disabled ? undefined : handleDragEnter}
          onDragLeave={disabled ? undefined : handleDragLeave}
          onDragOver={disabled ? undefined : handleDragOver}
          onDrop={disabled ? undefined : handleDrop}
          data-dragging={isDragging || undefined}
          className={`border-input has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px] ${disabled ? 'pointer-events-none bg-gray-100 opacity-60' : ''}`}
        >
          <input
            {...getInputProps()}
            className="sr-only"
            aria-label="Upload image file"
            disabled={disabled}
          />
          {previewUrl ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <Image
                src={previewUrl}
                alt={files[0]?.file?.name || 'Uploaded image'}
                width={200}
                height={200}
                className="mx-auto max-h-full rounded object-contain"
                sizes="200px"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
              <div
                className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <ImageIcon className="size-4 opacity-60" />
              </div>
              {isCompressing ? (
                <>
                  <p className="mb-1.5 text-sm font-medium">Compressing image...</p>
                  <p className="text-muted-foreground text-xs">Please wait</p>
                </>
              ) : (
                <>
                  <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
                  <p className="text-muted-foreground text-xs">
                    SVG, PNG, JPG or GIF (max. {maxSizeMB}MB, auto-compressed)
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={openFileDialog}
                    disabled={disabled || isCompressing}
                  >
                    <UploadIcon className="-ms-1 size-4 opacity-60" aria-hidden="true" />
                    Select image
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {previewUrl && (
          <div className="absolute top-4 right-4">
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:ring-[3px]"
              onClick={() => removeFile(files[0]?.id)}
              aria-label="Remove image"
              disabled={disabled}
            >
              <XIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
}
