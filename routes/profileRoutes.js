import Router from 'express';
import * as userData from '../data/users.js';

const router = Router();

// ROUTE: /profile/
// METHODS: GET, PATCH
router.route('/')
  .get(async (req, res) => {
    let organizer = false;
    const user = req.session.user;
    if(req.session.user) {
      organizer = req.session.user.role === 'organizer';
    }

    res.render('profile', {title: "Profile", signedIn: req.session.user ? true : false, organizer: organizer, user});
});


// ROUTE: /profile/:id
// METHODS: GET, PATCH
router.route('/:id')
  .get(async (req, res) => {
    let organizer = false;

    const user = await userData.getUserById(req.params.id);

    if(req.session.user) {
      organizer = req.session.user.role === 'organizer';
    }

    res.render('profile', {title: "Profile", signedIn: req.session.user ? true : false, organizer: organizer, user});
});
export default router;