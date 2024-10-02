// src/application/commands/handlers/delete-todo-item.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTodoItemCommand } from '../../todo-item/delete-todo-item.command';
import { TodoItemRepository } from 'src/domain/repositories/todo-item.repository';
import { TodoListRepository } from 'src/domain/repositories/todo-list.repository';
import { Inject } from '@nestjs/common';

@CommandHandler(DeleteTodoItemCommand)
export class DeleteTodoItemHandler
  implements ICommandHandler<DeleteTodoItemCommand>
{
  constructor(
    @Inject('TodoItemRepository')
    private readonly todoItemRepository: TodoItemRepository,
    @Inject('TodoListRepository')
    private readonly todoListRepository: TodoListRepository,
  ) {}

  async execute(command: DeleteTodoItemCommand): Promise<void> {
    const { userId, todoItemId } = command;

    const todoItem = await this.todoItemRepository.findById(todoItemId);
    if (!todoItem) {
      throw new Error('TodoItem not found');
    }

    const todoList = await this.todoListRepository.findById(
      todoItem.todoListId,
    );
    if (!todoList || todoList.userId !== userId) {
      throw new Error(
        'Unauthorized: This TodoItem does not belong to the user',
      );
    }

    todoList.removeTodoItem(todoItemId);
    await this.todoListRepository.updateTodoList(todoList);

    await this.todoItemRepository.deleteTodoItem(todoItemId);
  }
}
