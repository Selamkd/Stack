import { Router } from 'express';
import * as BoardDocController from '../controllers/boarddoc.controller';

const router = Router();

router.get('/:key', BoardDocController.getBoardDoc);
router.post('/', BoardDocController.upsertBoardDoc);

export default router;
