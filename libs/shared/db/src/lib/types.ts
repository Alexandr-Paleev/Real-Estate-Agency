/**
 * Shared types for Phuket Estate application
 * These types are used across client-portal, admin-panel, and api-server
 */

export interface PropertyBase {
  id: string;
  slug: string;
  price: number;
  lat: number;
  lng: number;
  type: string;
  status: string;
  agentId?: string | null;
}

export interface PropertyWithTranslations extends PropertyBase {
  title: string;
  description: string;
}

export interface Translation {
  id: string;
  entityId: string;
  entityType: string;
  lang: 'RU' | 'EN' | 'TH';
  field: string;
  content: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
}

export type SupportedLanguage = 'RU' | 'EN' | 'TH';

export interface UpdatePropertyDto {
  title?: string;
  price?: number;
}
