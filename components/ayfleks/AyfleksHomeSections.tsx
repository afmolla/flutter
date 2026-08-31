"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AyfleksHome } from "@/lib/ayfleks-home-store";

export function AyfleksHomeSections({ home }: { home: AyfleksHome }) {
  const [idx, setIdx] = useState(0);
  const slides = home.slider;

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, [slides.length]);

  return (
    <>
      <section className="owl-manset ayf-hero">
        <div className="owl-container">
          <div className="ayf-hero-track">
            {slides.map((slide, i) => {
              const active = i === idx;
              const inner = (
                <div className={`item ayf-hero-item ${active ? "is-active" : ""}`} aria-hidden={!active}>
                  <div className="shadow" />
                  {slide.h1 ? (
                    <div className="owl-manset-text">
                      <h1>{slide.h1}</h1>
                      {slide.h2 ? <h2>{slide.h2}</h2> : null}
                    </div>
                  ) : null}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.image}
                    alt={slide.imageAlt || slide.h1 || "Ayfleks"}
                    width={1920}
                    height={900}
                    decoding={i === 0 ? "sync" : "async"}
                    fetchPriority={i === 0 ? "high" : "low"}
                  />
                </div>
              );
              return slide.href ? (
                <Link key={slide.id} href={slide.href} className="ayf-hero-link" tabIndex={active ? 0 : -1}>
                  {inner}
                </Link>
              ) : (
                <div key={slide.id} className="ayf-hero-link">
                  {inner}
                </div>
              );
            })}
          </div>
          <div className="ayf-hero-dots">
            {slides.map((s, i) => (
              <button key={s.id} type="button" aria-label={`Slayt ${i + 1}`} className={i === idx ? "active" : ""} onClick={() => setIdx(i)} />
            ))}
          </div>
        </div>
      </section>

      <section className="about-us">
        <div className="container">
          <div className="row about-title">
            <h1>{home.about.h1}</h1>
            <h2>{home.about.h2}</h2>
          </div>
          <div className="row">
            <div className="col-md-7">
              <a href={home.about.videoUrl} data-fancybox data-type="iframe" title="Ayfleks tanıtım videosu">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={home.about.videoCover} alt="Ayfleks tanıtım filmi" className="img-responsive img-thumbnail" width={800} height={450} loading="lazy" />
              </a>
            </div>
            <div className="col-md-5">
              {home.about.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
              <Link href={home.about.linkHref}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/icon-arrow-up-green.svg" className="arrow-g" alt="Devamını oku" width={32} height={32} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="comp-ayfleks">
        <div className="container">
          <div className="row">
            <h1>{home.categories.h1}</h1>
            <h2>{home.categories.h2}</h2>
          </div>
        </div>
        <div className="container">
          <div className="row d-flex justify-content-between">
            {home.categories.items.map((cat) => (
              <div key={cat.href} className="col-md-3 nh-col">
                <Link href={cat.href}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cat.image} alt={cat.label} width={400} height={300} loading="lazy" />
                  <h3>{cat.label}</h3>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/icon-arrow-up-green.svg" className="arrow-g" alt="" width={24} height={24} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="main-fleks">
        <div className="container main-fleks-t">
          <div className="row">
            <div className="mb-text">
              <h2>{home.sustainability.h2}</h2>
              <h1>{home.sustainability.h1}</h1>
              <p>{home.sustainability.text}</p>
              <Link href={home.sustainability.linkHref}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/icon-arrow-up-green.svg" className="arrow-g" alt="Sürdürülebilirlik" width={32} height={32} />
              </Link>
            </div>
          </div>
        </div>
        <div className="row main-fleks-s1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={home.sustainability.image} alt={home.sustainability.h1} className="img-fluid" width={1200} height={700} loading="lazy" />
        </div>
        <div className="main-fleks-t2">
          <div className="container">
            <div className="row main-fleks-s2">
              <h2>{home.export.h2}</h2>
              <h1>{home.export.h1}</h1>
            </div>
            <div className="row main-fleks-s3">
              <div className="col-md-4">
                <p>{home.export.text}</p>
              </div>
              <div className="col-md-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={home.export.image} alt={home.export.h1} className="img-fluid" width={900} height={600} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="main-iletisim">
        <div className="container">
          <div className="row">
            <h2>{home.contactCta.h2}</h2>
            <h1>{home.contactCta.h1}</h1>
            <p>{home.contactCta.text}</p>
            <form
              className="main-email-box"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                await fetch("/api/lead", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: fd.get("email"), kaynak: "anasayfa-cta" }),
                });
                e.currentTarget.reset();
                alert("Teşekkürler, en kısa sürede dönüş yapacağız.");
              }}
            >
              <input type="email" name="email" required placeholder="E-posta adresiniz" className="main-email-box-input" />
              <button className="main-email-box-button" type="submit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/button-arrow-up-white.svg" alt="Gönder" width={20} height={20} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
