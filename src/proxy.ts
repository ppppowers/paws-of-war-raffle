import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on all paths except static assets and image files, so the auth
  // session is refreshed during normal navigation.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|items/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
