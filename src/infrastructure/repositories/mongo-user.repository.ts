import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserDocument } from '../database/schemas/user.schema';
import { User } from '../../domain/entities/user.entity';

export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(user: User): Promise<User> {
    const createdUser = new this.userModel(user);
    const savedUser = await createdUser.save();
    return new User(
      savedUser.id,
      savedUser.username,
      savedUser.password,
      savedUser.todoLists,
    );
  }

  async findById(userId: string): Promise<User | null> {
    console.log('userId', userId);
    const user = await this.userModel.findById(userId).exec();
    console.log(user);
    return user
      ? new User(user.id, user.username, user.password, user.todoLists)
      : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username }).exec();
    return user
      ? new User(user.id, user.username, user.password, user.todoLists)
      : null;
  }

  async updateUser(user: User): Promise<User> {
    await this.userModel.findByIdAndUpdate(user.id, user, { new: true }).exec();
    return user;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.userModel.findByIdAndDelete(userId).exec();
  }
}
