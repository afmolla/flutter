import Link from "next/link";
import type { AyfleksHome } from "@/lib/ayfleks-home-store";

export function AyfleksHomeSections({ home }: { home: AyfleksHome }) {
  return (
    <>
      <section className="owl-manset">
        <div className="owl-container">
          <div className="row">
            <div className="col-md-12">
              <div id="slider-manset" className="owl-manset-images owl-carousel owl-theme">
                {home.slider.map((slide) => {
                  const inner = (
                    <div className="item">
                      <div className="shadow" />
                      {slide.h1 ? (
                        <div className="owl-manset-text">
                          <h1>{slide.h1}</h1>
                          {slide.h2 ? <h2>{slide.h2}</h2> : null}
                        </div>
                      ) : null}
                      <img src={slide.image} alt={slide.imageAlt || slide.h1 || "Ayfleks banner"} />
                    </div>
                  );
                  return slide.href ? (
                    <Link key={slide.id} href={slide.href}>
                      {inner}
                    </Link>
                  ) : (
                    <div key={slide.id}>{inner}</div>
                  );
                })}
              </div>
            </div>
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
              <a
                href={home.about.videoUrl}
                data-fancybox
                data-type="iframe"
                title="Ayfleks tanıtım videosu"
              >
                <img
                  src={home.about.videoCover}
                  alt="Ayfleks tanıtım filmi"
                  className="img-responsive img-thumbnail"
                />
              </a>
            </div>
            <div className="col-md-5">
              {home.about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
              <Link href={home.about.linkHref}>
                <img src="/images/icon-arrow-up-green.svg" className="arrow-g" alt="Devamını oku" />
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
                  <img src={cat.image} alt={cat.label} />
                  <h3>{cat.label}</h3>
                  <img src="/images/icon-arrow-up-green.svg" className="arrow-g" alt="" />
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
                <img src="/images/icon-arrow-up-green.svg" className="arrow-g" alt="Sürdürülebilirlik" />
              </Link>
            </div>
          </div>
        </div>
        <div className="row main-fleks-s1">
          <img
            src={home.sustainability.image}
            alt={home.sustainability.h1}
            className="img-fluid"
          />
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
                <img src={home.export.image} alt={home.export.h1} className="img-fluid" />
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
            <form action="/api/lead" method="post" className="main-email-box">
              <input type="email" name="email" required placeholder="E-posta adresiniz" className="main-email-box-input" />
              <button className="main-email-box-button" type="submit">
                <img src="/images/button-arrow-up-white.svg" alt="Gönder" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
