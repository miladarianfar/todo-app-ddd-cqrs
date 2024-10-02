import { User } from '../entities/user.entity';

export interface UserRepository {
  createUser(user: User): Promise<User>;
  findById(userId: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  updateUser(user: User): Promise<User>;
  deleteUser(userId: string): Promise<void>;
}
