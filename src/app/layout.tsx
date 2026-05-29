import type { Metadata } from "next";
import { Fraunces, Archivo } from "next/font/google";
import "./globals.css";

// Display serif with character for headings and titles.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

// Clean, slightly condensed sans for body copy and UI.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

// Used to resolve relative URLs for SEO / social cards. Set the deployed
// domain via NEXT_PUBLIC_SITE_URL in Vercel; falls back to localhost in dev.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Paws of War Raffle",
    template: "%s · Paws of War Raffle",
  },
  description:
    "Browse the raffle baskets supporting Paws of War — Help A Vet, Save A Pet. Open any basket to see photos and everything inside.",
  openGraph: {
    title: "Paws of War Raffle",
    description:
      "Browse the raffle baskets supporting Paws of War — Help A Vet, Save A Pet. Open any basket to see photos and everything inside.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paws of War Raffle",
    description:
      "Browse the raffle baskets supporting Paws of War — Help A Vet, Save A Pet.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
