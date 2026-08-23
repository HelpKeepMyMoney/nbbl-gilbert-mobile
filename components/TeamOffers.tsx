"use client";

import { useState } from "react";

function bookHref(packageId: string) {
  return `/?package=${packageId}#book`;
}

export default function TeamOffers() {
  const [open, setOpen] = useState(false);

  return (
    <div className="team-offers">
      <article className="offer-featured">
        <div className="offer-kicker">Recommended starting point</div>
        <h3 className="display">Four Session Development Evaluation</h3>
        <ul>
          <li>4 two-hour sessions</li>
          <li>Up to 18 athletes</li>
          <li>Performance tracking included</li>
        </ul>
        <div className="offer-price">
          $1,700
        </div>
        <a className="btn primary" href={bookHref("school-eval")}>
          Start Your Evaluation →
        </a>
      </article>

      <button
        type="button"
        className="offer-toggle"
        aria-expanded={open}
        aria-controls="more-team-options"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Hide team options" : "View more team options →"}
      </button>

      <div
        id="more-team-options"
        className={`offer-more${open ? " is-open" : ""}`}
        hidden={!open}
      >
        <a className="offer-row" href={bookHref("school-weekly")}>
          <div>
            <h3>12 Week Weekly Residency</h3>
            <p>12 two-hour sessions. One session per week.</p>
          </div>
          <strong>$4,800</strong>
        </a>
        <a className="offer-row" href={bookHref("school-twice-weekly")}>
          <div>
            <h3>12 Week Twice Weekly Residency</h3>
            <p>24 two-hour sessions. Two sessions per week.</p>
          </div>
          <strong>$9,600</strong>
        </a>
      </div>
    </div>
  );
}
