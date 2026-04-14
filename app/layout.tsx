import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meditation App',
  description: 'Meditation music player',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script src="/audioManager.js" defer></script>
      </head>
      <body>{children}</body>
    </html>
  );
}