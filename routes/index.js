import projectRoutes from './home.js';
import apiRouter from './api/index.js'

const constructorMethod = (app) => {
  app.use('/api', apiRouter);
  app.use('/', projectRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;