import { Router } from 'express';

import userRoutes from './users.js';
import eventRoutes from './events.js';
import commentRoutes from './comments.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/events', eventRoutes);
router.use('/comments', commentRoutes);

export default router;