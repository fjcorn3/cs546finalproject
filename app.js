import express from 'express';
import session from 'express-session';
import path from 'path';
import routes from './routes/index.js';  // Ensure this points to the correct route file
import { logRequest } from './middleware.js'; // Ensure middleware is properly imported

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: 'AuthCookie',
    secret: 'superSecretKey',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(logRequest);

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'static/404.html'));
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});