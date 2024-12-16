import path from 'path';
const __dirname = path.resolve();

export const logRequest = (req, res, next) => {
  const timestamp = new Date().toUTCString();
  let authorized = 'Non-Authenticated';
  let role = '';

  if (req.session.user) {
    authorized = 'Authenticated - ';
    role = req.session.user.role;
  }

  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} (${authorized}${role})`); 

  next();
};

export const unauthenticatedRedirect = (req, res, next) => {
  if(!req.session.user) {
    return res.redirect('/signin');
  }

  next();
};

export const authenticatedRedirect = (req, res, next) => {
  if(req.session.user) {
    return res.redirect('/home');
  }
  next();
};

export const authenticateOrganizer = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/signin');
  }
  if (req.session.user.role !== 'organizer') {
    return res.status(400).render('error', {title: 'Error', signedIn: req.session.user ? true : false, message: 'Access Denied. You do not have permission to view this page.'});
  }
  next();
};