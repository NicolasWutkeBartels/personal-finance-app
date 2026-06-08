import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RootProvider } from "@/components/root-provider";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Aplicativo de Controle Financeiro",
  description: "Interface do aplicativo de controle financeiro pessoal",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">
        <RootProvider>
          <Sidebar>{children}</Sidebar>
        </RootProvider>
      </body>
    </html>
  );
}
