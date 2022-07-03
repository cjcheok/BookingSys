import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Cache } from "cache-manager";


@Injectable()
export class BookingListener{

    constructor(
        @Inject(CACHE_MANAGER) private  cacheManager: Cache
    ){

    }

    @OnEvent('bookings_updated')
    async handleBookingUpdatedEvent(){
        await this.cacheManager.del('bookings');
    }

}