import {
  Post,
  Controller,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FundingService } from './funding.service';
import { CreateFundingDto } from './dto/create-funding.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { AuthGuard } from '@nestjs/passport';
config();
const configService = new ConfigService();

@Controller('funding')
@UseGuards(AuthGuard('jwt'))
export class FundingController {
  constructor(private readonly fundingService: FundingService) {}

  //펀딩등록
  @Post()
  @UseInterceptors(FileInterceptor('Image'))
  async uploadFile(
    @Req() req,
    @UploadedFile() Image: Express.Multer.File,
    @Body() createfunding: CreateFundingDto,
  ): Promise<object> {
    const user = req.user;
    //업로드 파일정보
    const bucketName = configService.get('AWS_BUCKET_NAME');
    const key = Image.originalname;
    const fileData = Image.buffer;
    const contentType = Image.mimetype;

    return this.fundingService.createFunding(
      user,
      bucketName,
      key,
      fileData,
      contentType,
      createfunding,
    );
  }

  //펀딩 조회
  @Get()
  getAllFunding(@Req() req): Promise<object> {
    console.log(req.user);
    const user = req.user.user_id;
    return this.fundingService.getAllFunding(user);
  }
}
