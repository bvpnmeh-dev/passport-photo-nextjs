/**
 * Generate UK Government Digital Photo Code
 * Format: XXXX-XXXX-XXXX-XXXX (16 character alphanumeric)
 */
export function generateUKDigitalCode(photoUuid: string): string {
  // Create a deterministic but unique code based on photoUuid
  const timestamp = Date.now().toString(36).toUpperCase();
  const hash = photoUuid
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");

  // Generate 16-character code in format XXXX-XXXX-XXXX-XXXX
  const part1 = timestamp.slice(0, 4).padEnd(4, "0");
  const part2 = hash.slice(0, 4).padEnd(4, "0");
  const part3 = photoUuid
    .slice(0, 4)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "0");
  const part4 = photoUuid
    .slice(-4)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "0");

  return `${part1}-${part2}-${part3}-${part4}`;
}

/**
 * Generate a QR code URL containing the UK digital code
 */
export function generateUKCodeQRUrl(digitalCode: string): string {
  const baseUrl = "https://api.qrserver.com/v1/create-qr-code/";
  const params = new URLSearchParams({
    size: "200x200",
    data: digitalCode,
  });
  return `${baseUrl}?${params.toString()}`;
}
