const { app } = require('./app');
const { env } = require('./config/env');
const { healthCheck } = require('./db/pool');

async function start() {
  try {
    const ok = await healthCheck();
    if (!ok) {
      throw new Error('Database health check failed');
    }

    app.listen(env.port, () => {
      console.log(`API listening on port ${env.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
