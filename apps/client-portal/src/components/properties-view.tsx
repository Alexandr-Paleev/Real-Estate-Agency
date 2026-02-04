'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import MapWrapper from '@/components/map-wrapper';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  lat?: number;
  lng?: number;
}

interface PropertiesViewProps {
  initialData: Property[];
  lang: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Разные стоковые фото вилл для заглушек
const VILLA_IMAGES = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
];

function getPropertyImage(index: number): string {
  return VILLA_IMAGES[index % VILLA_IMAGES.length];
}

async function fetchProperties(lang: string): Promise<Property[]> {
  const res = await fetch(`${API_URL}/api/properties?lang=${lang}`);
  if (!res.ok) {
    throw new Error('Failed to fetch properties');
  }
  return res.json();
}

export function PropertiesView({ initialData, lang }: PropertiesViewProps) {
  const { data: properties = [], isRefetching } = useQuery({
    queryKey: ['properties', lang],
    queryFn: () => fetchProperties(lang),
    initialData,
    // Обновлять каждые 30 секунд
    refetchInterval: 30 * 1000,
    // Обновлять при возврате на вкладку
    refetchOnWindowFocus: true,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === 'TH' ? 'th-TH' : 'en-US', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Индикатор обновления */}
      {isRefetching && (
        <div className="fixed top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm animate-pulse z-50">
          Обновление...
        </div>
      )}

      {/* Карта */}
      <MapWrapper properties={properties} lang={lang} />

      {/* Список объектов */}
      {properties.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {lang === 'RU' ? 'Нет доступных вилл' : 'No properties found'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <Card key={property.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={getPropertyImage(index)}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{property.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="line-clamp-3">
                  {property.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <p className="font-bold text-lg text-primary">
                  {formatPrice(property.price)}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
