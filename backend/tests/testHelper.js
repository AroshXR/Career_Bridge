import request from 'supertest';
import app from '../app.js';

/**
 * Helper function to authenticate a test user.
 * It registers a new user and returns the JWT token and user info.
 * This is useful for testing routes protected by the 'auth' middleware.
 */
export const getAuthToken = async (userData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser@example.com',
  password: 'password123'
}) => {
  // First, register the user
  await request(app)
    .post('/api/auth/register')
    .send(userData);

  // Then, login to get the token
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: userData.email,
      password: userData.password
    });

  return {
    token: loginRes.body.data.token,
    user: loginRes.body.data.user
  };
};
