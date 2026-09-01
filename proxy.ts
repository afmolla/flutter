import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AYFLEKS_SUBDIR } from "@/lib/site-config";
import { MOLLA_SITE_PREFIX_SENTINEL, VITRIN_URL_PATH_HEADER } from "@/lib/site-proxy-headers";

function requestHeadersWithSite(req: NextRequest): Headers {
  const h = new Headers(req.headers);
  h.set("x-site-prefix", MOLLA_SITE_PREFIX_SENTINEL);
  h.set("x-data-subdir", AYFLEKS_SUBDIR);
  h.set(VITRIN_URL_PATH_HEADER, req.nextUrl.pathname);
  return h;
}

/** Tek kiracı: her istek data/ayfleks */
export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith("/.well-known/acme-challenge/") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/__nextjs") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  return NextResponse.next({ request: { headers: requestHeadersWithSite(req) } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|_next/webpack-hmr|css/|js/|images/).*)"],
};
