import {
  Post,
  Controller,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FundingService } from './funding.service';
import { CreateFundingDto } from './dto/create-funding.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
// import { AuthGuard } from '@nestjs/passport';
config();
const configService = new ConfigService();

@Controller('funding')
export class FundingController {
  constructor(private readonly fundingService: FundingService) {}

  //펀딩등록
  @Post()
  // @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('Image'))
  async uploadFile(
    @UploadedFile() Image: Express.Multer.File,
    @Body() createfunding: CreateFundingDto,
  ): Promise<object> {
    //업로드 파일정보
    const bucketName = configService.get('AWS_BUCKET_NAME');
    const key = Image.originalname;
    const fileData = Image.buffer;

    return this.fundingService.createFunding(
      bucketName,
      key,
      fileData,
      createfunding,
    );
  }

  //펀딩 조회
  @Get()
  getAllFunding(@Query('user') user: string): Promise<object> {
    return this.fundingService.getAllFunding(user);
  }
}
