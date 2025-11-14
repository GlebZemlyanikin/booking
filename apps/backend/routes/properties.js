import express from 'express';
import * as propertiesController from '../controllers/propertiesController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', propertiesController.getAll);
router.get('/:id', propertiesController.getById);
router.post('/', authenticate, requireAdmin, propertiesController.create);
router.put('/:id', authenticate, requireAdmin, propertiesController.update);
router.patch('/:id', authenticate, requireAdmin, propertiesController.update);
router.delete(
    '/:id',
    authenticate,
    requireAdmin,
    propertiesController.deleteById
);

export default router;
