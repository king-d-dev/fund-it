const http = require('http');
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');

if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

mongoose.connection
  .once('open', () => console.log('SUCCESS: Database Connection'))
  .on('error', () => console.log('ERROR: Database Connection'));

const app = express();

app.use(cors());
app.use(fileUpload());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static('public'));

require('./models');
require('./passport-config');
require('./routes')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3005;
http
  .createServer(app)
  .listen(PORT)
  .on('listening', () => console.log(`Server running on PORT ${PORT}`));
