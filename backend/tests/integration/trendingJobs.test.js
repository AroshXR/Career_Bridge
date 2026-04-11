import request from 'supertest';
import app from '../../app.js';
import { connectDB, disconnectDB, clearDB } from '../setup.js';
import { getAuthToken } from '../testHelper.js';

/**
 * TRENDING JOB ANALYZER INTEGRATION TESTS
 * 
 * Goal: Verify that the Job Analyzer routes correctly handle database storage,
 * retrieval, updates, and deletions while respecting user authentication.
 * 
 * Note for learning: We use 'beforeEach' to get a fresh token because the database
 * is cleared after every test to ensure isolation.
 */
describe('Trending Job Analyzer Integration Tests', () => {
  let token;
  let user;

  // Setup: Connect to in-memory DB before any tests run
  beforeAll(async () => {
    await connectDB();
  });

  // Teardown: Close DB connection after all tests finish
  afterAll(async () => {
    await disconnectDB();
  });

  // Cleanup: Clear all data and re-authenticate before each individual test
  // This ensures that Test A cannot affect the database state for Test B.
  beforeEach(async () => {
    await clearDB();
    const auth = await getAuthToken(); // Get a fresh user & token for every test
    token = auth.token;
    user = auth.user;
  });

  describe('POST /api/v1/trendingJobAnalyzer/saveJob', () => {
    /**
     * CHECK: Can an authenticated user save a job to their profile?
     * logic: Send a job payload with the Bearer token.
     * EXPECTED: Job saved successfully with the user's email as the identifier.
     */
    it('should allow an authenticated user to save a job', async () => {
      const res = await request(app)
        .post('/api/v1/trendingJobAnalyzer/saveJob')
        .set('Authorization', `Bearer ${token}`)
        .send({
          jobId: 'JOB123',
          title: 'Software Engineer',
          description: 'A great role',
          company: 'Tech Corp',
          location: 'Remote'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.savedJob.jobId).toBe('JOB123');
      expect(res.body.data.savedJob.username).toBe(user.email);
    });

    /**
     * CHECK: Security - Does the API block requests without a token?
     * EXPECTED: 401 Unauthorized status.
     */
    it('should block unauthenticated users from saving a job', async () => {
      const res = await request(app)
        .post('/api/v1/trendingJobAnalyzer/saveJob')
        .send({ jobId: 'JOB123' });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe('GET /api/v1/trendingJobAnalyzer/getSavedJobs', () => {
    /**
     * CHECK: Data retrieval - Can we list jobs specifically for the logged-in user?
     * EXPECTED: Returns the list of jobs previously saved by this account.
     */
    it('should retrieve saved jobs for the authenticated user', async () => {
      // 1. Save a job first
      await request(app)
        .post('/api/v1/trendingJobAnalyzer/saveJob')
        .set('Authorization', `Bearer ${token}`)
        .send({ jobId: 'JOB1', title: 'Job 1', username: user.email });

      // 2. Fetch the list
      const res = await request(app)
        .get('/api/v1/trendingJobAnalyzer/getSavedJobs')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.jobs).toHaveLength(1);
      expect(res.body.data.jobs[0].jobId).toBe('JOB1');
    });
  });

  describe('PUT /api/v1/trendingJobAnalyzer/updateSavedJob/:id', () => {
    /**
     * CHECK: Modification - Can a user add or change notes on their saved jobs?
     * EXPECTED: The database updates only the 'notes' field for the correct record.
     */
    it('should update the notes of a saved job', async () => {
      // 1. Create a job to update
      const saveRes = await request(app)
        .post('/api/v1/trendingJobAnalyzer/saveJob')
        .set('Authorization', `Bearer ${token}`)
        .send({ jobId: 'JOB1', title: 'Job 1' });

      const jobIdInDB = saveRes.body.data.savedJob._id;

      // 2. Update it
      const res = await request(app)
        .put(`/api/v1/trendingJobAnalyzer/updateSavedJob/${jobIdInDB}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ notes: 'Updated note content' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.updatedJob.notes).toBe('Updated note content');
    });
  });

  describe('DELETE /api/v1/trendingJobAnalyzer/deleteSavedJob/:id', () => {
    /**
     * CHECK: Deletion - Does the job get removed upon request?
     * logic: We check res.body.data.message because that's where the controller stores the success string.
     */
    it('should delete a saved job successfully', async () => {
        // 1. Setup target
        const saveRes = await request(app)
          .post('/api/v1/trendingJobAnalyzer/saveJob')
          .set('Authorization', `Bearer ${token}`)
          .send({ jobId: 'JOB1', title: 'Job 1' });
  
        const jobIdInDB = saveRes.body.data.savedJob._id;
  
        // 2. Execute deletion
        const res = await request(app)
          .delete(`/api/v1/trendingJobAnalyzer/deleteSavedJob/${jobIdInDB}`)
          .set('Authorization', `Bearer ${token}`);
  
        // 3. Verification
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.message).toBe('Job deleted successfully');
    });
  });
});
