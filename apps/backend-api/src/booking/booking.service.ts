import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/shared/abstract.service';
import { Repository } from 'typeorm';
import { Booking } from './booking';

@Injectable()
export class BookingService extends AbstractService{
    constructor(
        @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>
    ){
        super(bookingRepository);
    }
}
