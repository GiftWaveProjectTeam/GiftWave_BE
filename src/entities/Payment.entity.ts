import { UUID } from "crypto";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Users } from "./Users.entity";
import { Funding } from "./Funding.entity";

@Entity({name: 'Payment'})
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    payment_id: UUID

    @Column({type: 'bigint', nullable: true})
    gift_price: bigint

    @Column({type: 'boolean', nullable: true})
    payment_check: false

    @CreateDateColumn({type: 'datetime', nullable: false})
    created_at: Date

    @UpdateDateColumn({type: 'datetime', nullable: false})
    updated_at: Date


    // * Users | M : 1 | Users
    @ManyToOne(() => Users, (users) => users.Payment, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'user_id' }])
    Users: Users;

    // * Users | M : 1 | Funding
    @ManyToOne(() => Funding, (users) => users.Payment, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'funding_id', referencedColumnName: 'funding_id' }])
    Funding: Funding;
}