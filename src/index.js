const express = require('express');
const cors = require('cors');
require('./models/database/mongoose');
const userRouter = require('./routers/web-user-manager');
//
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
//
app.use(express.json());
//
app.use(userRouter);
//
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
