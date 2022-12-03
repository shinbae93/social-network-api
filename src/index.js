const express = require('express');
const cors = require('cors');
var morgan = require('morgan');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
require('./models/database/mongoose');
const userRouter = require('./routers/web-user-manager');
const postRouter = require('./routers/web-post-manager');
const commentRouter = require('./routers/web-comment-manager');
const shareRouter = require('./routers/web-share-manager');
const likeRouter = require('./routers/web-like-manager');

const app = express();

/** Init Sentry */
Sentry.init({
  dsn: 'https://c5418ad18c5d49609341b0d3ed6fa80f@o4504265655779328.ingest.sentry.io/4504265744121856',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],
  tracesSampleRate: 1.0
});

/** Middle wares */
app.use(Sentry.Handlers.requestHandler()); // The request handler must be the first middleware on the app
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

/** Routers */
app.use(userRouter);
app.use(postRouter);
app.use(commentRouter);
app.use(shareRouter);
app.use(likeRouter);
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
