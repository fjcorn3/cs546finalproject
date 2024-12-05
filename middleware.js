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
        return req.session.user.role === 'admin' ? res.redirect('/administrator') : res.redirect('/user');
      } else {
        return res.redirect('/signinuser');
      }
    }
    next();
};

const signinRedirect = (req, res, next) => {
    if (req.session.user) {
      return req.session.user.role === 'admin' ? res.redirect('/administrator') : res.redirect('/user');
    }
    next();
};

const signupRedirect = (req, res, next) => {
    if (req.session.user) {
      return req.session.user.role === 'admin' ? res.redirect('/administrator') : res.redirect('/user');
    }
    next();
};

const authenticateUser = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/signinuser');
    }
    next();
};

const authenticateAdmin = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/signinuser');
    }
    if (req.session.user.role !== 'admin') {
      return res.status(403).render('error', {
        errorMessage: 'Access Denied. You do not have permission to view this page.',
        title: 'Error',
        userPageLink: '/user',
      });
    }
    next();
};

const allowSignOut = (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/signinuser');
    }
    next();
};
  
export { logRequest, signinRedirect, signupRedirect, authenticateUser, authenticateAdmin, allowSignOut };
