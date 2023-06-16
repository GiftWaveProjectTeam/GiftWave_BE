import { UUID } from "crypto";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./Users.entity";
import { Funding } from "./Funding.entity";
import { Address } from "./Address.entity";

@Entity({name: 'Recipient'})
export class Recipient {
    @PrimaryGeneratedColumn('uuid')
    recipient_id: UUID

    @Column({type: 'varchar', nullable: false})
    name: string

    @Column({type: 'varchar', nullable: false})
    phone_number: string

    @CreateDateColumn({type: 'datetime', nullable: false})
    created_at: Date

    @UpdateDateColumn({type: 'datetime', nullable: false})
    updated_at: Date


    // * Users | 1 : M | FundingLike
    @OneToOne(() => Funding, (funding) => funding.Recipient, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'funding_id', referencedColumnName: 'funding_id' }])
    Funding: Funding;

    // * Users | 1 : M | FundingLike
    @OneToOne(() => Address, (address) => address.Recipient, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    Address: Address
}