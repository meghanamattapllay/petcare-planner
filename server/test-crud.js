process.env.NODE_ENV = 'test';
const http = require('http');
const app = require('./src/server');

const testPort = 5006;
const server = app.listen(testPort, '127.0.0.1', async () => {
  console.log(`\n=== [CRUD Test Suite] Testing Pet & CareRecord Endpoints on port ${testPort} ===\n`);

  const request = (method, path, body = null, headers = {}) => {
    return new Promise((resolve, reject) => {
      const payload = body ? JSON.stringify(body) : null;
      const options = {
        hostname: '127.0.0.1',
        port: testPort,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...headers,
        },
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ statusCode: res.statusCode, raw: data });
          }
        });
      });

      req.on('error', reject);
      if (payload) req.write(payload);
      req.end();
    });
  };

  try {
    let createdPetId = null;
    let createdRecordId = null;

    // 1. Validation Test: Pet creation missing required fields
    console.log('1. Testing POST /api/pets validation (missing fields)...');
    const invalidPet = await request('POST', '/api/pets', { breed: 'Beagle' });
    console.log(`   -> Status: ${invalidPet.statusCode} (Expected: 400), Message: "${invalidPet.data?.message}"`);
    if (invalidPet.statusCode !== 400) throw new Error('Failed pet validation test');

    // 2. Create Pet
    console.log('\n2. Testing POST /api/pets (create pet)...');
    const newPetRes = await request('POST', '/api/pets', {
      name: 'Barnaby',
      species: 'Dog',
      breed: 'Beagle',
      age: 4,
      gender: 'Male',
      weight: 12.5,
      allergies: ['Pollen'],
      photoUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400',
    });
    console.log(`   -> Status: ${newPetRes.statusCode} (Expected: 201)`);
    console.log(`   -> Created Pet Name: ${newPetRes.data?.data?.name}, ID: ${newPetRes.data?.data?._id}`);
    if (newPetRes.statusCode !== 201) throw new Error('Failed pet creation');
    createdPetId = newPetRes.data?.data?._id;

    // 3. Get All Pets
    console.log('\n3. Testing GET /api/pets (list pets)...');
    const petsRes = await request('GET', '/api/pets');
    console.log(`   -> Status: ${petsRes.statusCode}, Pet Count: ${petsRes.data?.count}`);
    if (petsRes.statusCode !== 200 || !Array.isArray(petsRes.data?.data)) throw new Error('Failed to get pets');

    // 4. Get Pet By ID
    console.log(`\n4. Testing GET /api/pets/${createdPetId}...`);
    const singlePetRes = await request('GET', `/api/pets/${createdPetId}`);
    console.log(`   -> Status: ${singlePetRes.statusCode}, Name: ${singlePetRes.data?.data?.name}`);
    if (singlePetRes.statusCode !== 200) throw new Error('Failed to get pet by id');

    // 5. Update Pet
    console.log(`\n5. Testing PUT /api/pets/${createdPetId} (update pet weight & age)...`);
    const updatePetRes = await request('PUT', `/api/pets/${createdPetId}`, {
      weight: 13.2,
      age: 5,
    });
    console.log(`   -> Status: ${updatePetRes.statusCode}, New Weight: ${updatePetRes.data?.data?.weight}, New Age: ${updatePetRes.data?.data?.age}`);
    if (updatePetRes.statusCode !== 200) throw new Error('Failed to update pet');

    // 6. Validation Test: CareRecord creation missing fields
    console.log('\n6. Testing POST /api/records validation (missing fields)...');
    const invalidRec = await request('POST', '/api/records', { title: 'Vaccine' });
    console.log(`   -> Status: ${invalidRec.statusCode} (Expected: 400), Message: "${invalidRec.data?.message}"`);
    if (invalidRec.statusCode !== 400) throw new Error('Failed record validation test');

    // 7. Create CareRecord
    console.log('\n7. Testing POST /api/records (create care record)...');
    const newRecordRes = await request('POST', '/api/records', {
      pet: createdPetId,
      careType: 'Vaccination',
      title: 'DHPP Booster',
      dateAdministered: new Date().toISOString(),
      nextDueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Upcoming',
      notes: 'Subcutaneous injection, right shoulder.',
      cost: 55,
      veterinarian: 'Dr. Emily Watson',
    });
    console.log(`   -> Status: ${newRecordRes.statusCode} (Expected: 201)`);
    console.log(`   -> Created Record: "${newRecordRes.data?.data?.title}", ID: ${newRecordRes.data?.data?._id}`);
    if (newRecordRes.statusCode !== 201) throw new Error('Failed record creation');
    createdRecordId = newRecordRes.data?.data?._id;

    // 8. List CareRecords with Filters
    console.log(`\n8. Testing GET /api/records with filters (?petId=${createdPetId}&careType=Vaccination)...`);
    const filteredRecs = await request('GET', `/api/records?petId=${createdPetId}&careType=Vaccination`);
    console.log(`   -> Status: ${filteredRecs.statusCode}, Matching Count: ${filteredRecs.data?.count}`);
    console.log(`   -> Populated Pet Info: name="${filteredRecs.data?.data?.[0]?.pet?.name}", species="${filteredRecs.data?.data?.[0]?.pet?.species}"`);
    if (filteredRecs.statusCode !== 200 || filteredRecs.data?.count < 1) throw new Error('Failed filtered records query');

    // 9. Get Single CareRecord By ID
    console.log(`\n9. Testing GET /api/records/${createdRecordId}...`);
    const singleRecRes = await request('GET', `/api/records/${createdRecordId}`);
    console.log(`   -> Status: ${singleRecRes.statusCode}, Title: "${singleRecRes.data?.data?.title}"`);
    if (singleRecRes.statusCode !== 200) throw new Error('Failed to get record by id');

    // 10. Update CareRecord
    console.log(`\n10. Testing PUT /api/records/${createdRecordId} (mark completed)...`);
    const updateRecRes = await request('PUT', `/api/records/${createdRecordId}`, {
      status: 'Completed',
      notes: 'Completed with no side effects.',
    });
    console.log(`   -> Status: ${updateRecRes.statusCode}, Status: ${updateRecRes.data?.data?.status}`);
    if (updateRecRes.statusCode !== 200) throw new Error('Failed to update record');

    // 11. Delete CareRecord
    console.log(`\n11. Testing DELETE /api/records/${createdRecordId}...`);
    const deleteRecRes = await request('DELETE', `/api/records/${createdRecordId}`);
    console.log(`   -> Status: ${deleteRecRes.statusCode}, Deleted ID: ${deleteRecRes.data?.deletedId}`);
    if (deleteRecRes.statusCode !== 200) throw new Error('Failed to delete record');

    // 12. Delete Pet
    console.log(`\n12. Testing DELETE /api/pets/${createdPetId}...`);
    const deletePetRes = await request('DELETE', `/api/pets/${createdPetId}`);
    console.log(`   -> Status: ${deletePetRes.statusCode}, Deleted ID: ${deletePetRes.data?.deletedId}`);
    if (deletePetRes.statusCode !== 200) throw new Error('Failed to delete pet');

    // 13. Verify Pet 404 after deletion
    console.log(`\n13. Testing GET /api/pets/${createdPetId} after deletion...`);
    const notFoundPet = await request('GET', `/api/pets/${createdPetId}`);
    console.log(`   -> Status: ${notFoundPet.statusCode} (Expected: 404)`);
    if (notFoundPet.statusCode !== 404) throw new Error('Pet should be 404 after deletion');

    console.log('\n======================================================');
    console.log('🎉 ALL CRUD AND VALIDATION TESTS PASSED PERFECTLY!');
    console.log('======================================================\n');

    server.close(() => process.exit(0));
  } catch (err) {
    console.error('\n❌ TEST RUN FAILED:', err);
    server.close(() => process.exit(1));
  }
});

