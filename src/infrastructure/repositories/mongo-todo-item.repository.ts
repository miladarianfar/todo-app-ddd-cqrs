import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoItemRepository } from '../../domain/repositories/todo-item.repository';
import { TodoItemDocument } from '../database/schemas/todo-item.schema';
import { TodoItem } from '../../domain/entities/todo-item.entity';

export class MongoTodoItemRepository implements TodoItemRepository {
  constructor(
    @InjectModel(TodoItemDocument.name)
    private readonly todoItemModel: Model<TodoItemDocument>,
  ) {}

  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    const createdTodoItem = new this.todoItemModel(todoItem);
    const savedTodoItem = await createdTodoItem.save();
    return new TodoItem(
      savedTodoItem.id,
      savedTodoItem.title,
      savedTodoItem.description,
      savedTodoItem.priority,
      savedTodoItem.todoListId,
    );
  }

  async findById(todoItemId: string): Promise<TodoItem | null> {
    const item = await this.todoItemModel.findById(todoItemId).exec();
    return item
      ? new TodoItem(
          item._id.toString(),
          item.title,
          item.description,
          item.priority,
          item.todoListId,
        )
      : null;
  }

  async findAll(todoListId: string): Promise<TodoItem[]> {
    const items = await this.todoItemModel
      .find({ todoListId })
      .sort({ priority: -1 })
      .exec();
    return items.map(
      (savedTodoItem) =>
        new TodoItem(
          savedTodoItem._id.toString(),
          savedTodoItem.title,
          savedTodoItem.description,
          savedTodoItem.priority,
          savedTodoItem.todoListId,
        ),
    );
  }

  async updateTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    await this.todoItemModel
      .findByIdAndUpdate(todoItem.id, todoItem, { new: true })
      .exec();
    return todoItem;
  }

  async deleteTodoItem(todoItemId: string): Promise<void> {
    await this.todoItemModel.findByIdAndDelete(todoItemId).exec();
  }

  async updateTodoItemPriority(
    todoItemId: string,
    newPriority: number,
  ): Promise<void> {
    await this.todoItemModel
      .findByIdAndUpdate(todoItemId, { priority: newPriority })
      .exec();
  }
}
