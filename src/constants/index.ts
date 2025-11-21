import type { BusinessLocation } from "../models/BusinessLocation";
import type { SpecCode } from "../models/PhotoSpec";
import type { ProductPackage } from "../models/ProductPackage";

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
      name: "Standard",
      priceCents: 888,
      currency: "gbp",
      description: ["Single country photo"],
      printedPhotoNumber: 2,
      isPopular: false,
      isPickUp: false,
    },
    {
      id: "premium",
      name: "Premium",
      priceCents: 1520,
      currency: "gbp",
      description: ["Multi-country support"],
      printedPhotoNumber: 2,
      isPopular: true,
      isPickUp: false,
    },
  ] satisfies ProductPackage[],
  perAdditionalPhotoPriceInCent: Number(
    `${process.env.NEXT_PUBLIC_PER_ADDITIONAL_PHOTO_PRICE_IN_CENT}`,
  ),
};
