import { formatPrice } from "../formatPrice";

describe("formatPrice", () => {
  it("should format GBP correctly", () => {
    expect(formatPrice(888, "gbp")).toBe("£8.88");
    expect(formatPrice(1520, "gbp")).toBe("£15.20");
    expect(formatPrice(100, "gbp")).toBe("£1.00");
  });

  it("should format USD correctly", () => {
    expect(formatPrice(1000, "usd")).toBe("$10.00");
    expect(formatPrice(599, "usd")).toBe("$5.99");
  });

  it("should format EUR correctly", () => {
    expect(formatPrice(1000, "eur")).toBe("€10.00");
    expect(formatPrice(1299, "eur")).toBe("€12.99");
  });

  it("should handle zero amount", () => {
    expect(formatPrice(0, "gbp")).toBe("£0.00");
  });

  it("should handle large amounts", () => {
    expect(formatPrice(100000, "gbp")).toBe("£1,000.00");
    expect(formatPrice(999999, "usd")).toBe("$9,999.99");
  });

  it("should handle case-insensitive currency codes", () => {
    expect(formatPrice(1000, "GBP")).toBe("£10.00");
    expect(formatPrice(1000, "usd")).toBe("$10.00");
  });
});
