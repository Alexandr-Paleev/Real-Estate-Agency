'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
  images?: string[];
  type: string;
  slug: string;
}

interface PropertiesViewProps {
  initialData: Property[];
  lang: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
  const [filterType, setFilterType] = useState<string>('ALL');

  const { data: properties = [], isRefetching } = useQuery({
    queryKey: ['properties', lang],
    queryFn: () => fetchProperties(lang),
    initialData,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const filteredProperties = useMemo(() => {
    if (filterType === 'ALL') return properties;
    return properties.filter((p) => p.type === filterType);
  }, [properties, filterType]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === 'TH' ? 'th-TH' : 'en-US', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {isRefetching && (
        <div className="fixed top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm animate-pulse z-50">
          Обновление...
        </div>
      )}

      <MapWrapper properties={filteredProperties} lang={lang} />

      <div className="my-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {lang === 'RU'
              ? 'Доступные объекты'
              : lang === 'TH'
                ? 'อสังหาริมทรัพย์ที่ว่าง'
                : 'Available Properties'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {filteredProperties.length}{' '}
            {lang === 'RU' ? 'объектов найдено' : 'properties found'}
          </p>
        </div>

        <div className="flex gap-2 bg-muted p-1 rounded-lg">
          {(['ALL', 'VILLA', 'CONDO'] as const).map((type) => (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterType(type)}
              className="capitalize"
            >
              {type === 'ALL'
                ? lang === 'RU'
                  ? 'Все'
                  : 'All'
                : type.toLowerCase()}
            </Button>
          ))}
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-xl text-muted-foreground">
          {lang === 'RU'
            ? 'Нет объектов по вашему запросу'
            : 'No properties found for this filter'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property: Property, index: number) => (
            <Link
              key={property.id}
              href={`/property/${property.slug}?lang=${lang}`}
            >
              <Card className="overflow-hidden flex flex-col h-full transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer group">
                <div className="aspect-video w-full overflow-hidden relative">
                  <img
                    src={
                      property.images && property.images.length > 0
                        ? property.images[0]
                        : getPropertyImage(index)
                    }
                    alt={property.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold uppercase">
                    {property.type}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                    {property.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="line-clamp-3">
                    {property.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between items-center bg-muted/30">
                  <p className="font-bold text-xl text-primary">
                    {formatPrice(property.price)}
                  </p>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Details →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
