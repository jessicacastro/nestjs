import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Event } from './event.entity';
import { Attendee } from '@/attendees/attendee.entity';

import { EventsService } from './events.service';

import { CreateEventDTO } from './dtos/create-event.dto';
import { UpdateEventDTO } from './dtos/update-event.dto';
import { EventWhenEnum, ListEvents } from './dtos/list.events';

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventsService: EventsService,
  ) {}

  // @Get('/filters')
  // async filters() {
  //   return await this.eventRepository.find({
  //     where: [
  //       {
  //         id: MoreThan(3),
  //         when: MoreThan(new Date('2021-02-12T13:00:00')),
  //       },
  //       {
  //         description: Like('%meet%'),
  //       },
  //     ],
  //     take: 2,
  //     order: {
  //       id: 'DESC',
  //     },
  //     select: {
  //       id: true,
  //       when: true,
  //     },
  //   });
  // }

  // @Get('/practice-relations')
  // async practiceRelations() {
  //   // return await this.eventRepository.findOne({
  //   //   where: { id: 1 },
  //   //   relations: ['attendees'],
  //   // }); --> This is getting the event with id 1 and its attendees (GET /events/practice-relations)

  //   const event = await this.eventRepository.findOne({
  //     where: { id: 1 },
  //     relations: ['attendees'],
  //   });

  //   const attendee = new Attendee();
  //   attendee.name = 'Jerry Maguire, The third';
  //   event.attendees.push(attendee);

  //   await this.eventRepository.save(event);

  //   return event;
  // }

  @Get()
  async findAllEvents(@Query() filter: ListEvents): Promise<Event[]> {
    const events =
      await this.eventsService.getEventsWithAttendeeCountFilteredByWhen(filter);
    this.logger.debug(
      `Found ${events.length} events with the given filter: ${JSON.stringify(EventWhenEnum[filter.when])}`,
    );

    return events;
  }

  @Get('/:id')
  async findOneEvent(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    const event = await this.eventsService.getEvent(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  @Post()
  async createEvent(@Body() newEvent: CreateEventDTO): Promise<Event> {
    const event = {
      ...newEvent,
      when: new Date(newEvent.when),
    };

    const createdEvent = await this.eventRepository.save(event);

    return createdEvent;
  }

  @Patch(':id')
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEventDTO,
  ): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException();
    }

    const updatedEvent = await this.eventRepository.save({
      ...event,
      ...data,
      when: data.when ? new Date(data.when) : event.when,
    });

    return updatedEvent;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteEvent(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id } });

    if (!event) {
      throw new NotFoundException();
    }

    await this.eventRepository.remove(event);

    return;
  }
}
