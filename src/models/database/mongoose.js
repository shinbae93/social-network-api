const mongoose = require('mongoose');

const CONNECTION_URL = 'mongodb://localhost:27017/social-network';
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true
});
