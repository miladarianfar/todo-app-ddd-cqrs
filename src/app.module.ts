import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CqrsModule } from '@nestjs/cqrs';
import {
  TodoItemDocument,
  TodoItemSchema,
} from './infrastructure/database/schemas/todo-item.schema';
import {
  TodoListDocument,
  TodoListSchema,
} from './infrastructure/database/schemas/todo-list.schema';
import {
  UserDocument,
  UserSchema,
} from './infrastructure/database/schemas/user.schema';
import { CreateUserHandler } from './application/commands/handlers/user/create-user.handler';
import { GetUserByIdHandler } from './application/queries/handlers/user/get-user-by-id.handler';
import { MongoUserRepository } from './infrastructure/repositories/mongo-user.repository';
import { UserController } from './interfaces/controllers/user.controller';
import { MongoTodoListRepository } from './infrastructure/repositories/mongo-todo-list.repository';
import { GetTodoListByIdHandler } from './application/queries/handlers/todo-list/get-todo-list-by-id.handler';
import { GetTodoListsForUserHandler } from './application/queries/handlers/todo-list/get-todo-lists-for-user.handler';
import { DeleteTodoListHandler } from './application/commands/handlers/todo-list/delete-todo-list.handler';
import { UpdateTodoListHandler } from './application/commands/handlers/todo-list/update-todo-list.handler';
import { CreateTodoListHandler } from './application/commands/handlers/todo-list/create-todo-list.handler';
import { GetTodoItemByIdHandler } from './application/queries/handlers/todo-item/get-todo-item-by-id.handler';
import { GetTodoItemsForUserHandler } from './application/queries/handlers/todo-item/get-todo-items-for-user.handler';
import { CreateTodoItemHandler } from './application/commands/handlers/todo-item/create-todo-item.handler';
import { UpdateTodoItemHandler } from './application/commands/handlers/todo-item/update-todo-item.handler';
import { DeleteTodoItemHandler } from './application/commands/handlers/todo-item/delete-todo-item.handler';
import { UpdateTodoItemPriorityHandler } from './application/commands/handlers/todo-item/update-todo-item-priority.handler';
import { MongoTodoItemRepository } from './infrastructure/repositories/mongo-todo-item.repository';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/'),
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    MongooseModule.forFeature([
      { name: TodoListDocument.name, schema: TodoListSchema },
    ]),
    MongooseModule.forFeature([
      { name: TodoItemDocument.name, schema: TodoItemSchema },
    ]),
    CqrsModule,
  ],
  controllers: [UserController],
  providers: [
    { provide: 'UserRepository', useClass: MongoUserRepository },
    { provide: 'TodoListRepository', useClass: MongoTodoListRepository },
    { provide: 'TodoItemRepository', useClass: MongoTodoItemRepository },
    CreateUserHandler,
    GetUserByIdHandler,
    CreateTodoListHandler,
    UpdateTodoListHandler,
    DeleteTodoListHandler,
    GetTodoListsForUserHandler,
    GetTodoListByIdHandler,
    GetTodoItemByIdHandler,
    GetTodoItemsForUserHandler,
    CreateTodoItemHandler,
    UpdateTodoItemHandler,
    DeleteTodoItemHandler,
    UpdateTodoItemPriorityHandler,
  ],
})
export class AppModule {}
