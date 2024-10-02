import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTodoItemCommand } from '../../todo-item/update-todo-item.command';
import { TodoItemRepository } from 'src/domain/repositories/todo-item.repository';
import { TodoListRepository } from 'src/domain/repositories/todo-list.repository';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { TodoItem } from 'src/domain/entities/todo-item.entity';

@CommandHandler(UpdateTodoItemCommand)
export class UpdateTodoItemHandler
  implements ICommandHandler<UpdateTodoItemCommand>
{
  constructor(
    @Inject('TodoItemRepository')
    private readonly todoItemRepository: TodoItemRepository,
    @Inject('TodoListRepository')
    private readonly todoListRepository: TodoListRepository,
  ) {}

  async execute(command: UpdateTodoItemCommand): Promise<TodoItem> {
    const { userId, todoItemId, title, description, priority } = command;
    const todoItem = await this.todoItemRepository.findById(todoItemId);

    if (!todoItem) {
      throw new NotFoundException('TodoItem not found');
    }

    const todoList = await this.todoListRepository.findById(
      todoItem.todoListId,
    );
    if (!todoList || todoList.userId !== userId) {
      throw new ForbiddenException('Permission denied');
    }

    if (title) todoItem.title = title;
    if (description) todoItem.description = description;
    if (priority !== undefined) todoItem.priority = priority;

    const updatedTodoItem =
      await this.todoItemRepository.updateTodoItem(todoItem);

    const todoItemIndex = todoList.todoItems.findIndex(
      (item) => item.id === todoItemId,
    );
    if (todoItemIndex !== -1) {
      todoList.todoItems[todoItemIndex] = todoItem;
      await this.todoListRepository.updateTodoList(todoList);
    }

    return updatedTodoItem;
  }
}
