import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserRepository } from 'src/domain/repositories/user.repository';
import { Inject } from '@nestjs/common';
import { GetTodoListsForUserQuery } from '../../todo-list/get-todo-lists-for-user.query';

@QueryHandler(GetTodoListsForUserQuery)
export class GetTodoListsForUserHandler
  implements IQueryHandler<GetTodoListsForUserQuery>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetTodoListsForUserQuery): Promise<any[]> {
    const user = await this.userRepository.findById(query.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user.todoLists;
  }
}
