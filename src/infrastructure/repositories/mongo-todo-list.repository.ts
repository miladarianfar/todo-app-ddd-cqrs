import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TodoListRepository } from '../../domain/repositories/todo-list.repository';
import { TodoListDocument } from '../database/schemas/todo-list.schema';
import { TodoList } from '../../domain/entities/todo-list.entity';

export class MongoTodoListRepository implements TodoListRepository {
  constructor(
    @InjectModel(TodoListDocument.name)
    private readonly todoListModel: Model<TodoListDocument>,
  ) {}

  async createTodoList(todoList: TodoList): Promise<TodoList> {
    const createdTodoList = new this.todoListModel(todoList);
    const savedTodoList = await createdTodoList.save();
    return new TodoList(
      savedTodoList.id,
      savedTodoList.title,
      savedTodoList.userId,
      savedTodoList.todoItems,
    );
  }

  async findById(todoListId: string): Promise<TodoList | null> {
    const todoList = await this.todoListModel.findById(todoListId).exec();
    return todoList
      ? new TodoList(
          todoList.id,
          todoList.title,
          todoList.userId,
          todoList.todoItems,
        )
      : null;
  }

  async updateTodoList(todoList: TodoList): Promise<TodoList> {
    await this.todoListModel
      .findByIdAndUpdate(todoList.id, todoList, { new: true })
      .exec();
    return todoList;
  }

  async deleteTodoList(todoListId: string): Promise<void> {
    await this.todoListModel.findByIdAndDelete(todoListId).exec();
  }
}
