import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "devroast - paste your code. get roasted.",
  description:
    "Drop your code below and we'll rate it — brutally honest or full roast mode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-bg-page text-text-primary">
        <Navbar />
        <main className="pt-14">{children}</main>
      </body>
    </html>
  );
}
