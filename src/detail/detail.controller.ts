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

  @Get('/:id')
  getDetailById(@Param('id') funding_id: string) {
    return this.detailService.getDetailById(funding_id);
  }

  @Post('/:id/participant')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('celebrationImg'))
  participantFunding(
    @Req() req,
    @Param('id') funding_id: string,
    @Body() funding: participantFundingDto,
    @UploadedFile() Image: Express.Multer.File,
  ) {
    const user = req.user.user_id;
    return this.detailService.participantFunding(
      funding,
      user,
      funding_id,
      Image,
    );
  }
}
