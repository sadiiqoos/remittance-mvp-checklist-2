import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { securityHeaders } from "./lib/security"

export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // HTTPS enforcement in production
  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https" &&
    !request.url.includes("localhost")
  ) {
    return NextResponse.redirect(`https://${request.headers.get("host")}${request.nextUrl.pathname}`, 301)
  }

  // Add security headers for all responses
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
}
