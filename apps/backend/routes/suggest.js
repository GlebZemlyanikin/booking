import express from 'express';
import * as suggestController from '../controllers/suggestController.js';

const router = express.Router();

router.get('/', suggestController.getSuggestions);

export default router;

