import { Attendee } from '@/attendees/attendee.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  when: Date;

  @Column()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    cascade: true,
  })
  attendees: Attendee[];

  /** VIRTUAL PROPERTIES */
  attendeesCount?: number;
  attendeeRejected?: number;
  attendeeAccepted?: number;
  attendeeMaybe?: number;
}
