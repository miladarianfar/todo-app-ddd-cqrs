import { TodoList } from '../entities/todo-list.entity';

export interface TodoListRepository {
  createTodoList(todoList: TodoList): Promise<TodoList>;
  findById(todoListId: string): Promise<TodoList | null>;
  updateTodoList(todoList: TodoList): Promise<TodoList>;
  deleteTodoList(todoListId: string): Promise<void>;
}
