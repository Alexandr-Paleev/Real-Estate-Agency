'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface HeaderProps {
  currentLang: string;
}

export function Header({ currentLang }: HeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const languages = ['EN', 'TH', 'RU'];

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href={`/?lang=${currentLang}`}
          className="font-bold text-2xl tracking-tighter hover:opacity-80 transition-opacity"
        >
          Phuket Estate
        </Link>
        <nav className="flex gap-6">
          {languages.map((lang) => (
            <Link
              key={lang}
              href={`${pathname}?${createQueryString('lang', lang)}`}
              className={`text-sm font-semibold transition-all hover:text-primary ${
                currentLang === lang
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-muted-foreground'
              }`}
            >
              {lang}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
