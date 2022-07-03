import { IsEmail, IsNotEmpty, ValidateBy } from "class-validator";
import { Booking } from "../booking";

export class BookingCreateDto{

    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    book_dt: string;
}