import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { CreateUserCommand } from '../../user/create-user.command';
import { User } from '../../../../domain/entities/user.entity';
import { Inject } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { username, password } = command;
    const user = new User(new Date().toISOString(), username, password);
    return this.userRepository.createUser(user);
  }
}
