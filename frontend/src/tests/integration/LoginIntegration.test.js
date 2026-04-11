import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Login from '../../components/Login/Login';
import { mockLoginResponse } from '../mocks/apiMocks';

// Step 1: Mock the axios module
// We do this to prevent the test from making real network requests to the backend.
jest.mock('axios');

/**
 * LOGIN INTEGRATION TEST SUITE
 * 
 * Purpose: To verify the interaction between the Login form, its validation logic,
 * and the API handling. We want to ensure that a successful login correctly 
 * handles the token and navigates the user.
 */
describe('Login Integration Tests', () => {
    
    // Cleanup: Ensure storage is clean before each test
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    /**
     * TEST CASE: Successful Login
     * Check: Does the system store the token and navigate on success?
     * logic: Mock a 200 OK response from axios and click 'Login'.
     */
    test('should log in successfully and store the token', async () => {
        // Mocking the API response
        axios.post.mockResolvedValue({ data: mockLoginResponse });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        // Simulate user entering credentials
        fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
            target: { value: 'test@example.com' }
        });
        fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
            target: { value: 'password123' }
        });

        // Click the login button
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            // Verify axios was called with the correct URL
            expect(axios.post).toHaveBeenCalledWith(
                'http://localhost:5000/api/auth/login',
                expect.objectContaining({ email: 'test@example.com' })
            );
            
            // Verify the token is stored in localStorage
            expect(localStorage.getItem('token')).toBe('mock-jwt-token');
        });
    });

    /**
     * TEST CASE: Failed Login
     * Check: Does the UI display the correct error message on failure?
     * logic: Mock a 401 Unauthorized response and check for error text.
     */
    test('should display an error message on failed login', async () => {
        // Mocking a failure response
        axios.post.mockRejectedValue({
            response: {
                data: {
                    error: { errorDescription: 'Invalid credentials' }
                }
            }
        });

        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        // Wait for the error message to appear in the UI
        const errorMessage = await screen.findByText(/invalid credentials/i);
        expect(errorMessage).toBeInTheDocument();
    });
});
