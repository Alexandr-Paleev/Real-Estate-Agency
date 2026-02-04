import './global.css';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'Phuket Estate - Виллы на Пхукете',
  description:
    'Лучшие виллы и недвижимость на Пхукете. Аренда и продажа вилл в Таиланде.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
