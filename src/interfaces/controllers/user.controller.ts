// src/interfaces/controllers/user.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../application/commands/user/create-user.command';
import { GetUserByIdQuery } from 'src/application/queries/user/get-user-by-id.query';
import { GetTodoListsForUserQuery } from 'src/application/queries/todo-list/get-todo-lists-for-user.query';
import { CreateTodoListCommand } from 'src/application/commands/todo-list/create-todo-list.command';
import { SignupDto } from './dto/signup.dto';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { UpdateTodoListCommand } from 'src/application/commands/todo-list/update-todo-list.command';
import { DeleteTodoListCommand } from 'src/application/commands/todo-list/delete-todo-list.command';
import { CreateTodoItemCommand } from 'src/application/commands/todo-item/create-todo-item.command';
import { CreateTodoItemDto } from './dto/create-todo-item.dto';
import { GetTodoItemsForUserQuery } from 'src/application/queries/todo-item/get-todo-items-for-user.query';
import { GetTodoItemByIdQuery } from 'src/application/queries/todo-item/get-todo-item-by-id.query';
import { DeleteTodoItemCommand } from 'src/application/commands/todo-item/delete-todo-item.command';
import { UpdateTodoItemPriorityCommand } from 'src/application/commands/todo-item/update-todo-item-priority.command';
import { UpdateTodoItemCommand } from 'src/application/commands/todo-item/update-todo-item.command';

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('signup')
  async signUp(@Body() body: SignupDto) {
    return this.commandBus.execute(
      new CreateUserCommand(body.username, body.password),
    );
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    return this.queryBus.execute(new GetUserByIdQuery(userId));
  }

  @Post(':userId/todo-lists')
  async createTodoList(
    @Param('userId') userId: string,
    @Body() body: CreateTodoListDto,
  ) {
    return this.commandBus.execute(
      new CreateTodoListCommand(userId, body.title),
    );
  }
  @Get(':userId/todo-lists')
  async getTodoListsForUser(@Param('userId') userId: string) {
    return this.queryBus.execute(new GetTodoListsForUserQuery(userId));
  }

  @Put(':userId/todo-lists/:todoListId')
  async updateTodoList(
    @Param('userId') userId: string,
    @Param('todoListId') todoListId: string,
    @Body() body: CreateTodoListDto,
  ) {
    return this.commandBus.execute(
      new UpdateTodoListCommand(userId, todoListId, body.title),
    );
  }

  @Delete(':userId/todo-lists/:todoListId')
  async deleteTodoList(
    @Param('userId') userId: string,
    @Param('todoListId') todoListId: string,
  ) {
    await this.commandBus.execute(
      new DeleteTodoListCommand(userId, todoListId),
    );
    return { result: true, message: 'todo list successfully removed' };
  }

  @Post(':userId/todo-lists/:todoListId/todo-item')
  async createTodoItem(
    @Param('userId') userId: string,
    @Param('todoListId') todoListId: string,
    @Body() body: CreateTodoItemDto,
  ) {
    return this.commandBus.execute(
      new CreateTodoItemCommand(
        userId,
        todoListId,
        body.title,
        body.description,
        body.priority,
      ),
    );
  }

  @Get(':userId/todo-lists/:todoListId/todo-item')
  async getAllTodoItems(
    @Param('userId') userId: string,
    @Param('todoListId') todoListId: string,
  ) {
    return this.queryBus.execute(
      new GetTodoItemsForUserQuery(userId, todoListId),
    );
  }

  @Get(':userId/todo-lists/:todoListId/todo-item/:todoItemId')
  async getTodoItemById(
    @Param('userId') userId: string,
    @Param('todoListId') todoListId: string,
    @Param('todoItemId') todoItemId: string,
  ) {
    return this.queryBus.execute(
      new GetTodoItemByIdQuery(todoListId, todoItemId, userId),
    );
  }

  @Put(':userId/todo-lists/todo-item/:todoItemId/:priority')
  async updateTodoItemPriority(
    @Param('userId') userId: string,
    @Param('todoItemId') todoItemId: string,
    @Param('priority') priority: number,
  ) {
    return this.commandBus.execute(
      new UpdateTodoItemPriorityCommand(userId, todoItemId, priority),
    );
  }

  @Put(':userId/todo-lists/:todoListId/todo-item/:todoItemId')
  async updateTodoItem(
    @Param('userId') userId: string,
    @Param('todoListId') todoListId: string,
    @Param('todoItemId') todoItemId: string,
    @Body() body: CreateTodoItemDto,
  ) {
    console.log('here');
    return this.commandBus.execute(
      new UpdateTodoItemCommand(
        userId,
        todoItemId,
        todoListId,
        body.title,
        body.description,
        body.priority,
      ),
    );
  }

  @Delete(':userId/todo-lists/todo-item/:todoItemId')
  async deleteTodoItem(
    @Param('userId') userId: string,
    @Param('todoItemId') todoItemId: string,
  ) {
    return this.commandBus.execute(
      new DeleteTodoItemCommand(userId, todoItemId),
    );
  }
}
