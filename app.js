import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';
import { logRequest } from './middleware.js';
import {dbConnection, closeConnection} from './config/mongoConnection.js';

const db = await dbConnection();
await db.dropDatabase();

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    if (req.body && req.body._method) {
      req.method = req.body._method;
      delete req.body._method;
    }
  
    next();
  };
  
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.use(
  session({
    name: 'AuthenticationState',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(logRequest);

configRoutes(app);

app.listen(3000, () => {
  console.log('Server is up on http://localhost:3000');
});
