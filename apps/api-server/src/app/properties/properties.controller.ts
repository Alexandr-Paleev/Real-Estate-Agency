import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { propertySchema } from '@real-estate-agency/db';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  findAll(@Query('lang') lang: string) {
    return this.propertiesService.findAll(lang);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string, @Query('lang') lang: string) {
    return this.propertiesService.findBySlug(slug, lang);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(propertySchema.partial()))
  update(
    @Param('id') id: string,
    @Body() body: { title?: string; price?: number },
    @Query('lang') lang = 'RU',
  ) {
    return this.propertiesService.update(id, body, lang);
  }
}
