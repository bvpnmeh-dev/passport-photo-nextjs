import { NextRequest, NextResponse } from "next/server";
import { forwardRequest, handleForwardRequest } from "@/lib/api";

type RequestBody = {
  photoUuid: string;
  adminKey: string;
};

// Admin authentication from environment variables
const ADMIN_KEYS = (process.env.ADMIN_ACCESS_KEYS || "")
  .split(",")
  .map((key) => key.trim())
  .filter(Boolean);

if (ADMIN_KEYS.length === 0) {
  console.warn(
    "WARNING: ADMIN_ACCESS_KEYS not configured. Admin bypass disabled.",
  );
}

// Rate limiting configuration
const RATE_LIMIT_MAX = Number(process.env.ADMIN_RATE_LIMIT_MAX_REQUESTS) || 10;
const RATE_LIMIT_WINDOW =
  Number(process.env.ADMIN_RATE_LIMIT_WINDOW_MS) || 60000;

// Simple in-memory rate limiter (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { photoUuid, adminKey }: RequestBody = await req.json();

  if (!photoUuid || !adminKey) {
    return NextResponse.json(
      { error: "photoUuid and adminKey are required" },
      { status: 400 },
    );
  }

  // Verify admin key
  if (!ADMIN_KEYS.includes(adminKey)) {
    return NextResponse.json({ error: "Invalid admin key" }, { status: 403 });
  }

  // Rate limiting check
  const clientIp = req.headers.get("x-forwarded-for") || req.ip || "unknown";
  const rateLimitKey = `admin-bypass:${clientIp}:${adminKey}`;

  if (!checkRateLimit(rateLimitKey)) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded",
        message: `Maximum ${RATE_LIMIT_MAX} requests per ${RATE_LIMIT_WINDOW / 1000} seconds`,
      },
      { status: 429 },
    );
  }

  try {
    // Bypass payment and get photo directly
    return await handleForwardRequest(
      forwardRequest("POST", "/v2/getIdPhotoNoWatermark", {
        photoUuid: photoUuid,
      }),
      {
        onSuccess: (data) => ({
          status: 200,
          body: {
            photoUuid: data.photoUuid || photoUuid,
            specCode: data.specCode || "uk-passport",
            idPhotoTempResultPhotoUrl:
              data.idPhotoUrl || data.idPhotoTempResultPhotoUrl,
            idPhotoUrl: data.idPhotoUrl,
            idPhotoOriginalBgPhotoUrl: data.idPhotoOriginalBgUrl,
            amountInCents: 0,
            currency: "gbp",
            paymentStatus: "admin-bypass",
            processedBy: "admin",
          },
        }),
        onError: ({ status, responseText }) => ({
          status: status,
          body: {
            error: `Backend error: ${responseText}`,
            photoUuid: photoUuid,
          },
        }),
      },
    );
  } catch (error) {
    console.error("Error in admin bypass:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        photoUuid: photoUuid,
      },
      { status: 500 },
    );
  }
}
