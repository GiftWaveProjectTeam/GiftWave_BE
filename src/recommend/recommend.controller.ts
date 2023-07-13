import { Controller, Get } from '@nestjs/common';
import { RecommendService } from './recommend.service';

@Controller('recommendation')
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}

  @Get()
  scrapperController() {
    return this.recommendService.getDataViaPuppeteer();
  }
}
