'use client';

import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl mb-8 flex items-center justify-center text-muted-foreground">
      Loading map...
    </div>
  ),
});

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  lat?: number;
  lng?: number;
}

interface MapWrapperProps {
  properties: Property[];
  lang: string;
}

export default function MapWrapper({ properties, lang }: MapWrapperProps) {
  return <MapComponent properties={properties} lang={lang} />;
}
