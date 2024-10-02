import { TodoItem } from '../entities/todo-item.entity';

export interface TodoItemRepository {
  createTodoItem(todoItem: TodoItem): Promise<TodoItem>;
  findById(todoItemId: string): Promise<TodoItem | null>;
  findAll(todoListId: string): Promise<TodoItem[]>;
  updateTodoItem(todoItem: TodoItem): Promise<TodoItem>;
  deleteTodoItem(todoItemId: string): Promise<void>;
  updateTodoItemPriority(
    todoItemId: string,
    newPriority: number,
  ): Promise<void>;
}
