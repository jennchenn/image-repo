const express = require('express');
// const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const health = require('./routes/health/health.routes');
const app = express();

const uri =
  'mongodb+srv://admin:super@image-repo.idlxj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';


mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.log(`Error connecting to MongoDB: ${err}`);
  process.exit();
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: 'SECRET',
//   cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
//   store: new MongoStore({
//     url: uri,
//     autoReconnect: true,
//   })
// }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/health', health.health);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
