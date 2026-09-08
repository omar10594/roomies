import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roomies - Gestión de Rentas",
  description: "Administra las rentas de tus roomies de forma simple y organizada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
