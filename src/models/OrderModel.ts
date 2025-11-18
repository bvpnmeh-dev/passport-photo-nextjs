import type { OrderStatus } from "./OrderStatus";

export interface OrderModel {
  orderId: string;
  croppedNoBgNoWatermarkImageUrl?: string;
  croppedNoBgWatermarkImageUrl?: string;
  issues: string[];
  orderAmountInCents?: number;
  orderCurrency?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  paymentResult?: string;
  paymentTransactionId?: string;
  priceId?: string;
  productDescription?: string;
  productId?: string;
  productName?: string;
  specCode: string;
  status: OrderStatus;
  // Multi-country support
  secondarySpecCode?: string;
  secondaryPhotoUrl?: string;
  // UK Digital Code
  ukDigitalCode?: string;
  // Admin processing
  processedBy?: "customer" | "admin";
}
