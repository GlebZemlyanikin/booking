import express from 'express';
import * as bookingsController from '../controllers/bookingsController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', bookingsController.getAll);
router.get('/property/:propertyId', bookingsController.getByPropertyId);
router.get('/:id', bookingsController.getById);
router.post('/', bookingsController.create);
router.delete(
    '/:id',
    authenticate,
    requireAdmin,
    bookingsController.deleteById
);

export default router;
