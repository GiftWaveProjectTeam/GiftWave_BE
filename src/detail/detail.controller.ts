import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DetailService } from './detail.service';
import { AuthGuard } from '@nestjs/passport';
import { participantFundingDto } from './dto/participantFunding.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('detail')
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  //펀딩디테일 조회하기
  @Get('/:id')
  getDetailById(@Param('id') funding_id: string): Promise<object> {
    return this.detailService.getDetailById(funding_id);
  }

  //펀딩참여하기
  @Post('/:id/participant')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('celebrationImg'))
  participantFunding(
    @Req() req,
    @Param('id') funding_id: string,
    @Body() funding: participantFundingDto,
    @UploadedFile() Image: Express.Multer.File,
  ): Promise<object> {
    const user = req.user;
    return this.detailService.participantFunding(
      funding,
      user,
      funding_id,
      Image,
    );
  }

  //관심등록하기
  @Post('/:id/like')
  @UseGuards(AuthGuard('jwt'))
  likeFunding(@Param('id') funding_id: string, @Req() req) {
    const user = req.user;
    console.log(req.user);
    return this.detailService.likeFunding(funding_id, user);
  }
}
