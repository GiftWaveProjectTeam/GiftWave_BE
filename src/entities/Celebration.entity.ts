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

@Entity({ name: 'Celebration' })
export class Celebration {
  @PrimaryGeneratedColumn('uuid')
  celebration_id: UUID;

  @Column({ type: 'varchar', nullable: true })
  funding_msg: string;

  @Column({ type: 'varchar', nullable: true })
  funding_nickname: string;

  @Column({ type: 'varchar', nullable: true })
  file_location: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updated_at: Date;

  // * Users | M : 1 | Users
  @ManyToOne(() => Users, (users) => users.Celebration, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'user_id' }])
  Users: Users;

  // * Users | M : 1 | Funding
  @ManyToOne(() => Funding, (users) => users.Celebration, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'funding_id', referencedColumnName: 'funding_id' }])
  Funding: Funding;
}
