import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Review Emails | 1st Choice Roofers",
  description:
    "Internal tool for sending branded review request emails for 1st Choice Roofers.",
  // Change favicon/logo icon by replacing public/logo_icon.png.
  icons: {
    icon: "/logo_icon.png",
    shortcut: "/logo_icon.png",
    apple: "/logo_icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
