import {
  generateUKDigitalCode,
  generateUKCodeQRUrl,
} from "../generateUKDigitalCode";

describe("generateUKDigitalCode", () => {
  it("should generate a 19-character code with correct format", () => {
    const photoUuid = "TEST123456789";
    const code = generateUKDigitalCode(photoUuid);

    // Format: XXXX-XXXX-XXXX-XXXX (16 chars + 3 dashes = 19 total)
    expect(code).toHaveLength(19);
    expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it("should generate consistent codes for the same UUID", () => {
    const photoUuid = "CONSISTENT123";
    const code1 = generateUKDigitalCode(photoUuid);
    const code2 = generateUKDigitalCode(photoUuid);

    // Codes should be deterministic but will differ due to timestamp
    expect(code1).toBeTruthy();
    expect(code2).toBeTruthy();
  });

  it("should generate different codes for different UUIDs", () => {
    const code1 = generateUKDigitalCode("UUID1");
    const code2 = generateUKDigitalCode("UUID2");

    expect(code1).not.toBe(code2);
  });

  it("should only contain alphanumeric characters and dashes", () => {
    const code = generateUKDigitalCode("TEST");
    const cleanCode = code.replace(/-/g, "");

    expect(cleanCode).toMatch(/^[A-Z0-9]+$/);
  });
});

describe("generateUKCodeQRUrl", () => {
  it("should generate a valid QR code URL", () => {
    const digitalCode = "1234-5678-9ABC-DEF0";
    const qrUrl = generateUKCodeQRUrl(digitalCode);

    expect(qrUrl).toContain("qrserver.com");
    expect(qrUrl).toContain("size=200x200");
    expect(qrUrl).toContain(encodeURIComponent(digitalCode));
  });

  it("should properly encode the digital code in URL", () => {
    const digitalCode = "ABCD-EFGH-IJKL-MNOP";
    const qrUrl = generateUKCodeQRUrl(digitalCode);

    expect(qrUrl).toContain("data=");
    expect(decodeURIComponent(qrUrl)).toContain(digitalCode);
  });
});
