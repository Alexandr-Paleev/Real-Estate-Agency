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
      },
    });

    return properties.map((p) => this.mapProperty(p, lang));
  }

  private mapProperty(
    property: Property & { translations: Translation[] },
    lang: string,
  ) {
    const { translations, ...rest } = property;

    // Helper to find content by field
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
    };
  }

  findOne(id: string) {
    return `This action returns a #${id} property`;
  }

  async update(
    id: string,
    data: { title?: string; price?: number },
    lang: string,
  ) {
    // 1. Update basic fields (price) on Property model
    if (data.price !== undefined) {
      await this.prisma.property.update({
        where: { id },
        data: { price: data.price },
      });
    }

    // 2. Update translation (title) if provided
    if (data.title !== undefined) {
      // Check if translation exists
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
        // Create new translation if it doesn't exist
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

    // Revalidate Client Portal Cache
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

  remove(id: string) {
    return `This action removes a #${id} property`;
  }
}
