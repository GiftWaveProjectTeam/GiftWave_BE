import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users.entity';
import { FundingLike } from './FundingLike.entity';
import { Celebration } from './Celebration.entity';
import { Payment } from './Payment.entity';
import { Recipient } from './Recipient.entity';

@Entity({ name: 'Funding' })
export class Funding {
  @PrimaryGeneratedColumn('uuid')
  funding_id: UUID;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @Column({ type: 'varchar', nullable: false })
  page_url: string;

  @Column({ type: 'varchar', nullable: false })
  product_name: string;

  @Column({ type: 'varchar', nullable: true })
  option: string;

  @Column({ type: 'bigint', nullable: false })
  price: bigint;

  @Column({ type: 'datetime', nullable: false })
  finish_date: Date;

  @Column({ type: 'boolean', nullable: false })
  perchase: true;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updated_at: Date;

  // * Users | 1 : M | FundingLike
  @ManyToOne(() => Users, (users) => users.Funding, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'user_id' }])
  Users: Users;

  // * Users | 1 : M | FundingLike
  @OneToMany(() => FundingLike, (fundingLike) => fundingLike.Funding, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  FundingLike: FundingLike[];

  // * Users | 1 : M | Celebration
  @OneToMany(() => Celebration, (celebration) => celebration.Funding, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Celebration: Celebration[];

  // * Users | 1 : M | Payment
  @OneToMany(() => Payment, (payment) => payment.Funding, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Payment: Payment[];

  // * Users | 1 : M | Recipient
  @OneToOne(() => Recipient, (recipient) => recipient.Funding, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Recipient: Recipient;
}
