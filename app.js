import express from 'express';
import session from 'express-session';
import path from 'path';
import * as middleware from './middleware.js'; // Ensure middleware is properly imported
import { organizerPosts, attendeePosts } from './config/mongoCollections.js';
import exphbs from 'express-handlebars';
import constructorMethod from './routes/index.js';

const app = express();
const __dirname = path.resolve();

app.use('/public', express.static(path.join(__dirname, 'public')));
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

// Custom Middleware
app.use(middleware.logRequest);
app.use('/signout', middleware.unauthenticatedRedirect);
app.use('/events', middleware.unauthenticatedRedirect);
app.use('/signin', middleware.authenticatedRedirect);
app.use('/signup', middleware.authenticatedRedirect);

app.get('/', async (req, res) => {
  res.redirect('/home');
});

// app.get('/api/posts', async (req, res) => {
//   const organizerPostCollection = await organizerPosts();

//   try {
//       const postsList = await organizerPostCollection.find({}).toArray(); 
//       res.json(postsList);
//   } catch (e) {
//       //send error
//   }
// });

// app.get('/api/attendeePosts', async (req, res) => {
//   const attendeePostsCollection = await attendeePosts();

//   try {
//       const postsList = await attendeePostsCollection.find({}).toArray(); 
//       res.json(postsList);
//   } catch (e) {
//       //send error
//   }
// });

// app.get('/api/session-data', (req, res) => {
//   if (!req.session.user) {
//     console.log("not picking");
//     //send error
//   }
//   console.log("heree");
//   res.json(req.session.user);
//   console.log(req.session.user);
// });



// app.use('/static', express.static(path.join(__dirname, 'static')));


const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    }
  },
  partialsDir: ['views/partials/']
});

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

constructorMethod(app);

app.listen(3000, () => {
  console.log('Server is up on http://localhost:3000');
});