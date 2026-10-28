"use client";

import { useSiteData } from "@/lib/site-content-context";
import { useLanguage } from "@/lib/language-context";

export default function InstagramFeed() {
  const { t } = useLanguage();
  const { settings } = useSiteData();

  return (
    <section className="ck-instagram" aria-labelledby="instagram-title">
      <div className="ck-instagram-header">
        <div className="ck-section-intro">
          <span className="ck-section-label">Instagram · @{settings.instagramUsername}</span>
          <h2 id="instagram-title">{t.instagramTitle}</h2>
          <p>{t.instagramBody}</p>
        </div>
        <a href={`https://www.instagram.com/${settings.instagramUsername}/`} target="_blank" rel="noreferrer" className="ck-action ck-action-outline">
          {t.instagramVisit}
        </a>
      </div>
      <div className="ck-instagram-window">
        <iframe
          className="ck-instagram-embed"
          src={`https://www.instagram.com/${settings.instagramUsername}/embed/`}
          title={t.instagramLatest}
          scrolling="no"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}
