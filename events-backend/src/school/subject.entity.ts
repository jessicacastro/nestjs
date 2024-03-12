import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Teacher } from './teacher.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects, { cascade: true })
  @JoinTable({
    name: 'teachers_subjects', // 👈 Join table name
    // joinColumn: {
    //   // 👈 Add subjectId as a Join Column, Join colum is the column that is used to join the two tables
    //   name: 'subject_id',
    //   referencedColumnName: 'id',
    // },
    // inverseJoinColumn: {
    //   // 👈 Add teacherId as a reversed Join Column, Join colum is the column that is used to join the two tables
    //   name: 'teacher_id',
    //   referencedColumnName: 'id',
    // },
  })
  teachers: Teacher[];
}
