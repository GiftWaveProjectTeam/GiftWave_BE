import { UUID } from "crypto";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Recipient } from "./Recipient.entity";

@Entity({name: 'Address'})
export class Address {
    @PrimaryGeneratedColumn('uuid')
    address_id: UUID

    @Column({type: 'varchar', nullable: true})
    zone_code: string

    @Column({type: 'varchar', nullable: true})
    address: string

    @Column({type: 'varchar', nullable: true})
    address_english: string

    @Column({type: 'varchar', nullable: true})
    address_type: string

    @Column({type: 'varchar', nullable: true})
    building_name: string

    @Column({type: 'varchar', nullable: true})
    building_code: string

    @Column({type: 'varchar', nullable: true})
    road_address: string

    @Column({type: 'varchar', nullable: true})
    road_address_english: string

    @Column({type: 'varchar', nullable: true})
    auth_jibun_address: string

    @Column({type: 'varchar', nullable: true})
    auth_jibun_address_english: string

    @Column({type: 'varchar', nullable: true})
    road_name: string

    @Column({type: 'varchar', nullable: true})
    road_name_code: string

    @Column({type: 'varchar', nullable: true})
    road_name_english: string

    @CreateDateColumn({type: 'datetime', nullable: false})
    created_at: Date

    @UpdateDateColumn({type: 'datetime', nullable: false})
    updated_at: Date


    // * Users | 1 : M | FundingLike
    @OneToOne(() => Recipient, (recipient) => recipient.Address, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'recipient_id', referencedColumnName: 'recipient_id' }])
    Recipient: Recipient;
}