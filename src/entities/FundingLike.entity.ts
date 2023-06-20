import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users.entity';
import { Funding } from './Funding.entity';

@Entity({ name: 'FundingLike' })
export class FundingLike {
  @PrimaryGeneratedColumn('uuid')
  like_id: UUID;

  @Column({ type: 'boolean', nullable: true })
  funding_like: true;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updated_at: Date;

  // * Users | M : 1 | Users
  @ManyToOne(() => Users, (users) => users.FundingLike, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'user_id' }])
  Users: Users;

  // * Users | M : 1 | Funding
  @ManyToOne(() => Funding, (users) => users.FundingLike, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'funding_id', referencedColumnName: 'funding_id' }])
  Funding: Funding;
}
