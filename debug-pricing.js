// Debug script to check environment variables
console.log("=== PRICING DEBUG ===");
console.log(
  "Standard Price:",
  process.env.NEXT_PUBLIC_STANDARD_PKG_PRICE_IN_CENT,
);
console.log(
  "Premium Price:",
  process.env.NEXT_PUBLIC_PREMIUM_PKG_PRICE_IN_CENT,
);
console.log(
  "Standard Popular:",
  process.env.NEXT_PUBLIC_STANDARD_PKG_IS_POPULAR,
);
console.log("Premium Popular:", process.env.NEXT_PUBLIC_PREMIUM_PKG_IS_POPULAR);

const packages = [
  {
    name: "Standard",
    priceCents: Number(process.env.NEXT_PUBLIC_STANDARD_PKG_PRICE_IN_CENT),
    isPopular: process.env.NEXT_PUBLIC_STANDARD_PKG_IS_POPULAR === "true",
  },
  {
    name: "Premium",
    priceCents: Number(process.env.NEXT_PUBLIC_PREMIUM_PKG_PRICE_IN_CENT),
    isPopular: process.env.NEXT_PUBLIC_PREMIUM_PKG_IS_POPULAR === "true",
  },
];

console.log("\nPackages:", JSON.stringify(packages, null, 2));
console.log(
  "\nDefault (888):",
  packages.find((p) => p.priceCents === 888) || packages[0],
);
