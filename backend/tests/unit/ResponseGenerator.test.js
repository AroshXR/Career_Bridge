import ResponseGenerator from '../../utils/ResponseGenerator.js';

/**
 * UNIT TEST SUITE: ResponseGenerator
 * 
 * What is Unit Testing here? 
 * We are testing the ResponseGenerator class in isolation. 
 * We verify that given specific inputs, it returns exactly the 
 * JSON structure our API contract requires.
 */
describe('ResponseGenerator Unit Tests', () => {

    /**
     * TEST CASE: sendSuccess
     * Check: Does it return status "00" and the correct data?
     */
    test('sendSuccess should return a strictly formatted success object', () => {
        const mockData = { id: 1, name: 'Test' };
        const result = ResponseGenerator.sendSuccess(mockData, 'Operation Successful');

        // Check the primary fields
        expect(result.status).toBe('00');
        expect(result.data).toEqual(mockData);
        expect(result.description).toBe('Operation Successful');
        
        // Check the nested error object (should be success code)
        expect(result.error.errorCode).toBe('0000');
        expect(result.error.errorDescription).toBe('Success.');
    });

    /**
     * TEST CASE: sendError
     * Check: Does it return status "01" and the custom error details?
     */
    test('sendError should return a strictly formatted error object', () => {
        const errorCode = "0401";
        const errorMsg = "Unauthorized Access";
        const result = ResponseGenerator.sendError(errorCode, errorMsg, 'AUTH_FAILURE');

        expect(result.status).toBe('01');
        expect(result.data).toBeNull();
        expect(result.description).toBe('AUTH_FAILURE');
        expect(result.error.errorCode).toBe(errorCode);
        expect(result.error.errorDescription).toBe(errorMsg);
    });

    /**
     * TEST CASE: Constants
     * Check: Are the HTTP status code constants correctly defined?
     */
    test('should have correct static constants for error codes', () => {
        expect(ResponseGenerator.SUCCESS).toBe("0000");
        expect(ResponseGenerator.BAD_REQUEST).toBe("0400");
        expect(ResponseGenerator.INTERNAL_SERVER_ERROR).toBe("0500");
    });
});
