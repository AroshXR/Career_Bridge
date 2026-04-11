import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import jwt from 'jsonwebtoken';
import authMiddleware from '../../middleware/auth.js';
import ResponseGenerator from '../../utils/ResponseGenerator.js';

/**
 * UNIT TEST SUITE: Auth Middleware
 * 
 * What is being tested?
 * We are testing the "Gatekeeper" of our API. We want to ensure that it 
 * correctly allows valid users through and blocks anyone else.
 */
describe('Auth Middleware Unit Tests', () => {
    let mockReq;
    let mockRes;
    let nextFunction;
    let spyVerify;

    // Reset mocks before each test to ensure a clean slate
    beforeEach(() => {
        mockReq = {
            header: jest.fn()
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        nextFunction = jest.fn();
        
        // Use spyOn instead of jest.mock for better ESM/CJS compatibility
        spyVerify = jest.spyOn(jwt, 'verify');
        
        jest.clearAllMocks();
    });

    // Cleanup spies after each test
    afterEach(() => {
        spyVerify.mockRestore();
    });

    /**
     * TEST CASE: Missing Token
     * Logic: If no Authorization header is provided, return 401.
     */
    test('should return 401 if no token is provided', () => {
        mockReq.header.mockReturnValue(null); // No token in header

        authMiddleware(mockReq, mockRes, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ description: 'AUTH_ERROR' })
        );
        expect(nextFunction).not.toHaveBeenCalled();
    });

    /**
     * TEST CASE: Valid Token
     * Logic: If token is valid, verify it and call next().
     */
    test('should call next() and inject user if token is valid', () => {
        const mockUser = { id: '001', role: 'user' };
        mockReq.header.mockReturnValue('Bearer valid-token');
        
        // Mock jwt.verify to return our mock user
        spyVerify.mockReturnValue(mockUser);

        authMiddleware(mockReq, mockRes, nextFunction);

        expect(spyVerify).toHaveBeenCalled();
        expect(mockReq.user).toEqual(mockUser);
        expect(nextFunction).toHaveBeenCalled();
    });

    /**
     * TEST CASE: Expired Token
     * Logic: Catch 'TokenExpiredError' and return a specific message.
     */
    test('should return 401 with specific message if token is expired', () => {
        mockReq.header.mockReturnValue('Bearer expired-token');
        
        // Simulate a TokenExpiredError from JWT
        const error = new Error('Expired');
        error.name = 'TokenExpiredError';
        spyVerify.mockImplementation(() => { throw error; });

        authMiddleware(mockReq, mockRes, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({ description: 'TOKEN_EXPIRED' })
        );
    });
});
