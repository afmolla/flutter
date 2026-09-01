import { NextResponse } from "next/server";
import { oturumVarMi } from "@/lib/session";
import { ayfleksHomeGetir, ayfleksHomeKaydet, type AyfleksHome } from "@/lib/ayfleks-home-store";
import { withSiteFromRequest } from "@/lib/api-site-context";
import { describePersistError } from "@/lib/panel-persist-error";

export async function GET(req: Request) {
  return withSiteFromRequest(req, async () => {
    if (!(await oturumVarMi())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    return NextResponse.json({ home: await ayfleksHomeGetir() });
  });
}

export async function PATCH(req: Request) {
  return withSiteFromRequest(req, async () => {
    if (!(await oturumVarMi())) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
    try {
      const body = (await req.json()) as Partial<AyfleksHome>;
      const current = await ayfleksHomeGetir();
      const next = { ...current, ...body } as AyfleksHome;
      await ayfleksHomeKaydet(next);
      return NextResponse.json({ ok: true, home: next });
    } catch (e) {
      const msg = describePersistError(e);
      return NextResponse.json({ ok: false, error: msg }, { status: 500 });
    }
  });
}
