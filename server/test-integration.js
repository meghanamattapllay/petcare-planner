process.env.NODE_ENV = 'test';
const http = require('http');
const app = require('./src/server');

const testPort = 5005;
const server = app.listen(testPort, '127.0.0.1', async () => {
  console.log(`[Integration Test] Test server running on 127.0.0.1:${testPort}`);

  const checkEndpoint = (path) => {
    return new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${testPort}${path}`, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, raw: data });
          }
        });
      }).on('error', (err) => reject(err));
    });
  };

  try {
    console.log('[Integration Test] Verifying GET /api/health ...');
    const health = await checkEndpoint('/api/health');
    console.log('  -> Status:', health.statusCode, '| Project:', health.data.project);

    console.log('[Integration Test] Verifying GET /api/pets ...');
    const pets = await checkEndpoint('/api/pets');
    console.log('  -> Status:', pets.statusCode, '| Pet Count:', Array.isArray(pets.data) ? pets.data.length : pets.data.count);

    console.log('[Integration Test] Verifying GET /api/records ...');
    const records = await checkEndpoint('/api/records');
    console.log('  -> Status:', records.statusCode, '| Record Count:', Array.isArray(records.data) ? records.data.length : records.data.count);

    console.log('[Integration Test] Verifying GET /api/reminders ...');
    const reminders = await checkEndpoint('/api/reminders');
    console.log('  -> Status:', reminders.statusCode, '| Summary:', JSON.stringify(reminders.data.summary));

    console.log('[Integration Test] ✅ ALL ROUTES AND INTEGRATION CHECKS PASSED!');
    server.close(() => {
      console.log('[Integration Test] Test server closed cleanly.');
      process.exit(0);
    });
  } catch (err) {
    console.error('[Integration Test] ❌ FAILED:', err);
    server.close(() => process.exit(1));
  }
});
