import { Router } from 'express';
import tagRoutes from './tag.routes';

import noteRoutes from './note.routes';
import snippetRoutes from './snippet.routes';
import quickLookupRoutes from './lookups.routes';
import adminRoutes from './admin.routes';
import categoryRoutes from './categories.routes';
import logger from '../utils/logger';
import ticketRoutes from './ticket.routes';

const router = Router();

router.use(logger.middleware());

router.use('/tags', tagRoutes);
router.use('/notes', noteRoutes);
router.use('/snippets', snippetRoutes);
router.use('/check-pass', adminRoutes);
router.use('/quicklookups', quickLookupRoutes);
router.use('/categories', categoryRoutes);
router.use('/tickets', ticketRoutes);

router.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
