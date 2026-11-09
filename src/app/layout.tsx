import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans, Geist_Mono, Inter_Tight } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

// Solo para el wordmark de puntos del cierre, igual al de soysocio.app.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOCIO | Facturá en ARCA por WhatsApp y sabé quién te debe",
  description:
    "Le escribís o le mandás un audio por WhatsApp: SOCIO hace tu factura A, B o C en ARCA, anota tus cobros y te dice quién te debe. 5 facturas gratis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${dmSans.variable} ${bricolage.variable} ${geistMono.variable} ${interTight.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
