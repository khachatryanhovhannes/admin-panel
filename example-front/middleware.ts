import { NextRequest, NextResponse } from "next/server";

async function getSupportedLanguages() {
  const res = await fetch("http://localhost:3000/frontend/languages");
  const data = await res.json();
  return Object.keys(data);
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;
  const supportedLanguages = await getSupportedLanguages();
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentLang = pathSegments[0];

  if (!supportedLanguages.includes(currentLang)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|static|public).*)"],
};
