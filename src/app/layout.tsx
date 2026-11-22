import type { Metadata } from "next";
import {
  DM_Serif_Display,
  Geist,
  Geist_Mono,
  Pacifico,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Event page display fonts, self-hosted by next/font (no requests to Google).
const pacifico = Pacifico({
  variable: "--font-script",
  weight: "400",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Absolute URLs for share previews: the production domain on Vercel.
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: "Event Butler",
  description: "Uitnodigingen, inschrijvingen en bestellingen voor je feest.",
  // Event pages are only shared by link; keep them out of search engines.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} ${dmSerif.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
