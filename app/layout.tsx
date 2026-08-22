import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "NBBL Gilbert | The Futsal of Basketball",
  description:
    "NBBL Gilbert is the first physical home of No Backboard Basketball. Train. Measure. Compete. Build an audience. Fund the game.",
};

export const viewport: Viewport = {
  themeColor: "#090a0f",
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
