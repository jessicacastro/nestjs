import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDTO {
  @IsString()
  @Length(5, 255, { message: 'name is too short or too long' })
  name: string;

  @Length(5, 255, { message: 'description is too short or too long' })
  description: string;

  @IsDateString()
  when: string;

  @Length(5, 255)
  address: string;
}
