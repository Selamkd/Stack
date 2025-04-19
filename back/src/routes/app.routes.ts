import { Router } from 'express';
import tagRoutes from './tag.routes';

import noteRoutes from './note.routes';
import snippetRoutes from './snippet.routes';
import quickLookupRoutes from './lookups.routes';
import adminRoutes from './admin.routes';
import logger from '../utils/logger';

const router = Router();

router.use(logger.middleware());

router.use('/tags', tagRoutes);
router.use('/notes', noteRoutes);
router.use('/snippets', snippetRoutes);
router.use('/check-pass', adminRoutes);
router.use('/quicklookups', quickLookupRoutes);

router.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
