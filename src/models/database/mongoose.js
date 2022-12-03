const mongoose = require('mongoose');

// const CONNECTION_URL = 'mongodb://localhost:27017/social-network';
const CONNECTION_URL = 'mongodb://tcp-mo4.mogenius.io:37532';
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  user: "root",
  pass: "123456",
  dbName: "social-network"
});
