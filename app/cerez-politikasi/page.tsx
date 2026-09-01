import type { Metadata } from "next";
import { AyfleksPageHero, AyfleksShell } from "@/components/ayfleks/AyfleksShell";
import { siteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const base = await siteUrl();
  return {
    title: "Çerez Politikası",
    description: "Ayfleks web sitesi çerez politikası.",
    alternates: { canonical: `${base.replace(/\/$/, "")}/cerez-politikasi` },
    robots: { index: true, follow: true },
  };
}

export default function CerezPolitikasiPage() {
  return (
    <AyfleksShell inside>
      <AyfleksPageHero title="Çerez Politikası" crumbs={[{ label: "Anasayfa", href: "/" }, { label: "Çerez Politikası" }]} />
      <div className="container content-page corporate-about">
        <div className="row">
          <div className="col-md-10">
            <p>
              Ayfleks web sitesi, sizlere daha iyi bir deneyim sunabilmek için temel çerezleri kullanabilir. Zorunlu çerezler
              sitenin çalışması için gereklidir. Analitik çerezler (ör. Google Analytics) yalnızca onayınız sonrası
              etkinleştirilir.
            </p>
            <p>
              Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Onayınızı dilediğiniz zaman
              değiştirebilirsiniz.
            </p>
            <p>
              Kişisel verilerin işlenmesi hakkında detaylı bilgi için <a href="/p/kvkk">KVKK Aydınlatma Metni</a>ni
              inceleyiniz.
            </p>
          </div>
        </div>
      </div>
    </AyfleksShell>
  );
}
