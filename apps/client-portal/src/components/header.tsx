import Link from 'next/link';

interface HeaderProps {
  currentLang: string;
}

export function Header({ currentLang }: HeaderProps) {
  const languages = ['RU', 'EN', 'TH'];

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl">Phuket Estate</div>
        <nav className="flex gap-4">
          {languages.map((lang) => (
            <Link
              key={lang}
              href={`/?lang=${lang}`}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                currentLang === lang
                  ? 'text-black font-bold'
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
