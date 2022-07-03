import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { Booking } from './booking';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingListener } from './listener/booking.listener';

@Module({
  imports:[
    TypeOrmModule.forFeature([Booking]),
    SharedModule
  ],
  controllers: [BookingController],
  providers: [BookingService,BookingListener],
  exports:[BookingService]
})
export class BookingModule {}
