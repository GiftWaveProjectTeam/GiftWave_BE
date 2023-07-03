import {
  Post,
  Controller,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
  Query,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { FundingService } from './funding.service';
import { CreateFundingDto } from './dto/create-funding.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { UpdateFundingDto } from './dto/update-funding,dto';
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
    console.log(Image);
    const bucketName = configService.get('AWS_BUCKET_NAME');
    const key = Image.originalname;
    const fileData = Image.buffer;
    const contentType = Image.mimetype;

    return this.fundingService.createFunding(
      bucketName,
      key,
      fileData,
      contentType,
      createfunding,
    );
  }

  //펀딩 조회
  @Get()
  getAllFunding(@Query('user') user: string): Promise<object> {
    return this.fundingService.getAllFunding(user);
  }

  //펀딩 삭제
  @Delete('/:id')
  deleteFunding(@Param('id') fundingId: string) {
    return this.fundingService.deleteFunding(fundingId);
  }

  //펀딩 수정(배송지 추후 입력)
  @Patch('/:id')
  @UseInterceptors(FileInterceptor('Image'))
  updateFunding(
    @Param('id') fundingId: string,
    @UploadedFile() Image: Express.Multer.File,
    @Body() updateFunding: UpdateFundingDto,
  ) {
    console.log(Image);
    let key = null;
    let fileData = null;
    let contentType = null;
    if (Image) {
      key = Image.originalname;
      fileData = Image.buffer;
      contentType = Image.mimetype;
    }
    const bucketName = configService.get('AWS_BUCKET_NAME');

    return this.fundingService.updateFunding(
      fundingId,
      updateFunding,
      bucketName,
      key,
      fileData,
      contentType,
    );
  }
}
