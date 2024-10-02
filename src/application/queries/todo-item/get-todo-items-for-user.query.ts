export class GetTodoItemsForUserQuery {
  constructor(
    public readonly userId: string,
    public readonly todoListId: string,
  ) {}
}
