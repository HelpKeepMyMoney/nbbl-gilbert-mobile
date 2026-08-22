"use client";

import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  function closeNav() {
    setOpen(false);
  }

  return (
    <header>
      <div className="shell nav">
        <a className="brand" href="#top" aria-label="NBBL Gilbert home">
          <img src="/assets/nbbl-logo.webp" alt="NBBL logo" />
          <span>NBBL GILBERT</span>
        </a>
        <nav
          className={`navlinks${open ? " open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#train" onClick={closeNav}>
            Train
          </a>
          <a href="#showcases" onClick={closeNav}>
            Showcases
          </a>
          <a href="#difference" onClick={closeNav}>
            Difference
          </a>
          <a href="#gym" onClick={closeNav}>
            The Gym
          </a>
          <a href="#creators" onClick={closeNav}>
            Creators
          </a>
        </nav>
        <a className="btn primary navcta" href="#book">
          Book Your Team
        </a>
        <button
          className="menu"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
