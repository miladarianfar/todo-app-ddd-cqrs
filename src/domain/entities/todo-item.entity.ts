export class TodoItem {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public priority: number,
    public todoListId: string,
  ) {}
}
