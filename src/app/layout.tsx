import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0B121A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lapi-unifiee.vercel.app'),
  title: "L'API Unifiée | Votez pour le prochain LLM",
  description: "Accédez aux derniers modèles Claude, Gemini et ChatGPT via API à -80% du prix officiel. Votez dès maintenant pour choisir le prochain modèle intégré.",
  keywords: ["API", "LLM", "ChatGPT", "Claude", "Gemini", "IA", "Intelligence Artificielle", "Vote"],
  authors: [{ name: "Bonheurfung" }],
  openGraph: {
    title: "L'API Unifiée | Votez pour le prochain LLM",
    description: "Accédez aux derniers modèles Claude, Gemini et ChatGPT via API à -80% du prix officiel. Participez au vote !",
    type: "website",
    locale: "fr_FR",
    siteName: "L'API Unifiée",
  },
  twitter: {
    card: "summary_large_image",
    title: "L'API Unifiée | Votez pour le prochain LLM",
    description: "Accédez aux derniers modèles Claude, Gemini et ChatGPT via API à -80% du prix officiel.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" />
      </head>
      <body className="bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
