import path from 'path';
const __dirname = path.resolve();

const logRequest = (req, res, next) => {
  console.log(
    `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} ${
      req.session.user
        ? `(Authenticated ${req.session.user.role.toUpperCase()} User)`
        : '(Non-Authenticated)'
    }`
  );
  if (req.originalUrl === '/') {
    if (req.session.user) {
      return req.session.user.role === 'organizer' ? res.redirect('/coordinatorProfile/:username') : res.redirect('/eventPage');
    } else {
      res.sendFile(path.join(__dirname, 'static/homepage.html'));
      //return res.redirect('/signin');
    }
  }

  next();
};

const signinRedirect = (req, res, next) => {
  if (req.session.user) {
    return req.session.user.role === 'organizer' ? res.redirect('/coordinatorProfile/:username') : res.redirect('/eventPage');
  }
  next();
};

const signupRedirect = (req, res, next) => {
  if (req.session.user) {
    return req.session.user.role === 'organizer' ? res.redirect('/coordinatorProfile/:username') : res.redirect('/eventPage');
  }
  next();
};

const authenticateUser = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/signin');
  }
  next();
};

const authenticateOrganizer = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/signin');
  }
  if (req.session.user.role !== 'organizer') {
    return res.status(403).render('error', {
      errorMessage: 'Access Denied. You do not have permission to view this page.',
      title: 'Error',
      userPageLink: '/eventPage',
    });
  }
  next();
};

const allowSignOut = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/signin');
  }
  next();
};

export { logRequest, signinRedirect, signupRedirect, authenticateUser, authenticateOrganizer, allowSignOut };

