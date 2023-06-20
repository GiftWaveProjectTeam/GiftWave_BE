import { Injectable } from '@nestjs/common';
import { CreateFundingDto } from './dto/create-funding.dto';
import { Funding } from 'src/entities/Funding.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipient } from 'src/entities/Recipient.entity';
import { Account } from 'src/entities/Account.entity';

@Injectable()
export class FundingService {
  constructor(
    @InjectRepository(Funding)
    private fundingRepository: Repository<Funding>,

    @InjectRepository(Recipient)
    private recipientRepository: Repository<Recipient>,

    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}
  async createFunding(createfunding: CreateFundingDto) {
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
    } = createfunding;

    const funding = this.fundingRepository.create({
      title,
      content,
      page_url: url,
      option,
      price,
      finish_date: finishDate,
    });
    const recipient = this.recipientRepository.create({
      name: receiveName,
      phone_number: phoneNum,
    });
    const account = this.accountRepository.create({
      bank,
      account: accountNum,
    });

    await this.fundingRepository.save(funding);
    await this.recipientRepository.save(recipient);
    await this.accountRepository.save(account);

    return { message: '펀딩 등록이 완료되었습니다.' };
  }
}
