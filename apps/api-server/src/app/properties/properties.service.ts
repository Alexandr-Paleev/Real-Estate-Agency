import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Property, Translation } from '@prisma/client';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(lang = 'EN') {
    const properties = await this.prisma.property.findMany({
      include: {
        translations: true,
        images: true,
      },
    });

    return properties.map((p) => this.mapProperty(p, lang));
  }

  private mapProperty(
    property: Property & {
      translations: Translation[];
      images: { url: string }[];
    },
    lang: string,
  ) {
    const { translations, images, ...rest } = property;

    const getContent = (field: string) => {
      const t =
        translations.find((t) => t.lang === lang && t.field === field) ||
        translations.find((t) => t.lang === 'EN' && t.field === field);
      return t?.content || '';
    };

    return {
      ...rest,
      title: getContent('title'),
      description: getContent('description'),
      images: images.map((img) => img.url),
    };
  }

  async findBySlug(slug: string, lang = 'EN') {
    const property = await this.prisma.property.findUnique({
      where: { slug },
      include: {
        translations: true,
        images: true,
      },
    });

    if (!property) return null;

    return this.mapProperty(property, lang);
  }

  async update(
    id: string,
    data: { title?: string; price?: number },
    lang: string,
  ) {
    if (data.price !== undefined) {
      await this.prisma.property.update({
        where: { id },
        data: { price: data.price },
      });
    }

    if (data.title !== undefined) {
      const existingTranslation = await this.prisma.translation.findFirst({
        where: {
          entityId: id,
          entityType: 'Property',
          field: 'title',
          lang: lang,
        },
      });

      if (existingTranslation) {
        await this.prisma.translation.update({
          where: { id: existingTranslation.id },
          data: { content: data.title },
        });
      } else {
        await this.prisma.translation.create({
          data: {
            entityId: id,
            entityType: 'Property',
            field: 'title',
            lang: lang,
            content: data.title,
          },
        });
      }
    }

    const updatedProperty = await this.prisma.property.findUnique({
      where: { id },
      include: { translations: true },
    });

    const clientPortalUrl =
      process.env.CLIENT_PORTAL_URL || 'http://localhost:4200';
    const revalidateSecret = process.env.REVALIDATE_SECRET;

    if (revalidateSecret) {
      try {
        await fetch(
          `${clientPortalUrl}/api/revalidate?tag=properties&secret=${revalidateSecret}`,
        );
      } catch (error) {
        console.error('Failed to revalidate cache:', error);
      }
    }

    return updatedProperty;
  }
}
