import { SitePrefixProvider } from "@/components/SitePrefixProvider";
import { getRequestSite } from "@/lib/site-request";

/** Ayfleks public sayfaları kendi shell'lerini kullanır — ekstra header/footer yok */
export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { prefix } = await getRequestSite();
  return <SitePrefixProvider prefix={prefix}>{children}</SitePrefixProvider>;
}
