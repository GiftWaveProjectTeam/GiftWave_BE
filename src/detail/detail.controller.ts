import { Controller, Get, Param } from '@nestjs/common';
import { DetailService } from './detail.service';

@Controller('detail')
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  @Get('/:id')
  getDetailById(@Param('id') funding_id: string) {
    return this.detailService.getDetailById(funding_id);
  }
}
