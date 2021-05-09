const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const upload = require('./helpers/imageUpload');

dotenv.config({ path: '.env' });

const health = require('./routes/health/health.routes');
const image = require('./routes/image/image.routes');
const user = require('./routes/user/user.routes');

const authentication = require('./middleware/authentication');

const app = express();

mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.log(`Error connecting to MongoDB: ${err}`);
  process.exit();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/health', health.health);
app.post('/image', [authentication, upload.array('images')], image.upload);
app.get('/image', authentication, image.searchByName);
app.get('/image/user', authentication, image.retrieveAllByUser);
app.post('/user/register', user.register);
app.post('/user/login', user.login);

module.exports = app;
