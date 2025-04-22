import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const ISSUER_URL = "https://oidc.vercel.com/nickheyns-projects";

/**
 * This middleware function is used to verify the JWT token in the request headers.
 * @param request 
 * @returns 
 */
export async function middleware(request: NextRequest) {
  console.log("Middleware triggered for request:", request.url);
  const token = request.headers.get("Authorization")?.split("Bearer ")[1];

  const JWKS = jose.createRemoteJWKSet(new URL(`${ISSUER_URL}/.well-known/jwks.json`));
  if (!token) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: ISSUER_URL,
      audience: "https://vercel.com/nickheyns-projects",
      subject:
        `owner:nickheyns-projects:project:blueprint-take-home-project:environment:${process.env.NODE_ENV}`,
    });
 
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return new Response("Unauthorized", {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const config = {
  matcher: ["/api/screener/:path*"],
};

