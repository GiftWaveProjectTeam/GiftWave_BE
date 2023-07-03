import { Injectable, NotFoundException } from '@nestjs/common';
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
import { Resource } from 'src/entities/Resource.entity';
import { v4 as uuidv4 } from 'uuid';
import { UpdateFundingDto } from './dto/update-funding,dto';
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

    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,

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
    contentType: string,
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
    const uuid = uuidv4();
    const uploadParams = {
      Bucket: bucketName,
      Key: `${uuid}-${key}`,
      Body: fileData,
      ContentType: contentType,
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
        //이미지 정보 db 저장
        await transactionEntityManager.save(Resource, {
          resource_type: 'RT01',
          file_name: key,
          file_location: uploadResult.Location,
          resource_order: 1,
          Funding: funding,
        });

        return { message: '펀딩 등록이 완료되었습니다.' };
      },
    );

    return queryRunner;
  }

  async getAllFunding(user: string): Promise<object> {
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

    const list = postList.map((item) => ({
      fundingId: item.funding_id,
      title: item.title,
      price: item.price,
      imageUrl: item.Resource ? item.Resource.file_location : null,
    }));

    const userPost = await this.fundingRepository
      .createQueryBuilder('Funding')
      .select([
        'Funding.funding_id',
        'Funding.title',
        'Funding.price',
        'Resource.file_location',
      ])
      .leftJoin('Funding.Resource', 'Resource')
      .orderBy('Funding.created_at', 'DESC')
      .where('Funding.user_id = :user', { user: user })
      .getMany();

    const userPostlist = userPost.map((item) => ({
      fundingId: item.funding_id,
      title: item.title,
      price: item.price,
      imageUrl: item.Resource ? item.Resource.file_location : null,
    }));

    return { user: userPostlist, post: list };
  }

  async deleteFunding(fundingId: string): Promise<object> {
    const funding = await this.fundingRepository
      .createQueryBuilder('Funding')
      .where('Funding.funding_id = :fundingId', { fundingId: fundingId })
      .getOne();

    if (!funding) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }
    await this.fundingRepository.delete(fundingId);

    return { message: '펀딩 삭제가 완료되었습니다.' };
  }

  async updateFunding(
    fundingId: string,
    updateFunding: UpdateFundingDto,
    bucketName: string,
    key: string | null,
    fileData: Buffer | null,
    contentType: string | null,
  ): Promise<object> {
    //해당 게시물 찾기
    const funding = await this.fundingRepository
      .createQueryBuilder('Funding')
      .leftJoin('Funding.Resource', 'Resource')
      .where('Funding.funding_id = :fundingId', { fundingId: fundingId })
      .select([
        'Funding.funding_id',
        'Resource.file_name',
        'Resource.file_location',
      ])
      .getOne();
    console.log(funding);

    if (!funding) {
      throw new NotFoundException('해당 게시물을 찾을 수 없습니다.');
    }
    //s3 업로드
    let uploadResult;
    if (fileData !== null) {
      const uuid = uuidv4();
      const uploadParams = {
        Bucket: bucketName,
        Key: `${uuid}-${key}`,
        Body: fileData,
        ContentType: contentType,
      };
      uploadResult = await this.s3.upload(uploadParams).promise();
      console.log(uploadResult);
    }

    //각 테이블ID 찾기
    const recipientId = await this.recipientRepository
      .createQueryBuilder('Recipient')
      .leftJoin('Recipient.Funding', 'Funding')
      .where('Funding.funding_id = :fundingId', { fundingId: fundingId })
      .select(['Recipient.recipient_id'])
      .getOne();
    const accountId = await this.accountRepository
      .createQueryBuilder('Account')
      .leftJoin('Account.Recipient', 'Recipient')
      .where('Recipient.recipient_id = :recipientId', {
        recipientId: recipientId.recipient_id,
      })
      .select(['Account.account_id'])
      .getOne();
    const resourceId = await this.resourceRepository
      .createQueryBuilder('Resource')
      .leftJoin('Resource.Funding', 'Funding')
      .where('Funding.funding_id = :fundingId', { fundingId: fundingId })
      .select(['Resource.resource_id'])
      .getOne();

    //수정하기
    const queryRunner = this.entityManager.transaction(
      async (transactionEntityManager) => {
        await transactionEntityManager.update(
          Funding,
          { funding_id: fundingId },
          {
            title: updateFunding.title,
            content: updateFunding.content,
            page_url: updateFunding.url,
            option: updateFunding.option,
            price: updateFunding.price,
            finish_date: updateFunding.finishDate,
          },
        );

        await transactionEntityManager.update(
          Recipient,
          { recipient_id: recipientId.recipient_id },
          {
            name: updateFunding.receiveName,
            phone_number: updateFunding.phoneNum,
          },
        );

        await transactionEntityManager.update(
          Account,
          { account_id: accountId.account_id },
          {
            bank: updateFunding.bank,
            account: updateFunding.accountNum,
          },
        );
        if (uploadResult) {
          await transactionEntityManager.update(
            Resource,
            { resource_id: resourceId.resource_id },
            {
              file_name: key,
              file_location: uploadResult.Location,
            },
          );
        }

        return { message: '펀딩 수정이 완료되었습니다.' };
      },
    );

    return queryRunner;
  }
}
