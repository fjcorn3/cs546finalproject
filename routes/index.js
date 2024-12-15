import express from 'express';
import path from 'path';
import userRoutes from './userRoutes.js';
import attendeePostsRoutes from './attendeePostsRoutes.js';
import organizerPostsRoutes from './organizerPostsRoutes.js';

const router = express.Router();
const __dirname = path.resolve();

router.use('/', userRoutes);
//router.use('/posts', attendeePostsRoutes);
//router.use('/events', organizerPostsRoutes);
//router.use('/create', organizerPostsRoutes);
router.use('/', attendeePostsRoutes);
router.use('/', organizerPostsRoutes);


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'static/homePage.html'));
});

export default router;
