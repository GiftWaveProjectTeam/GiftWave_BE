import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Funding } from './Funding.entity';
import { Account } from './Account.entity';

@Entity({ name: 'Recipient' })
export class Recipient {
  @PrimaryGeneratedColumn('uuid')
  recipient_id: UUID;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  phone_number: string;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updated_at: Date;

  // * Users | 1 : 1 | Funding
  @OneToOne(() => Funding, (funding) => funding.Recipient, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'funding_id', referencedColumnName: 'funding_id' }])
  Funding: Funding;

  // * Users | 1 : 1 | Account
  @OneToOne(() => Account, (account) => account.Recipient, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Account: Account;
}
