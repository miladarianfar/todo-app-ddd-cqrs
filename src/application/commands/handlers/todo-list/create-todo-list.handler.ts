import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTodoListCommand } from '../../todo-list/create-todo-list.command';
import { TodoListRepository } from 'src/domain/repositories/todo-list.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { TodoList } from 'src/domain/entities/todo-list.entity';
import { ForbiddenException, Inject } from '@nestjs/common';

@CommandHandler(CreateTodoListCommand)
export class CreateTodoListHandler
  implements ICommandHandler<CreateTodoListCommand>
{
  constructor(
    @Inject('TodoListRepository')
    private readonly todoListRepository: TodoListRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateTodoListCommand): Promise<TodoList> {
    const { userId, title } = command;
    const todoList = new TodoList(new Date().toISOString(), title, userId);

    const savedTodoList =
      await this.todoListRepository.createTodoList(todoList);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ForbiddenException('Permission denied');
    }

    user.addTodoList(savedTodoList);
    await this.userRepository.updateUser(user);

    return savedTodoList;
  }
}
