import { TodoList } from './todo-list.entity';

export class User {
  constructor(
    public readonly id: string,
    public username: string,
    public password: string,
    public todoLists: TodoList[] = [],
  ) {}

  addTodoList(todoList: TodoList) {
    this.todoLists.push(todoList);
  }

  removeTodoList(todoListId: string) {
    this.todoLists = this.todoLists.filter((list) => list.id !== todoListId);
  }
}
