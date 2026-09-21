import type { Metadata } from "next";
import Script from "next/script";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SMARTWAIVER_WIDGET_SRC, WAIVER_FORMS } from "@/lib/waivers";

export const metadata: Metadata = {
  title: "Waivers",
  description:
    "Parents and guardians: sign NBBL Gilbert waivers for minor athletes before they train, compete, or appear on NBBL content.",
};

export default function WaiversPage() {
  return (
    <>
      <Header />
      <main className="waivers-page">
        <div className="shell">
          <p className="chapter-kicker">NBBL Gilbert</p>
          <h1 className="display">Waivers.</h1>
          <p className="lead">
            Parents and guardians must sign these forms before a minor athlete
            trains, competes, or appears on NBBL Gilbert content.
          </p>
          <p className="lead">
            Use the Sign waivers bar at the bottom of this page, or open a form
            below.
          </p>
          <ul className="waiver-list">
            {WAIVER_FORMS.map((waiver) => (
              <li className="waiver-card" key={waiver.id}>
                <h2>{waiver.title}</h2>
                <a
                  className="btn primary"
                  href={waiver.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sign →
                </a>
              </li>
            ))}
          </ul>
          <p className="form-note">
            Questions? Email{" "}
            <a href="mailto:info@nobackboard.com">info@nobackboard.com</a>.
          </p>
        </div>
      </main>
      <Footer />
      <Script
        id="smartwaiver-widget"
        src={SMARTWAIVER_WIDGET_SRC}
        strategy="afterInteractive"
      />
    </>
  );
}
