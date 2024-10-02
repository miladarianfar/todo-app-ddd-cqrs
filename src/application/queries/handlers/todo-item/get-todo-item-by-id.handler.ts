import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTodoListByIdQuery } from '../../todo-list/get-todo-list-by-id.query';
import { TodoListRepository } from 'src/domain/repositories/todo-list.repository';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { TodoItemRepository } from 'src/domain/repositories/todo-item.repository';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { GetTodoItemByIdQuery } from '../../todo-item/get-todo-item-by-id.query';

@QueryHandler(GetTodoItemByIdQuery)
export class GetTodoItemByIdHandler
  implements IQueryHandler<GetTodoListByIdQuery>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('TodoItemRepository')
    private readonly todoItemRepository: TodoItemRepository,
    @Inject('TodoListRepository')
    private readonly todoListRepository: TodoListRepository,
  ) {}

  async execute(query: GetTodoItemByIdQuery): Promise<any> {
    const { userId, todoListId, todoItemId } = query;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const todoList = await this.todoListRepository.findById(todoListId);
    if (!todoList) throw new NotFoundException('Todo List not found');

    if (user.id !== todoList.userId)
      throw new ForbiddenException('Permission denied');

    const todoItem = await this.todoItemRepository.findById(todoItemId);
    if (!todoItem) {
      throw new NotFoundException('TodoItem not found');
    }

    return todoItem;
  }
}
