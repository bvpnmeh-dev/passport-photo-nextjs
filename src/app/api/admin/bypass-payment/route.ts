import { NextRequest, NextResponse } from "next/server";
import { forwardRequest, handleForwardRequest } from "@/lib/api";

type RequestBody = {
  photoUuid: string;
  adminKey: string;
};

// Simple admin key check (in production, use secure auth)
const ADMIN_KEYS = ["wallington-admin-2024", "dev-bypass-key"];

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
            photoUuid: data.photoUuid,
            specCode: data.specCode,
            idPhotoTempResultPhotoUrl: data.idPhotoUrl,
            idPhotoOriginalBgPhotoUrl: data.idPhotoOriginalBgUrl,
            amountInCents: 0,
            currency: "gbp",
            paymentStatus: "admin-bypass",
          },
        }),
        onError: ({ status, responseText }) => ({
          status: 400,
          body: {
            error: `Bad request: ${responseText}`,
          },
        }),
      },
    );
  } catch (error) {
    console.error("Error in admin bypass:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
