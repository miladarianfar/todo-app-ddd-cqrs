import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTodoListCommand } from '../../todo-list/delete-todo-list.command';
import { TodoListRepository } from 'src/domain/repositories/todo-list.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { ForbiddenException, Inject } from '@nestjs/common';

@CommandHandler(DeleteTodoListCommand)
export class DeleteTodoListHandler
  implements ICommandHandler<DeleteTodoListCommand>
{
  constructor(
    @Inject('TodoListRepository')
    private readonly todoListRepository: TodoListRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(command: DeleteTodoListCommand): Promise<void> {
    const { userId, todoListId } = command;

    const todoList = await this.todoListRepository.findById(todoListId);
    if (!todoList) {
      throw new Error('TodoList not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user && user.id !== todoList.userId) {
      throw new ForbiddenException('Permission denied');
    }

    user.removeTodoList(todoListId);
    await this.userRepository.updateUser(user);

    await this.todoListRepository.deleteTodoList(todoListId);
  }
}
