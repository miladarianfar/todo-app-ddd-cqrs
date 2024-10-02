import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class UserDocument extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Object }], default: [] })
  todoLists: any[];
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
