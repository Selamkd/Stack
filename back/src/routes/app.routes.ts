import { Router } from 'express';
import tagRoutes from './tag.routes';
import noteRoutes from './note.routes';
import snippetRoutes from './snippet.routes';
import quickLookupRoutes from './lookups.routes';
import logger from '../utils/logger';

const router = Router();

router.use(logger.middleware());

router.use('/api/tags', tagRoutes);
router.use('/api/notes', noteRoutes);
router.use('/api/snippets', snippetRoutes);
router.use('/api/quicklookups', quickLookupRoutes);

router.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
