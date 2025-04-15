import { Router } from 'express';
import * as QuickLookupController from '../controllers/quickLookup.controller';

const router = Router();

router.get('/', QuickLookupController.getAllLookUps);

router.get('/:id', QuickLookupController.getLookupById);

router.get('/search', QuickLookupController.searchLookups);

router.post('/', QuickLookupController.UpsertLookUp);

router.delete('/:id', QuickLookupController.deleteQuickLookup);

router.patch('/:id/star', QuickLookupController.toggleStarred);

export default router;
