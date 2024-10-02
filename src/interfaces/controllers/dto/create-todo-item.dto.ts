import { IsNumber, IsString } from 'class-validator';

export class CreateTodoItemDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  priority: number;
}
