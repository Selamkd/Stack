import { Router } from 'express';
import * as AdminController from '../controllers/admin.controller';

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: 'Too many attempts. Please try again later.',
});

const router = Router();

router.post('/', limiter, AdminController.checkPass);

export default router;
