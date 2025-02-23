import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";

const jetBrainsMono = localFont({
  src: '../../public/fonts/JetBrainsMono-Regular.woff2',
});

export const metadata: Metadata = {
  title: "Schemassistant",
  description: "Generate Schema.org markup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetBrainsMono.className}`}>
        {children}
      </body>
    </html>
  );
}
