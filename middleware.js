import { NextResponse } from "next/server";

const ACCESS_COOKIE_NAME = "site_access_granted";

export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  // Allow asset files (e.g., images, css, js) and known public files
  if (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".gif") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".txt")
  ) {
    return NextResponse.next();
  }

  // Allow password page and unlock API
  if (pathname.startsWith("/password") || pathname.startsWith("/api/unlock")) {
    return NextResponse.next();
  }

  // Check cookie
  const hasAccess = request.cookies.get(ACCESS_COOKIE_NAME)?.value === "true";
  if (hasAccess) {
    return NextResponse.next();
  }

  // Redirect to password page with original destination
  const url = request.nextUrl.clone();
  url.pathname = "/password";
  // preserve original path so we can navigate back after unlock
  const from = pathname + (search || "");
  url.searchParams.set("from", from);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|password|api/unlock).*)",
  ],
};


