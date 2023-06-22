// import { Injectable } from '@nestjs/common';
// import { CreateFundingDto } from './dto/create-funding.dto';
// import { Funding } from 'src/entities/Funding.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Recipient } from 'src/entities/Recipient.entity';
// import { Account } from 'src/entities/Account.entity';

// @Injectable()
// export class FundingService {
//   constructor(
//     @InjectRepository(Funding)
//     private fundingRepository: Repository<Funding>,

//     @InjectRepository(Recipient)
//     private recipientRepository: Repository<Recipient>,

//     @InjectRepository(Account)
//     private accountRepository: Repository<Account>,
//   ) {}
//   async createFunding(createfunding: CreateFundingDto): Promise<object> {
//     const {
//       title,
//       content,
//       option,
//       price,
//       url,
//       finishDate,
//       receiveName,
//       phoneNum,
//       bank,
//       accountNum,
//     } = createfunding;
//     //트랜젝션설정
//     const queryRunner = dataSource.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();
//     try {
//       const funding = await queryRunner.manager.getRepository(Funding).save({
//         title,
//         content,
//         page_url: url,
//         perchase: false,
//         option,
//         price,
//         finish_date: finishDate,
//       });

//       const recipient = await queryRunner.manager
//         .getRepository(Recipient)
//         .save({
//           name: receiveName,
//           phone_number: phoneNum,
//           Funding: funding,
//         });
//       await queryRunner.manager.getRepository(Account).save({
//         bank,
//         account: accountNum,
//         Recipient: recipient,
//       });
//       //성공하면 commit
//       await queryRunner.commitTransaction();
//       return Promise.resolve({ message: '펀딩 등록이 완료되었습니다.' });
//     } catch (err) {
//       //실패하면 rollback
//       await queryRunner.rollbackTransaction();
//       throw err;
//     } finally {
//       //queryRunner 연결끊기
//       await queryRunner.release();
//     }
//   }
// }

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
    const postList = await this.fundingRepository.find();
    console.log(postList);
  }
}
