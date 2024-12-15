import userRoutes from './userRoutes.js';
import attendeePostsRoutes from './attendeePostsRoutes.js';
import organizerPostsRoutes from './organizerPostsRoutes.js';
import routes from './routes.js';

const constructorMethod = (app) => {
  app.use('/', routes);
  app.use('*', (req, res) => {
    res.render('notfound', {tite: "Page Not Found!"});
  })
}

export default constructorMethod;
