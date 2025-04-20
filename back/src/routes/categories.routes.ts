import { Router } from 'express';
import * as CategoryController from '../controllers/category.controller';

const router = Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.post('/', CategoryController.upsertCategory);
router.delete('/:id', CategoryController.deleteCategory);

export default router;
