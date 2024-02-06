import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'eventsdbroot',
      database: 'events',
      entities: [Event],
      synchronize: true, // Only for development
    }), // 👈 Add this to tell TypeOrmModule to connect to the database
    TypeOrmModule.forFeature([Event]), // 👈 Add this to tell TypeOrmModule that the Event entity is registered in the current scope
  ],
  controllers: [AppController, EventsController],
  providers: [AppService],
})
export class AppModule {}
