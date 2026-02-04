import { Header } from '@/components/header';
import { PropertiesView } from '@/components/properties-view';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  lat?: number;
  lng?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getProperties(lang: string): Promise<Property[]> {
  try {
    const res = await fetch(`${API_URL}/api/properties?lang=${lang}`, {
      next: { tags: ['properties'] },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch properties');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

export default async function Index({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const lang = resolvedSearchParams.lang || 'EN';
  const properties = await getProperties(lang);

  return (
    <div className="min-h-screen bg-background">
      <Header currentLang={lang} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {lang === 'RU'
            ? 'Виллы на Пхукете'
            : lang === 'TH'
              ? 'วิลล่าในภูเก็ต'
              : 'Phuket Villas'}
        </h1>

        <PropertiesView initialData={properties} lang={lang} />
      </main>
    </div>
  );
}
