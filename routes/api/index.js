import { Router } from 'express';

import userRoutes from './users.js';
import eventRoutes from './events.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/events', eventRoutes);

export default router;