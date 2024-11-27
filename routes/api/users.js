import { Router } from 'express';
import userData from '../../data/users.js';

const router = Router();

router.get('/', (req, res) => {
  //TODO
  res.json({users: "GET"});
});

router.post('/', (req, res) => {
  //TODO
  res.json({users: "POST"});
});


router.get('/:eventId', (req, res) => {
  //TODO
  res.json({users: "GET"})
});

export default router;