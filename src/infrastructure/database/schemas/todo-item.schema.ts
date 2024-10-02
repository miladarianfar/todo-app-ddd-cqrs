import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TodoItemDocument extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  priority: number;

  @Prop({ required: true })
  todoListId: string;
}

export const TodoItemSchema = SchemaFactory.createForClass(TodoItemDocument);
