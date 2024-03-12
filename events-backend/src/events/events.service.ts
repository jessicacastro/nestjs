import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Injectable, Logger } from '@nestjs/common';
import { AttendeeAnswerEnum } from '@/attendees/attendee.entity';
import { EventWhenEnum, ListEvents } from './dtos/list.events';
import { PaginateOptions, paginate } from '@/pagination/paginator';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventsRepository
      .createQueryBuilder('event')
      .orderBy('event.id', 'DESC');
  }

  public async getEventsWithAttendeesCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('event.attendeesCount', 'event.attendees')
      .loadRelationCountAndMap(
        'event.attendeeAccepted',
        'event.attendees',
        'attendee', // This is the alias for the relation
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }), // 1 is the value for the Accepted enum
      )
      .loadRelationCountAndMap(
        'event.attendeeMaybe',
        'event.attendees',
        'attendee',
        (qb) =>
          qb.andWhere('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'event.attendeeRejected',
        'event.attendees',
        'attendee',
        (qb) =>
          qb.andWhere('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Declined,
          }),
      );
  }

  private async getEventsWithAttendeeCountFilteredByWhen(filter?: ListEvents) {
    let query = await this.getEventsWithAttendeesCountQuery();

    if (!filter) {
      return query;
    }

    if (filter.when == EventWhenEnum.TODAY) {
      query = query.andWhere(
        `event.when >= CURDATE() AND event.when <= CURDATE() + INTERVAL 1 DAY`,
      );
    }

    if (filter.when == EventWhenEnum.TOMORROW) {
      query = query.andWhere(
        `event.when >= CURDATE() + INTERVAL 1 DAY AND event.when <= CURDATE() + INTERVAL 2 DAY`,
      );
    }

    if (filter.when == EventWhenEnum.THIS_WEEK) {
      query = query.andWhere(
        `YEARWEEK(event.when, 1) = YEARWEEK(CURDATE(), 1)`,
      );
    }

    if (filter.when == EventWhenEnum.NEXT_WEEK) {
      query = query.andWhere(
        `YEARWEEK(event.when, 1) = YEARWEEK(CURDATE(), 1) + 1`,
      );
    }

    if (filter.when == EventWhenEnum.NEXT_MONTH) {
      // MYSQL QUERY FOR NEXT MONTH
      query = query.andWhere(
        `YEAR(event.when) = YEAR(CURDATE()) AND MONTH(event.when) = MONTH(CURDATE()) + 1`,
      );
    }

    return query;
  }

  public async getEventsWithAttendeeCountFilteredByWhenPaginated(
    filter: ListEvents,
    paginateOptions: PaginateOptions,
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFilteredByWhen(filter),
      paginateOptions,
    );
  }

  public async getEvent(id: number): Promise<Event | null> {
    const eventQuery = (await this.getEventsWithAttendeesCountQuery()).andWhere(
      'event.id = :id',
      {
        id,
      },
    ); // Add this line to the base query to filter by id

    this.logger.debug(eventQuery.getSql()); // Log the SQL query (optional)

    return eventQuery.getOne(); // Return the result of the query
  }
}
