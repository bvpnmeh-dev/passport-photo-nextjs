import { NextRequest, NextResponse } from "next/server";

const corsOptions = {
  "Access-Control-Allow-Origin": "*", // Allow all origins, or specify a specific origin
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function middleware(request: NextRequest) {
  // Check the origin from the request
  const origin = request.headers.get("origin") ?? "";

  // Handle preflighted requests
  const isPreflight = request.method === "OPTIONS";

  if (isPreflight) {
    const preflightHeaders = {
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Handle simple requests
  const response = NextResponse.next();

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), geolocation=(), microphone=()",
  );

  // Only add CSP in production to avoid breaking development
  if (process.env.NODE_ENV === "production") {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self' data:;
      connect-src 'self' https://api.stripe.com https://api.idphoto.com https://api-us.idphotoapp.com;
      frame-src https://js.stripe.com https://hooks.stripe.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `
      .replace(/\s{2,}/g, " ")
      .trim();

    response.headers.set("Content-Security-Policy", cspHeader);
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
