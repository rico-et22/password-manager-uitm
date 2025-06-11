import './globals.css';
import { ReactQueryProvider } from './providers/react-query-provider';
import { Toaster } from 'sonner';

let title = 'UITM Authenticator';
let description = 'UITM Authenticator student project';

export const metadata = {
  title,
  description,
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
  metadataBase: new URL('https://nextjs-postgres-auth.vercel.app'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
