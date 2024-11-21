import path from 'path';
import {Router} from 'express';
const router = Router();

const staticDir = path.resolve('static');

router.get('/', (req, res) => {
    res.sendFile(path.join(staticDir, 'homepage.html'));
});

router.get('/signin', (req, res) => {
    res.sendFile(path.join(staticDir, 'signin.html'));
});

router.get('/signup', (req, res) => {
    res.sendFile(path.join(staticDir, 'signup.html'));
});

export default router;