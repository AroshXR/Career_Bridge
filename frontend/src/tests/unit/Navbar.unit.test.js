import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/Common/Navbar';

/**
 * UNIT TEST SUITE: Navbar Component
 * 
 * What we are testing?
 * We are testing the conditional rendering of the Navbar based on 
 * the presence of a "token" in localStorage.
 */
describe('Navbar Unit Tests', () => {
    
    // Clear localStorage before each test
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    /**
     * TEST CASE: Guest State
     * Check: If not logged in, show "Login" and "Register" buttons?
     */
    test('should show Login and Register buttons when NOT authenticated', () => {
        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        expect(screen.getByText(/Login/i)).toBeInTheDocument();
        expect(screen.getByText(/Register/i)).toBeInTheDocument();
        expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
    });

    /**
     * TEST CASE: Authenticated State
     * Check: If token exists, show "Welcome, Name" and "Logout" button?
     */
    test('should show Logout and Welcome message when authenticated', () => {
        // Mock the authentication state
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify({ name: 'Dasun' }));

        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        expect(screen.getByText(/Welcome, Dasun/i)).toBeInTheDocument();
        expect(screen.getByText(/Logout/i)).toBeInTheDocument();
        expect(screen.queryByText(/Register/i)).not.toBeInTheDocument();
    });

    /**
     * TEST CASE: Logout Action
     * Check: Does clicking Logout clear storage?
     */
    test('should clear localStorage and navigate when Logout is clicked', () => {
        localStorage.setItem('token', 'mock-token');

        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        const logoutBtn = screen.getByText(/Logout/i);
        fireEvent.click(logoutBtn);

        // Check if storage was cleared
        expect(localStorage.getItem('token')).toBeNull();
    });
});
