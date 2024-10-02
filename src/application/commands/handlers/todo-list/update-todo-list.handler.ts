import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTodoListCommand } from '../../todo-list/update-todo-list.command';
import { TodoListRepository } from 'src/domain/repositories/todo-list.repository';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { TodoList } from 'src/domain/entities/todo-list.entity';

@CommandHandler(UpdateTodoListCommand)
export class UpdateTodoListHandler
  implements ICommandHandler<UpdateTodoListCommand>
{
  constructor(
    @Inject('TodoListRepository')
    private readonly todoListRepository: TodoListRepository,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UpdateTodoListCommand): Promise<TodoList> {
    const { userId, todoListId, newTitle } = command;

    const todoList = await this.todoListRepository.findById(todoListId);
    if (!todoList) {
      throw new NotFoundException('TodoList not found');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ForbiddenException('Permission denied');
    }

    todoList.title = newTitle;
    const updatedTodoList =
      await this.todoListRepository.updateTodoList(todoList);

    const todoListIndex = user.todoLists.findIndex(
      (list) => list.id === todoListId,
    );
    if (todoListIndex !== -1) {
      user.todoLists[todoListIndex] = todoList;
      await this.userRepository.updateUser(user);
    }

    return updatedTodoList;
  }
}
