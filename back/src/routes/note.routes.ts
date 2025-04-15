import { Router } from 'express';
import * as NoteController from '../controllers/note.controller';

const router = Router();

router.get('/', NoteController.getAllNotes);

router.get('/:id', NoteController.getNoteById);

router.post('/', NoteController.upsertNote);

router.delete('/:id', NoteController.deleteNote);

router.patch('/:id/star', NoteController.toggleStarred);

export default router;
