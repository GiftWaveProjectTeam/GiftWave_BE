import { Post, Controller, Body, Get } from '@nestjs/common';
import { FundingService } from './funding.service';
import { CreateFundingDto } from './dto/create-funding.dto';
// import { Funding } from 'src/entities/Funding.entity';

@Controller('funding')
export class FundingController {
  constructor(private readonly fundingService: FundingService) {}

  //펀딩등록
  @Post()
  createFunding(@Body() createfunding: CreateFundingDto): Promise<object> {
    return this.fundingService.createFunding(createfunding);
  }

  //펀딩 조회
  @Get()
  getAllFunding() {
    return this.fundingService.getAllFunding();
  }
}
