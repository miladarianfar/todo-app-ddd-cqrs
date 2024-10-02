import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class TodoListDocument extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: [{ type: Object }], default: [] })
  todoItems: any[]; // Will contain TodoItems as embedded documents
}

export const TodoListSchema = SchemaFactory.createForClass(TodoListDocument);
