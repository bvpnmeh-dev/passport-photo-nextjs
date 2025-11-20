import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

/**
 * Optimized image compression using browser-image-compression library
 * @param file - The original image file to compress
 * @param options - Compression options (defaults to high quality)
 * @returns Compressed file ready for upload
 */
export async function optimizedCompressImage(
  file: File,
  options: CompressionOptions = {},
): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/jpeg",
    ...options,
  };

  try {
    const compressedFile = await imageCompression(file, defaultOptions);

    // Log compression results
    const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const compressedSizeMB = (compressedFile.size / (1024 * 1024)).toFixed(2);
    console.log(
      `Image compressed: ${originalSizeMB}MB → ${compressedSizeMB}MB`,
    );

    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    throw new Error("Failed to compress image. Please try a smaller file.");
  }
}

/**
 * Validate file before compression
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Only JPEG and PNG files are allowed",
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: "File size must be less than 10MB",
    };
  }

  return { valid: true };
}
