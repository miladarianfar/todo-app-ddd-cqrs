export class DeleteTodoItemCommand {
  constructor(
    public readonly userId: string,
    public readonly todoItemId: string,
  ) {}
}
