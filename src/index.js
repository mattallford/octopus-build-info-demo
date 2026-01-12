const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const appVersion = process.env.APP_VERSION || '1.0.0';

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Octopus Deploy Build Info Demo!',
    version: appVersion,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: appVersion });
});

app.listen(port, () => {
  console.log(`==========================================`);
  console.log(`Octopus Deploy Build Info Demo`);
  console.log(`Version: ${appVersion}`);
  console.log(`Server running on port ${port}`);
  console.log(`==========================================`);
});
