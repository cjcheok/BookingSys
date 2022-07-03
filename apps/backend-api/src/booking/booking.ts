import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('bookings')
export class Booking{

    @PrimaryGeneratedColumn()
    @Exclude()
    id: number;

    @Column({unique:true})
    book_dt: string;

    @Column()
    @Exclude()
    first_name: string;

    @Column()
    @Exclude()
    last_name: string;

    @Column()
    @Exclude()
    email: string;
}