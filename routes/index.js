import routes from './routes.js';
import eventRoutes from './eventRoutes.js';
import profileRoutes from './profileRoutes.js';
import apiRoutes from './apiRoutes.js';

const constructorMethod = (app) => {
  app.use('/events', eventRoutes);
  app.use('/profile', profileRoutes);
  app.use('/api', apiRoutes);
  app.use('/', routes);
  app.use('*', (req, res) => {
    res.render('notfound', {tite: "Page Not Found!"});
  })
}

export default constructorMethod;
