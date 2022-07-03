import { BadRequestException, Body, CacheInterceptor, CacheKey, CACHE_MANAGER, ClassSerializerInterceptor, Controller, Delete, ExecutionContext, Get, Inject, Injectable, Param, Post, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingCreateDto } from './dtos/booking.create.dto';
import { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { Booking } from './booking';
import { AuthGuard } from 'src/auth/auth.guard';

@Injectable()
class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return 'key';
  }
}


@Controller()
export class BookingController {

    constructor(
        private readonly bookingService:BookingService,
        @Inject(CACHE_MANAGER) private cacheManager :Cache,
        private eventEmitter: EventEmitter2
    ){

    }

    @Get(['admin/bookings'])
    async alladmin(
        @Req() request: Request

    ){
        //let bookings = await this.cacheManager.get<Booking[]>('bookings');
        let bookings = await this.bookingService.find();
            
        if( request.query.dt ){
            const dt = request.query.dt.toString();
            bookings = bookings.filter( b => b.book_dt.indexOf(dt) >= 0 );
        }
        bookings.sort( (a,b) => {
            if( a.book_dt == b.book_dt ) return 0;
            else if( a.book_dt > b.book_dt ) return 1; 
            else return -1;
        } );
        return bookings;
    }


    @UseInterceptors(HttpCacheInterceptor ,ClassSerializerInterceptor)
    @Get(['bookings'])
    async all(
        @Req() request: Request

    ){
        // disable the cache, UseInterceptors doesnt seems to work with redis cache.
        //await this.cacheManager.del('bookings');
        //let bookings = await this.cacheManager.get<Booking[]>('bookings');
        //if( !bookings ){
            let bookings = await this.bookingService.find();
            //await this.cacheManager.set( 'bookings', bookings, {ttl:1800 } );
        //}
        if( request.query.dt ){
            const dt = request.query.dt.toString();
            bookings = bookings.filter( b => b.book_dt.indexOf(dt) >= 0 );
        }
        bookings.sort( (a,b) => {
            if( a.book_dt == b.book_dt ) return 0;
            else if( a.book_dt > b.book_dt ) return 1; 
            else return -1;
        } );
        return bookings;
    }

    @Post(['bookings','admin/bookings'])
    async create(
        @Body() body: BookingCreateDto
    ){
        const dtx = new Date(body.book_dt.substr(0,10));
        if( dtx.getDay() == 0 || dtx.getDay() == 6 ){
            throw new BadRequestException('Cannot make bookings on Saturday Sunday.');
        }
        const dth = parseInt(body.book_dt.substr(11));
        console.log(dth);
        if( dth < 9 || dth >= 18 || isNaN(dth) ){
            throw new BadRequestException('Booking can be made from 9am - 6pm only .');
        }

        const book = await this.bookingService.save( body );
        this.eventEmitter.emit('bookings_updated');
        return book;
    }

    @Get(['bookings/:id','admin/bookings/:id'])
    async get(
        @Param('id') id: number
    ){
        return this.bookingService.findOne( {
            where: {
                id
            }
        });
    }

    @UseGuards(AuthGuard)
    @Put('admin/bookings/:id')
    async update(
        @Param('id') id: number,
        @Body() body: BookingCreateDto
    ){

        const dtx = new Date(body.book_dt.substr(0,10));
        if( dtx.getDay() == 0 || dtx.getDay() == 6 ){
            throw new BadRequestException('Cannot make bookings on Saturday Sunday.');
        }
        const dth = parseInt(body.book_dt.substr(11));
        if( dth < 9 || dth >= 18 ){
            throw new BadRequestException('Booking can be made from 9am - 6pm only .');
        }


        
        await this.bookingService.update( id, body);

        this.eventEmitter.emit('bookings_updated');

        return this.bookingService.findOne( {
            where: {
                id
            }
        });
    }

    @UseGuards(AuthGuard)
    @Delete('admin/bookings/:id')
    async delete(
        @Param('id') id: number
    ){
        const response = await this.bookingService.delete( id);

        this.eventEmitter.emit('bookings_updated');

        return  response;
    }

}

