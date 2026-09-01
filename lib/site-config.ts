/**
 * Ayfleks tek-site deploy — portföy vitrinleri yok.
 */
export const AMBALAJ_PREFIX = "/ambalaj";
export const AMBALAJ_SUBDIR = "ambalaj";
export const AYFLEKS_SUBDIR = "ayfleks";

export function isAyfleksSubdir(subdir: string): boolean {
  return !subdir || subdir === AYFLEKS_SUBDIR;
}

export function isAmbalajSubdir(_subdir: string): boolean {
  return false;
}

export function isAmbalajPath(_pathname: string): boolean {
  return false;
}

export function portfolioPrefixes(): string[] {
  return [];
}

export function slugFromPrefix(prefix: string): string {
  const p = prefix.startsWith("/") ? prefix.slice(1) : prefix;
  return p.replace(/\/+$/, "") || AYFLEKS_SUBDIR;
}

export function dataSubdirForPrefix(_prefix: string): string {
  return AYFLEKS_SUBDIR;
}

export function isPortfolioPath(_pathname: string): string | null {
  return null;
}

export function isPortfolioInternalRoute(_pathname: string): boolean {
  return false;
}
