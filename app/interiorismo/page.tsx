"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { catalogText } from "@/lib/catalog-language";
import { langIndex } from "@/lib/site-data";
import { useSiteData } from "@/lib/site-content-context";
import WorkSteps from "@/components/WorkSteps";
import "./interior.css";

function Arrow({ down = false }: { down?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d={down ? "M12 4v16m-6-6 6 6 6-6" : "M5 19 19 5M5 5h14v14"} />
  </svg>;
}

export default function InteriorismoPage() {
  const { lang, t } = useLanguage();
  const { HERO_INT, IMG, PROJECTS } = useSiteData();
  const root = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const projects = PROJECTS.filter(project => IMG[project.id]?.src);
  const L = langIndex(lang);

  useEffect(() => {
    const element = root.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const media = Array.from(element.querySelectorAll<HTMLElement>("[data-interior-media]"));
    const chapters = Array.from(element.querySelectorAll<HTMLElement>("[data-interior-project]"));
    const visible = new Set<HTMLElement>();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (reduce.matches) media.forEach(item => item.style.removeProperty("--ck-interior-pan"));
      else visible.forEach(item => {
        const rect = item.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
        const distance = innerWidth < 760 ? 14 : 36;
        item.style.setProperty("--ck-interior-pan", `${((progress - .5) * distance).toFixed(2)}px`);
      });
      let current = chapters[0];
      for (const chapter of chapters) {
        if (chapter.getBoundingClientRect().top <= innerHeight * .48) current = chapter;
      }
      const id = current?.dataset.interiorProject ?? null;
      setActiveProject(previous => previous === id ? previous : id);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const item = entry.target as HTMLElement;
        item.dataset.inView = String(entry.isIntersecting);
        if (entry.isIntersecting) visible.add(item); else visible.delete(item);
      });
      schedule();
    }, { rootMargin: "80px 0px" });
    media.forEach(item => observer.observe(item));
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduce.addEventListener("change", schedule);
    return () => {
      observer.disconnect(); cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduce.removeEventListener("change", schedule);
      media.forEach(item => { item.style.removeProperty("--ck-interior-pan"); delete item.dataset.inView; });
    };
  }, [PROJECTS, IMG]);

  return <div ref={root} className="ck-interior-page">
    <section className="ck-interior-intro" aria-labelledby="interior-title">
      <div className="ck-interior-heading">
        <span className="ck-section-label">{t.navInterior}</span>
        <h1 id="interior-title">{t.interiorPageTitle}</h1>
      </div>
      <div className="ck-interior-intro-copy">
        <p>{t.interiorPageBody}</p>
        <a className="ck-interior-link" href={projects.length ? "#interior-projects" : "#interior-approach"}>
          {projects.length ? t.viewProjects : t.howWork}<Arrow down />
        </a>
      </div>
    </section>

    <div className="ck-interior-media ck-interior-hero" data-interior-media>
      <Image src={HERO_INT.src} alt="" fill preload sizes="100vw" style={{ objectFit: "cover" }} />
    </div>

    {projects.length > 0 && <section id="interior-projects" className="ck-interior-projects" aria-labelledby="interior-projects-title">
      <aside className="ck-interior-index">
        <h2 id="interior-projects-title">{t.interiorProjectsTitle}</h2>
        <nav aria-label={t.interiorProjectsTitle}>
          {projects.map(project => <a key={project.id} href={`#interior-project-${project.id}`}
            aria-current={activeProject === project.id ? "location" : undefined}>
            <span>{catalogText(project.name, lang)}</span><small>{project.place}</small>
          </a>)}
        </nav>
      </aside>
      <div className="ck-interior-project-list">
        {projects.map(project => <article key={project.id} id={`interior-project-${project.id}`}
          className="ck-interior-project" data-interior-project={project.id} tabIndex={-1}>
          <figure>
            <div className="ck-interior-media" data-interior-media>
              <Image src={IMG[project.id].src} alt={catalogText(project.name, lang)} fill sizes="(max-width: 760px) 100vw, 65vw" style={{ objectFit: "cover" }} />
            </div>
            <figcaption>
              <h3>{catalogText(project.name, lang)}</h3>
              <div><span>{project.type[L]}</span><span>{project.place}</span></div>
            </figcaption>
          </figure>
        </article>)}
      </div>
    </section>}

    <section id="interior-approach" className="ck-interior-approach" aria-labelledby="interior-approach-title">
      <div className="ck-section-intro"><h2 id="interior-approach-title">{t.howTitle}</h2></div>
      <WorkSteps steps={t.steps} />
    </section>

    <section className="ck-interior-contact" aria-labelledby="interior-contact-title">
      <h2 id="interior-contact-title">{t.interiorContactTitle}</h2>
      <Link href="/contacto" className="ck-interior-link">{t.navContact}<Arrow /></Link>
    </section>
  </div>;
}
