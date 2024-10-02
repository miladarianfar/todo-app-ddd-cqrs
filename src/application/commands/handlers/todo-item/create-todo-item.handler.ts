// src/application/commands/handlers/create-todo-item.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { CreateTodoItemCommand } from '../../todo-item/create-todo-item.command';
import { TodoListRepository } from 'src/domain/repositories/todo-list.repository';
import { TodoItemRepository } from 'src/domain/repositories/todo-item.repository';
import { TodoItem } from 'src/domain/entities/todo-item.entity';

@CommandHandler(CreateTodoItemCommand)
export class CreateTodoItemHandler
  implements ICommandHandler<CreateTodoItemCommand>
{
  constructor(
    @Inject('TodoListRepository')
    private readonly todoListRepository: TodoListRepository,
    @Inject('TodoItemRepository')
    private readonly todoItemRepository: TodoItemRepository,
  ) {}

  async execute(command: CreateTodoItemCommand): Promise<TodoItem> {
    const { userId, todoListId, title, description, priority } = command;

    const todoList = await this.todoListRepository.findById(todoListId);

    if (!todoList) {
      throw new NotFoundException('TodoList not found');
    }

    if (todoList.userId !== userId) {
      throw new ForbiddenException('Permission denied');
    }

    const todoItem = new TodoItem(
      new Date().toISOString(),
      title,
      description,
      priority,
      todoListId,
    );
    const savedTodoItem =
      await this.todoItemRepository.createTodoItem(todoItem);

    todoList.addTodoItem(savedTodoItem);
    await this.todoListRepository.updateTodoList(todoList);

    return savedTodoItem;
  }
}
