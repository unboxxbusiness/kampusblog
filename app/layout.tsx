import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PWAListener from "@/features/pwa/PWAListener";
import FCMHandler from "@/features/notifications/FCMHandler";
import PWAHubModal from "@/features/pwa/PWAHubModal";
import "@/styles/globals.css";
import { siteConfig } from "@/config/site";
import { getActiveCategoriesAndTags } from "@/services/articles";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "./",
    types: {
      "application/rss+xml": `${siteConfig.url}/feed.xml`,
    },
  },
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - AI Learning Platform`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@kampusfilter",
  },
  verification: {
    google: "google-site-verification-placeholder",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { categories: activeCategories } = await getActiveCategoriesAndTags();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                window.deferredPrompt = e;
                window.dispatchEvent(new Event('deferred-prompt-ready'));
              });
            `
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
        <Header activeCategories={activeCategories} />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
          {children}
        </main>
        <Footer activeCategories={activeCategories} />
        <PWAListener />
        <FCMHandler />
        <PWAHubModal />
      </body>
    </html>
  );
}
