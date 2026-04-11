import request from 'supertest';
import app from '../../app.js';
import { connectDB, disconnectDB, clearDB } from '../setup.js';
import { getAuthToken } from '../testHelper.js';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';

/**
 * MOCKING EMAIL UTILITY
 * Logic: Integration tests shouldn't send real emails. We mock the dependency 
 * defined in learning_resource_controller.js so that tests focus on logic and DB.
 */
jest.unstable_mockModule('../../utils/sendEmailsForCourseReminder.js', () => ({
  sendEmailsForReminder: jest.fn().mockResolvedValue(true)
}));

describe('Learning Resource Integration Tests', () => {
  let token;
  let user;
  let mockSkillId;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  // CRITICAL STEP FOR LEARNING:
  // Since 'clearDB' deletes everything (including users), we MUST 
  // get a fresh user/token in 'beforeEach' so subsequent tests don't fail.
  beforeEach(async () => {
    await clearDB();
    const auth = await getAuthToken();
    token = auth.token;
    user = auth.user;
    mockSkillId = new mongoose.Types.ObjectId(); // Ensure valid MongoDB format
  });

  describe('POST /api/v1/resources/save-resource', () => {
    /**
     * CHECK: Lifecycle - Can we save a course/video and schedule a reminder?
     * WHY: This is the core feature of the Learning Resource module.
     */
    it('should save a resource for an authenticated user', async () => {
      // 1. Setup the payload
      const testData = {
        userId: user._id, 
        skillId: mockSkillId,
        skillName: 'JavaScript Mastery',
        videoTitle: 'Learn JS in 1 Hour',
        videoUrl: 'https://youtube.com/js-test',
        userEmail: user.email,
        scheduledTime: new Date(Date.now() + 100000).toISOString(),
        notes: 'Study this tomorrow'
      };

      // 2. Perform request
      const res = await request(app)
        .post('/api/v1/resources/save-resource')
        .set('Authorization', `Bearer ${token}`)
        .send(testData);

      // 3. Verification
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.skillName).toBe('JavaScript Mastery');
      expect(res.body.data.userId).toBe(user._id.toString());
    });

    /**
     * CHECK: Validation - Does the API reject incomplete data?
     * WHY: Prevents corrupted or incomplete data from entering our database.
     */
    it('should fail if mandatory fields are missing', async () => {
      // Missing videoUrl and skillName
      const res = await request(app)
        .post('/api/v1/resources/save-resource')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: user._id }); 

      expect(res.statusCode).toEqual(400);
      expect(res.body.description).toBe('Save resource failed');
    });
  });

  describe('GET /api/v1/resources/get-by-id/:userId', () => {
    /**
     * CHECK: Retrieval - Can a user see their dashboard of saved courses?
     * WHY: Confirms that the userId filtering works correctly in the DB query.
     */
    it('should retrieve all saved resources for the current user', async () => {
      // 1. Create something to find
      await request(app)
        .post('/api/v1/resources/save-resource')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: user._id,
          skillId: mockSkillId,
          skillName: 'Test Suite Skill',
          videoTitle: 'The Saved Video',
          videoUrl: 'http://test.url',
          userEmail: user.email,
          scheduledTime: new Date().toISOString()
        });

      // 2. Fetch via the userId param
      const res = await request(app)
        .get(`/api/v1/resources/get-by-id/${user._id}`)
        .set('Authorization', `Bearer ${token}`);

      // 3. Verification
      expect(res.statusCode).toEqual(200);
      expect(res.body.data[0].videoTitle).toBe('The Saved Video');
    });
  });

  describe('DELETE /api/v1/resources/resource-delete/:id', () => {
    /**
     * CHECK: Cleanup - Can a user remove a resource they no longer need?
     * WHY: Ensures full CRUD (Create, Read, Update, Delete) capability.
     */
    it('should delete a saved resource by ID', async () => {
      // 1. Prepare target
      const saveRes = await request(app)
        .post('/api/v1/resources/save-resource')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: user._id,
          skillId: mockSkillId,
          skillName: 'To be deleted',
          videoTitle: 'Goodbye Video',
          videoUrl: 'http://delete.now',
          userEmail: user.email,
          scheduledTime: new Date().toISOString()
        });

      const resourceId = saveRes.body.data._id;

      // 2. Perform deletion
      const res = await request(app)
        .delete(`/api/v1/resources/resource-delete/${resourceId}`)
        .set('Authorization', `Bearer ${token}`);

      // 3. Verification
      expect(res.statusCode).toEqual(200);
      expect(res.body.description).toBe('Resource Successfully Deleted');
    });
  });
});
