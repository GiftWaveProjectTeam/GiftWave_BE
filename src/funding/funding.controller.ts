import { Controller } from '@nestjs/common';
import { FundingService } from './funding.service';

@Controller('funding')
export class FundingController {
  constructor(private readonly fundingService: FundingService) {}
}
