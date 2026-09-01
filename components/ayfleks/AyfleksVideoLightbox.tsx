"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  videoUrl: string;
  coverSrc: string;
  title?: string;
};

export function AyfleksVideoLightbox({ videoUrl, coverSrc, title = "Ayfleks tanıtım videosu" }: Props) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <>
      <button type="button" className="ayf-video-trigger" onClick={() => setOpen(true)} aria-label={title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverSrc} alt={title} className="img-responsive img-thumbnail" width={800} height={450} loading="lazy" />
      </button>
      {open ? (
        <div className="ayf-lightbox" role="dialog" aria-modal="true" aria-label={title} onClick={close}>
          <div className="ayf-lightbox-frame" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="ayf-lightbox-close" aria-label="Kapat" onClick={close}>
              ×
            </button>
            <iframe
              src={videoUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
