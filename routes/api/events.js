import { Router } from 'express';
import eventData from '../../data/events.js';

const router = Router();

router.get('/', (req, res) => {
  //TODO
  res.json({Events: "GET"});
});

router.post('/', (req, res) => {
  //TODO
  res.json({events: "POST"});
});


router.get('/:eventId', (req, res) => {
  //TODO
  res.json({events: "GET"})
});

export default router;