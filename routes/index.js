import routes from './routes.js';
import eventRoutes from './eventRoutes.js';

const constructorMethod = (app) => {
  app.use('/events', eventRoutes);
  app.use('/', routes);
  app.use('*', (req, res) => {
    res.render('notfound', {tite: "Page Not Found!"});
  })
}

export default constructorMethod;
