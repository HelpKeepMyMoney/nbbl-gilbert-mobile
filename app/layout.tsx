import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nbblgilbert.com"),
  title: {
    default: "NBBL Gilbert | The Futsal of Basketball",
    template: "%s | NBBL Gilbert",
  },
  description:
    "NBBL Gilbert is the first physical home of No Backboard Basketball in Gilbert, Arizona. Train. Measure. Compete. Build an audience. Fund the game.",
  keywords: [
    "NBBL Gilbert",
    "No Backboard Basketball",
    "Gilbert Arizona",
    "UHoop",
    "team development",
    "club showcases",
  ],
  openGraph: {
    title: "NBBL Gilbert | The Futsal of Basketball",
    description:
      "The first physical home of No Backboard Basketball. Train your team in Gilbert, Arizona. Opening September 1, 2026.",
    type: "website",
    locale: "en_US",
    siteName: "NBBL Gilbert",
    images: [
      {
        url: "/assets/hero.webp",
        width: 1800,
        height: 1800,
        alt: "No Backboard Basketball action at NBBL Gilbert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NBBL Gilbert | The Futsal of Basketball",
    description:
      "The first physical home of No Backboard Basketball in Gilbert, Arizona.",
    images: ["/assets/hero.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07080c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hubspotPortalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {hubspotPortalId && !hubspotPortalId.startsWith("YOUR_") ? (
          <Script
            id="hs-script-loader"
            src={`//js.hs-scripts.com/${hubspotPortalId}.js`}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
