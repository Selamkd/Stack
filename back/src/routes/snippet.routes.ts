import { Router } from 'express';
import * as SnippetController from '../controllers/snippet.controller';

const router = Router();

router.get('/', SnippetController.getAllSnippets);

router.get('/:id', SnippetController.getSnippetById);

router.post('/', SnippetController.upsertSnippet);

router.delete('/:id', SnippetController.deleteSnippet);

router.patch('/:id/star', SnippetController.toggleStarred);

export default router;
