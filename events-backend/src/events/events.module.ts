import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { Event } from './event.entity';
import { Attendee } from '@/attendees/attendee.entity';
import { EventsService } from './events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Attendee]), // 👈 Add this to tell TypeOrmModule that the Event entity is registered in the current scope
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
