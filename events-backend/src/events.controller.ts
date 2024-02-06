import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDTO } from './create-event.dto';
import { UpdateEventDTO } from './update-event.dto';
import { Event } from './event.entity';

@Controller('/events')
export class EventsController {
  // private events: Event[] = [];

  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
  ) {}

  // @Get('/filters')
  // async filters() {
  //   return await this.repository.find({
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

  @Get()
  async findAllEvents(): Promise<Event[]> {
    const events = await this.repository.find();

    return events;
  }

  @Get('/:id')
  async findOneEvent(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    const event = await this.repository.findOne({ where: { id } });

    return event;
  }

  @Post()
  async createEvent(@Body() newEvent: CreateEventDTO): Promise<Event> {
    const event = {
      ...newEvent,
      when: new Date(newEvent.when),
    };

    const createdEvent = await this.repository.save(event);

    return createdEvent;
  }

  @Patch(':id')
  async updateEvent(
    @Param('id') id,
    @Body() data: UpdateEventDTO,
  ): Promise<Event> {
    const eventExists = await this.repository.findOne(id);

    if (!eventExists) {
      throw new Error('Event not found');
    }

    const updatedEvent = await this.repository.save({
      ...eventExists,
      ...data,
      when: data.when ? new Date(data.when) : eventExists.when,
    });

    return updatedEvent;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteEvent(@Param('id') id): Promise<void> {
    const event = await this.repository.findOne(id);

    if (!event) {
      throw new Error('Event not found');
    }

    await this.repository.remove(event);

    return;
  }
}
