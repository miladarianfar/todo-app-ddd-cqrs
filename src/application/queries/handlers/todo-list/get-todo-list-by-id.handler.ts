import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTodoListByIdQuery } from '../../todo-list/get-todo-list-by-id.query';
import { TodoListRepository } from 'src/domain/repositories/todo-list.repository';
import { Inject } from '@nestjs/common';

@QueryHandler(GetTodoListByIdQuery)
export class GetTodoListByIdHandler
  implements IQueryHandler<GetTodoListByIdQuery>
{
  constructor(
    @Inject('TodoListRepository')
    private readonly todoListRepository: TodoListRepository,
  ) {}

  async execute(query: GetTodoListByIdQuery): Promise<any> {
    const todoList = await this.todoListRepository.findById(query.todoListId);
    if (!todoList) {
      throw new Error('TodoList not found');
    }

    return todoList;
  }
}
