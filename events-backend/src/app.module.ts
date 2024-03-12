import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from '@/events/events.module';
import { AppJapanService } from '@/app.japan.service';
import { AppDummy } from '@/app.dummy';
import { ConfigModule } from '@nestjs/config';
import ormConfig from '@/config/orm.config';
import ormConfigProd from '@/config/orm.config.prod';
import { SchoolModule } from '@/school/school.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig], // 👈 Load the ormConfig
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd, // 👈 Use the factory function
    }), // 👈 Add this to tell TypeOrmModule to connect to the database
    EventsModule,
    SchoolModule,
  ],
  controllers: [AppController],
  providers: [
    AppDummy,
    // 👇 Class Provider
    {
      provide: AppService,
      useClass: AppJapanService,
    },
    // 👇 Value Provider
    {
      provide: 'APP_NAME',
      useValue: 'Event Management',
    },
    // 👇 Factory Provider
    {
      provide: 'MESSAGE',
      inject: [AppDummy],
      useFactory: (app) => `${app.dummy()}`,
    },
  ],
})
export class AppModule {}
