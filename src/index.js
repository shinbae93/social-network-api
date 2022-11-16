const express = require('express');
const cors = require('cors');
const Sentry = require('@sentry/node');
require('./models/database/mongoose');
const userRouter = require('./routers/web-user-manager');
const postRouter = require('./routers/web-post-manager');

const app = express();

/** Middle wares */
Sentry.init({ dsn: 'https://3438260379c547c0a958a7a3335bccd5@o4504166714834944.ingest.sentry.io/4504166720536576' }); // Init sentry
app.use(Sentry.Handlers.requestHandler()); // The request handler must be the first middleware on the app
app.use(cors());
app.use(express.json());

/** Routers */
app.use(userRouter);
app.use(postRouter);
app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

app.use(Sentry.Handlers.errorHandler()); // The sentry error handler must be before any other error middleware and after all controllers
// Add other error middleware bellow

/** Start server */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
