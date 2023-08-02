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
import { Recipient } from './Recipient.entity';

@Entity({ name: 'Account' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  account_id: UUID;

  @Column({ type: 'varchar', nullable: false })
  bank: string;

  @Column({ type: 'varchar', nullable: false })
  account: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updated_at: Date;

  // * Users | 1 : 1 | Recipient
  @OneToOne(() => Recipient, (recipient) => recipient.Account, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'recipient_id', referencedColumnName: 'recipient_id' }])
  Recipient: Recipient;
}
