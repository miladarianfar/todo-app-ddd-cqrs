import { TodoItem } from './todo-item.entity';

export class TodoList {
  constructor(
    public readonly id: string,
    public title: string,
    public userId: string,
    public todoItems: TodoItem[] = [],
  ) {}

  addTodoItem(todoItem: TodoItem) {
    this.todoItems.push(todoItem);
  }

  removeTodoItem(todoItemId: string) {
    this.todoItems = this.todoItems.filter((list) => list.id !== todoItemId);
  }
}
