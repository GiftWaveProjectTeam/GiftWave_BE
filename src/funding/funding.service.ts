import { Injectable } from '@nestjs/common';
import { CreateFundingDto } from './dto/create-funding.dto';
import { Funding } from 'src/entities/Funding.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Recipient } from 'src/entities/Recipient.entity';
import { Account } from 'src/entities/Account.entity';
import { InjectEntityManager } from '@nestjs/typeorm';

@Injectable()
export class FundingService {
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,

    @InjectRepository(Recipient)
    private recipientRepository: Repository<Recipient>,

    @InjectRepository(Account)
    private accountRepository: Repository<Account>,

    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async createFunding(createFunding: CreateFundingDto): Promise<object> {
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
