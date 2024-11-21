import projectRoutes from './home.js';
import dataRoutes from './api/index.js'

const constructorMethod = (app) => {
  app.use('/', projectRoutes);
  app.use('/api', dataRoutes);
  app.use('*', (req, res) => {
    res.status(404).json({error: 'Route Not found'});
  });
};

export default constructorMethod;