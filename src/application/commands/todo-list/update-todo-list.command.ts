export class UpdateTodoListCommand {
  constructor(
    public readonly userId: string,
    public readonly todoListId: string,
    public readonly newTitle: string,
  ) {}
}
