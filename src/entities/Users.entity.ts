import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Funding } from './Funding.entity';
import { FundingLike } from './FundingLike.entity';
import { Celebration } from './Celebration.entity';
import { Payment } from './Payment.entity';
import { UserRole, UserStatus, UserType } from 'src/users/users.enum';

@Entity({ name: 'Users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  user_id: UUID;

  @Column({ type: 'varchar', nullable: false, unique: true })
  user: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  phone_number: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  nickname: string;

  @Column({ type: 'varchar', nullable: true })
  profile_image: string;

  @Column({ type: 'varchar', nullable: false })
  user_type: UserType;

  @Column({ type: 'varchar', nullable: true })
  user_status: UserStatus;

  @Column({ type: 'varchar', nullable: true })
  user_role: UserRole;

  @Column({ type: 'varchar', nullable: false })
  gender: string;

  @Column({ type: 'timestamptz', nullable: false })
  birthday: Date;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updated_at: Date;

  // * Users | 1 : M | Funding
  @OneToMany(() => Funding, (funding) => funding.Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Funding: Funding[];

  // * Users | 1 : M | FundingLike
  @OneToMany(() => FundingLike, (fundingLike) => fundingLike.Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  FundingLike: FundingLike[];

  // * Users | 1 : M | Celebration
  @OneToMany(() => Celebration, (celebration) => celebration.Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Celebration: Celebration[];

  // * Users | 1 : M | Payment
  @OneToMany(() => Payment, (payment) => payment.Users, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  Payment: Payment[];
}
