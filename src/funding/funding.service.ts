import { Injectable } from '@nestjs/common';
import { CreateFundingDto } from './dto/create-funding.dto';
import { Funding } from 'src/entities/Funding.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Recipient } from 'src/entities/Recipient.entity';
import { Account } from 'src/entities/Account.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();
const configService = new ConfigService();

@Injectable()
export class FundingService {
  private s3: S3;
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,

    @InjectRepository(Recipient)
    private recipientRepository: Repository<Recipient>,

    @InjectRepository(Account)
    private accountRepository: Repository<Account>,

    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
    // AWS 인증 정보 설정
    this.s3 = new S3({
      accessKeyId: configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: configService.get('AWS_SECRET_KEY'),
      region: null, // AWS S3 버킷이 위치한 리전
    });
  }

  async createFunding(
    bucketName: string,
    key: string,
    fileData: Buffer,
    createFunding: CreateFundingDto,
  ): Promise<object> {
    const {
      title,
      content,
      option,
      price,
      url,
      finishDate,
      receiveName,
      phoneNum,
      bank,
      accountNum,
    } = createFunding;
    //s3 업로드
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: fileData,
    };
    const uploadResult = await this.s3.upload(uploadParams).promise();
    console.log(uploadResult);

    //트랜잭션 적용
    const queryRunner = this.entityManager.transaction(
      async (transactionEntityManager) => {
        const funding = await transactionEntityManager.save(Funding, {
          title,
          content,
          page_url: url,
          perchase: false,
          option,
          price,
          finish_date: finishDate,
        });

        const recipient = await transactionEntityManager.save(Recipient, {
          name: receiveName,
          phone_number: phoneNum,
          Funding: funding,
        });

        await transactionEntityManager.save(Account, {
          bank,
          account: accountNum,
          Recipient: recipient,
        });

        return { message: '펀딩 등록이 완료되었습니다.' };
      },
    );

    return queryRunner;
  }

  async getAllFunding() {
    const postList = await this.fundingRepository
      .createQueryBuilder('Funding')
      .select([
        'Funding.funding_id',
        'Funding.title',
        'Funding.price',
        'Resource.file_location',
      ])
      .leftJoin('Funding.Resource', 'Resource')
      .orderBy('Funding.created_at', 'DESC')
      .getMany();
    console.log(postList);
    return postList;
  }
}
