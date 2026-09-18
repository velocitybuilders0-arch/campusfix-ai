const express = require('express');
const cors = require('cors');

const env = require('./config/env');
const healthRoutes = require('./routes/health.routes');
const aiRoutes = require('./routes/ai.routes');
const issuesRoutes = require('./routes/issues.routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health (public)
app.use('/api/health', healthRoutes);

// AI (auth required inside route file)
app.use('/api/ai', aiRoutes);

// Issues (auth required inside route file)
app.use('/api/issues', issuesRoutes);

app.use(notFound);
app.use(errorHandler);

// Only start listening when run directly.
// Tests import `app` and use supertest, which binds its own ephemeral port.
if (require.main === module) {
  app.listen(env.PORT, () => {
    console.log(`CampusFix API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

module.exports = app;
