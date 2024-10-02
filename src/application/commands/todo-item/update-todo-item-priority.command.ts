export class UpdateTodoItemPriorityCommand {
    constructor(
      public readonly userId: string,
      public readonly todoItemId: string,
      public readonly priority: number,
    ) {}
  }
  