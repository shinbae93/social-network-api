const mongoose = require('mongoose');

const CONNECTION_URL = 'mongodb://tcp-mo4.mogenius.io:60390';
mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  user: "root",
  pass: "123456",
  dbName: "social-network-test"
});