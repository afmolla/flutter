import Link from "next/link";
import { SitePrefixProvider } from "@/components/SitePrefixProvider";
import { getRequestSite } from "@/lib/site-request";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { prefix, subdir } = await getRequestSite();
  return (
    <SitePrefixProvider prefix={prefix}>
      <div data-panel-vitrin={subdir} className="flex min-h-screen flex-col bg-[var(--surface-2,#f4f4f4)]">
        <header className="panel-top-bar shrink-0 border-b border-[var(--border,#e5e5e5)] bg-white">
          <div className="flex w-full flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-col gap-0.5">
              <Link href="/" className="text-sm font-medium text-[var(--muted,#666)] hover:text-[#024B3D]">
                ← Siteye dön
              </Link>
              <span className="truncate text-[11px] font-medium text-[var(--muted,#666)]">Panel: ayfleks.com</span>
            </div>
          </div>
        </header>
        <div className="flex w-full min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </SitePrefixProvider>
  );
}
