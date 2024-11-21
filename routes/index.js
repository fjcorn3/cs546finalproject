import projectRoutes from './home.js';

const constructorMethod = (app) => {
  app.use('/', projectRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;