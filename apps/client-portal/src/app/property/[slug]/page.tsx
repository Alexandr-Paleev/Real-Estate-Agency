import { Header } from '@/components/header';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  lat?: number;
  lng?: number;
  images?: string[];
  type: string;
  status: string;
  slug: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getProperty(
  slug: string,
  lang: string,
): Promise<Property | null> {
  try {
    const res = await fetch(`${API_URL}/api/properties/${slug}?lang=${lang}`, {
      next: { tags: [`property-${slug}`] },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

export default async function PropertyPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { lang?: string };
}) {
  const { slug } = params;
  const { lang = 'EN' } = searchParams;
  const property = await getProperty(slug, lang);

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
        <Link href={`/?lang=${lang}`}>
          <Button>Back to Listings</Button>
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === 'TH' ? 'th-TH' : 'en-US', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentLang={lang} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/?lang=${lang}`}>
            <Button variant="outline" size="sm">
              ← {lang === 'RU' ? 'Назад к списку' : 'Back to Listings'}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={
                  property.images?.[0] || 'https://via.placeholder.com/800x600'
                }
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            {property.images && property.images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {property.images.slice(1).map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-video rounded-lg overflow-hidden shadow-md"
                  >
                    <img
                      src={img}
                      className="w-full h-full object-cover"
                      alt={`${property.title} ${idx + 2}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-start">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                {property.type}
              </span>
              <span className="bg-muted px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wider">
                {property.status}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              {property.title}
            </h1>

            <div className="mb-8">
              <p className="text-3xl font-bold text-primary">
                {formatPrice(property.price)}
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground mb-12">
              <h3 className="text-foreground font-bold mb-4">
                {lang === 'RU' ? 'Описание' : 'Description'}
              </h3>
              <p className="leading-relaxed whitespace-pre-wrap">
                {property.description}
              </p>
            </div>

            <div className="mt-auto p-6 bg-muted/50 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {lang === 'RU'
                    ? 'Заинтересовал объект?'
                    : 'Interested in this property?'}
                </p>
                <p className="font-bold text-lg">
                  {lang === 'RU'
                    ? 'Свяжитесь с нашим агентом'
                    : 'Contact our agent today'}
                </p>
              </div>
              <Button
                size="lg"
                className="w-full md:w-auto px-12 py-6 text-lg rounded-xl"
              >
                {lang === 'RU' ? 'Оставить заявку' : 'Inquire Now'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
