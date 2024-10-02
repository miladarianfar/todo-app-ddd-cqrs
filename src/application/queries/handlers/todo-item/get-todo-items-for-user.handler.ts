import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { TodoItemRepository } from 'src/domain/repositories/todo-item.repository';
import { TodoListRepository } from 'src/domain/repositories/todo-list.repository';
import { GetTodoItemsForUserQuery } from '../../todo-item/get-todo-items-for-user.query';

@QueryHandler(GetTodoItemsForUserQuery)
export class GetTodoItemsForUserHandler
  implements IQueryHandler<GetTodoItemsForUserQuery>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('TodoItemRepository')
    private readonly todoItemRepository: TodoItemRepository,
    @Inject('TodoListRepository')
    private readonly todoListRepository: TodoListRepository,
  ) {}

  async execute(query: GetTodoItemsForUserQuery): Promise<any[]> {
    const { userId, todoListId } = query;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const todoList = await this.todoListRepository.findById(todoListId);
    if (!todoList) throw new NotFoundException('Todo List not found');

    if (user.id !== todoList.userId)
      throw new ForbiddenException('Permission denied');

    const items = await this.todoItemRepository.findAll(todoList.id);

    return items;
  }
}
