/**
 * Standardized API Response Types
 * Use these types for all API communication to ensure consistent error handling
 */

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      error: string;
      statusCode: number;
    };

export interface AdminLoginResponse {
  token: string;
  user: {
    email: string;
    role: "admin";
  };
}

export interface PhotoProcessResponse {
  photoUuid: string;
  idPhotoUrl: string;
  specCode: string;
  issues: string[];
}

export interface AdminBypassResponse {
  photoUuid: string;
  specCode: string;
  idPhotoTempResultPhotoUrl: string;
  idPhotoUrl: string;
  idPhotoOriginalBgPhotoUrl?: string;
  amountInCents: number;
  currency: string;
  paymentStatus: string;
  processedBy: string;
}
