import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';

import { Event } from '@/events/event.entity';
import { Attendee } from '@/attendees/attendee.entity';
import { Teacher } from '@/school/teacher.entity';
import { Subject } from '@/school/subject.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    entities: [Event, Attendee, Subject, Teacher],
    synchronize: true, // Only for development
  }),
);
