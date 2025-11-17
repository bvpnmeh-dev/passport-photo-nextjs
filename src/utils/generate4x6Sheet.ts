/**
 * Generate a 4x6 inch sheet with 4 copies of the passport photo
 * Returns a canvas with the layout
 */
export async function generate4x6Sheet(
  imageUrl: string,
  photoWidthPx: number,
  photoHeightPx: number,
): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      // Load the image
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      img.onload = () => {
        // Create canvas for 4x6 inch at 300 DPI
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // 4x6 inches at 300 DPI
        const sheetWidth = 4 * 300; // 1200px
        const sheetHeight = 6 * 300; // 1800px
        
        canvas.width = sheetWidth;
        canvas.height = sheetHeight;

        // Fill with white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, sheetWidth, sheetHeight);

        // Calculate positions for 4 photos in 2x2 grid
        const spacing = 20; // 20px spacing between photos
        const photoWidth = photoWidthPx;
        const photoHeight = photoHeightPx;

        // Calculate grid positioning (centered)
        const totalGridWidth = photoWidth * 2 + spacing;
        const totalGridHeight = photoHeight * 2 + spacing;
        const startX = (sheetWidth - totalGridWidth) / 2;
        const startY = (sheetHeight - totalGridHeight) / 2;

        // Draw 4 copies in 2x2 grid
        const positions = [
          { x: startX, y: startY }, // Top left
          { x: startX + photoWidth + spacing, y: startY }, // Top right
          { x: startX, y: startY + photoHeight + spacing }, // Bottom left
          { x: startX + photoWidth + spacing, y: startY + photoHeight + spacing }, // Bottom right
        ];

        positions.forEach(pos => {
          ctx.drawImage(img, pos.x, pos.y, photoWidth, photoHeight);
        });

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        }, "image/jpeg", 0.95);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = imageUrl;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Download the 4x6 sheet
 */
export async function download4x6Sheet(
  imageUrl: string,
  photoWidthPx: number,
  photoHeightPx: number,
  filename: string,
): Promise<void> {
  const blob = await generate4x6Sheet(imageUrl, photoWidthPx, photoHeightPx);
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.parentNode?.removeChild(a);
  URL.revokeObjectURL(url);
}
