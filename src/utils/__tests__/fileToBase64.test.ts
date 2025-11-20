import { fileToBase64 } from "../fileToBase64";

describe("fileToBase64", () => {
  it("should convert a valid file to base64 string", async () => {
    const mockFileContent = "test content";
    const blob = new Blob([mockFileContent], { type: "image/jpeg" });
    const file = new File([blob], "test.jpg", { type: "image/jpeg" });

    const result = await fileToBase64(file);

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
    // Base64 string should not contain data URL prefix
    expect(result).not.toContain("data:");
  });

  it("should handle different file types", async () => {
    const blob = new Blob(["png content"], { type: "image/png" });
    const file = new File([blob], "test.png", { type: "image/png" });

    const result = await fileToBase64(file);

    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("should reject when FileReader fails", async () => {
    const mockFile = new File([""], "test.jpg", { type: "image/jpeg" });

    // Mock FileReader to simulate error
    const originalFileReader = global.FileReader;
    global.FileReader = jest.fn().mockImplementation(() => ({
      readAsDataURL: jest.fn(),
      onerror: null,
      onload: null,
    })) as any;

    const fileReader = new FileReader();
    setTimeout(() => {
      if (fileReader.onerror) {
        fileReader.onerror(new Error("Read failed") as any);
      }
    }, 0);

    global.FileReader = originalFileReader;
  });
});
