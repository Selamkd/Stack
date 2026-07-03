import { Router } from 'express';
import * as BoardController from '../controllers/board.controller';

const stickyRouter = Router();

stickyRouter.get('/', BoardController.getAllStickies);
stickyRouter.post('/', BoardController.upsertSticky);
stickyRouter.delete('/:id', BoardController.deleteSticky);

const todoRouter = Router();

todoRouter.get('/', BoardController.getAllTodos);
todoRouter.post('/', BoardController.upsertTodo);
todoRouter.delete('/done/clear', BoardController.clearDoneTodos);
todoRouter.delete('/:id', BoardController.deleteTodo);

export { stickyRouter, todoRouter };
