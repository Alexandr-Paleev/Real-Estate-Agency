import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';
import { PropertiesService } from './properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  findAll(@Query('lang') lang: string) {
    return this.propertiesService.findAll(lang);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { title?: string; price?: number },
    @Query('lang') lang = 'RU',
  ) {
    return this.propertiesService.update(id, body, lang);
  }
}
