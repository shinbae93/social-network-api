const mongoose = require('mongoose');

// const CONNECTION_URL = 'mongodb://localhost:27017/social-network';
const CONNECTION_URL = 'mongodb://172.17.0.2:27017/social-network';
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true
});
