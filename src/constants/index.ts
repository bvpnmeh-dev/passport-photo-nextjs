import type { BusinessLocation } from "../models/BusinessLocation";
import type { SpecCode } from "../models/PhotoSpec";
import type { ProductPackage } from "../models/ProductPackage";

// Validate critical environment variables
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required");
}

export const constants = {
  stripePublicKey: `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`,
  studioName: `${process.env.NEXT_PUBLIC_STUDIO_NAME}`,
  studioDescription: `${process.env.NEXT_PUBLIC_STUDIO_DESCRIPTION}`,
  defaultSpecCodes: [
    "uk-passport",
    "us-passport",
    "china-passport",
    "schengen-visa",
    "canada-passport",
    "india-passport",
  ] satisfies SpecCode[],
  businessLocations: [
    {
      address: `${process.env.NEXT_PUBLIC_BUSINESS_ADDRESS}`,
      phone: `${process.env.NEXT_PUBLIC_BUSINESS_PHONE}`,
      email: `${process.env.NEXT_PUBLIC_BUSINESS_EMAIL}`,
      hours: `${process.env.NEXT_PUBLIC_BUSINESS_HOURS}`,
    },
  ] satisfies BusinessLocation[],
  productPackages: [
    {
      id: "standard",
      name: process.env.NEXT_PUBLIC_STANDARD_PKG_NAME || "Standard",
      priceCents:
        Number(process.env.NEXT_PUBLIC_STANDARD_PKG_PRICE_IN_CENT) || 888,
      currency: (process.env.NEXT_PUBLIC_STANDARD_PKG_CURRENCY ||
        "gbp") as "gbp",
      description: [
        process.env.NEXT_PUBLIC_STANDARD_PKG_DESCRIPTION ||
          "Single country photo",
      ],
      printedPhotoNumber:
        Number(process.env.NEXT_PUBLIC_STANDARD_PKG_PRINTED_PHOTO_NUMBER) || 2,
      isPopular:
        process.env.NEXT_PUBLIC_STANDARD_PKG_IS_POPULAR === "true" || false,
      isPickUp:
        process.env.NEXT_PUBLIC_STANDARD_PKG_IS_PICKUP === "true" || false,
    },
    {
      id: "premium",
      name: process.env.NEXT_PUBLIC_PREMIUM_PKG_NAME || "Premium",
      priceCents:
        Number(process.env.NEXT_PUBLIC_PREMIUM_PKG_PRICE_IN_CENT) || 1099,
      currency: (process.env.NEXT_PUBLIC_PREMIUM_PKG_CURRENCY ||
        "gbp") as "gbp",
      description: [
        process.env.NEXT_PUBLIC_PREMIUM_PKG_DESCRIPTION ||
          "Multi-country support",
      ],
      printedPhotoNumber:
        Number(process.env.NEXT_PUBLIC_PREMIUM_PKG_PRINTED_PHOTO_NUMBER) || 2,
      isPopular:
        process.env.NEXT_PUBLIC_PREMIUM_PKG_IS_POPULAR === "true" || true,
      isPickUp:
        process.env.NEXT_PUBLIC_PREMIUM_PKG_IS_PICKUP === "true" || false,
    },
  ] satisfies ProductPackage[],
  perAdditionalPhotoPriceInCent: (() => {
    const price = Number(
      `${process.env.NEXT_PUBLIC_PER_ADDITIONAL_PHOTO_PRICE_IN_CENT}`,
    );
    if (isNaN(price) || price < 0) {
      throw new Error(
        "NEXT_PUBLIC_PER_ADDITIONAL_PHOTO_PRICE_IN_CENT must be a valid positive number",
      );
    }
    return price;
  })(),
};
