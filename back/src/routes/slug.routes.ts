import { Router } from 'express';
import * as SlugController from '../controllers/slug.controller';
const router = Router();

router.get('/', SlugController.getAllSlugs);

export default router;
