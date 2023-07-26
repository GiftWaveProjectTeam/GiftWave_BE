import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Funding } from 'src/entities/Funding.entity';
import { Repository } from 'typeorm';
import { participantFundingDto } from './dto/participantFunding.dto';
import { Payment } from 'src/entities/Payment.entity';
import { Users } from 'src/entities/Users.entity';
import { Celebration } from 'src/entities/Celebration.entity';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

config();
const configService = new ConfigService();

@Injectable()
export class DetailService {
  private s3: S3;
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,

    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(Users)
    private userRepository: Repository<Users>,

    @InjectRepository(Celebration)
    private celebrationRepository: Repository<Celebration>,
  ) {
    // AWS 인증 정보 설정
    this.s3 = new S3({
      accessKeyId: configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: configService.get('AWS_SECRET_KEY'),
      region: null, // AWS S3 버킷이 위치한 리전
    });
  }

  async getDetailById(funding_id: string) {
    const funding = await this.fundingRepository
      .createQueryBuilder('Funding')
      .select([
        'Funding.funding_id',
        'Funding.title',
        'Funding.content',
        'Funding.price',
        'Funding.finish_date',
        'Funding.product_name',
        'Resource.file_location',
        'Recipient.name',
      ])
      .leftJoin('Funding.Resource', 'Resource')
      .leftJoin('Funding.Recipient', 'Recipient')
      .where('Funding.funding_id = :funding_id', { funding_id: funding_id })
      .getOne();

    const payment = await this.paymentRepository
      .createQueryBuilder('Payment')
      .select(['Payment.payment_id', 'Payment.gift_price'])
      .leftJoin('Payment.Funding', 'Funding')
      .where('Payment.funding_id = :funding_id', { funding_id: funding_id })
      .getMany();
    //전체 모인 금액 퍼센트 산출하기
    let paymentSum = 0;
    payment.map((item) => {
      if (typeof item.gift_price === 'string') {
        paymentSum += Number(item.gift_price);
      } else {
        paymentSum += 0;
      }
    });
    const percent = Math.ceil(paymentSum / Number(funding.price)) * 100;

    const celebration = await this.celebrationRepository
      .createQueryBuilder('Celebration')
      .select([
        'Celebration.funding_msg',
        'Celebration.funding_nickname',
        'Celebration.file_location',
      ])
      .leftJoin('Celebration.Funding', 'Funding')
      .where('Celebration.funding_id = :funding_id', { funding_id: funding_id })
      .getMany();

    const detail = {
      fundingId: funding.funding_id,
      title: funding.title,
      content: funding.content,
      imageUrl: funding.Resource.file_location,
      price: funding.price, //목표금액
      percent: percent,
      finishDate: funding.finish_date,
      productName: funding.product_name,
      receiveName: funding.Recipient.name,
      celebrateMsg: celebration,
    };
    return detail;
  }

  //펀딩참여하기
  async participantFunding(
    funding: participantFundingDto,
    user: string,
    funding_id: string,
    Image: Express.Multer.File,
  ) {
    const { payment, celebration } = funding;
    const fundingpost = await this.fundingRepository
      .createQueryBuilder('Funding')
      .where('Funding.funding_id = :funding_id', { funding_id: funding_id })
      .getOne();

    const fundinguser = await this.userRepository
      .createQueryBuilder('Users')
      .where('Users.user_id = :user_id', { user_id: user })
      .getOne();

    await this.paymentRepository.save({
      gift_price: payment,
      payment_check: false,
      Funding: fundingpost,
      Users: fundinguser,
    });
    let uploadResult;
    if (Image) {
      const bucketName = configService.get('AWS_BUCKET_NAME');
      const key = Image.originalname;
      const fileData = Image.buffer;
      const contentType = Image.mimetype;

      //s3 업로드
      const uuid = uuidv4();
      const uploadParams = {
        Bucket: bucketName,
        Key: `${uuid}-${key}`,
        Body: fileData,
        ContentType: contentType,
      };
      uploadResult = await this.s3.upload(uploadParams).promise();
      console.log(typeof uploadResult);
    }

    if (celebration) {
      if (!Image) {
        uploadResult = {
          Location: undefined,
        };
      }
      await this.celebrationRepository.save({
        funding_msg: celebration,
        funding_nickname: fundinguser.nickname,
        file_location: uploadResult.Location,
        Funding: fundingpost,
        Users: fundinguser,
      });
    }

    return { message: '펀딩에 성공적으로 참여하였습니다.' };
  }
}
