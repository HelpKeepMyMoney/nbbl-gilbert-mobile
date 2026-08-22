"use client";

import { useEffect, useState } from "react";

export default function StickyCta() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    const form = document.getElementById("form-hub");
    if (!hero || !form) return;

    let heroVisible = true;
    let formVisible = false;

    const sync = () => setHidden(heroVisible || formVisible);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.4 },
    );

    const formObserver = new IntersectionObserver(
      ([entry]) => {
        formVisible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.12 },
    );

    heroObserver.observe(hero);
    formObserver.observe(form);

    return () => {
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  return (
    <div className={`sticky${hidden ? " is-hidden" : ""}`} role="region" aria-label="Primary action">
      <a className="btn primary" href="#book">
        Train Your Team →
      </a>
    </div>
  );
}
