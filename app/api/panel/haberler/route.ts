import { NextResponse } from "next/server";
import { oturumVarMi } from "@/lib/session";
import { withSiteFromRequest } from "@/lib/api-site-context";
import { describePersistError } from "@/lib/panel-persist-error";
import { haberKaydet, haberSil, tumHaberler } from "@/lib/haber-store";

export async function GET(req: Request) {
  return withSiteFromRequest(req, async () => {
    if (!(await oturumVarMi())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    return NextResponse.json({ haberler: await tumHaberler() });
  });
}

export async function POST(req: Request) {
  return withSiteFromRequest(req, async () => {
    if (!(await oturumVarMi())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    try {
      const body = await req.json();
      const row = await haberKaydet(body);
      return NextResponse.json({ ok: true, haber: row });
    } catch (e) {
      return NextResponse.json({ ok: false, error: describePersistError(e) }, { status: 500 });
    }
  });
}

export async function DELETE(req: Request) {
  return withSiteFromRequest(req, async () => {
    if (!(await oturumVarMi())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    const slug = new URL(req.url).searchParams.get("slug") || "";
    if (!slug) return NextResponse.json({ error: "slug gerekli" }, { status: 400 });
    await haberSil(slug);
    return NextResponse.json({ ok: true });
  });
}
