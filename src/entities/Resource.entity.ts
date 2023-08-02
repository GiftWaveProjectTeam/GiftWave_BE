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

@Entity({ name: 'Resource' })
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  resource_id: UUID;

  @Column({ type: 'varchar', nullable: false })
  resource_type: string;

  @Column({ type: 'varchar', nullable: false })
  file_name: string;

  @Column({ type: 'varchar', nullable: false })
  file_location: string;

  @Column({ type: 'integer', nullable: true })
  resource_order: number;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: false })
  updated_at: Date;

  // * Users | 1 : 1 | Funding
  @OneToOne(() => Funding, (funding) => funding.Resource, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'funding_id', referencedColumnName: 'funding_id' }])
  Funding: Funding;
}
