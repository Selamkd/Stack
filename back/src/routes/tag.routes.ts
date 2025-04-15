import { Router } from 'express';
import * as TagController from '../controllers/tag.controller';

const router = Router();

router.get('/', TagController.getAllTags);
router.get('/:id', TagController.getTagById);
router.post('/', TagController.upsertTag);
router.delete('/:id', TagController.deleteTag);

export default router;
