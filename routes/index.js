import routes from './routes.js';

const constructorMethod = (app) => {
  app.use('/', routes);
  app.use('*', (req, res) => {
    res.render('notfound', {tite: "Page Not Found!"});
  })
}

export default constructorMethod;
