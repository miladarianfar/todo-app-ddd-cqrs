export class GetTodoItemByIdQuery {
  constructor(
    public readonly todoListId: string,
    public readonly todoItemId: string,
    public readonly userId: string,
  ) {}
}
