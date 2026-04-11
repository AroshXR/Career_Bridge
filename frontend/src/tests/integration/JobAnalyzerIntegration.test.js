import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import TrendingJobAnalyzer from '../../components/TrendingJobAnalyzer/TrendingJobAnalyzer';
import { mockTrendingJobs } from '../mocks/apiMocks';

// Step 1: Mock axios and window.alert
// We mock 'alert' because the component uses it for success notifications,
// and we want to verify that it is called.
jest.mock('axios');
window.alert = jest.fn();

/**
 * JOB ANALYZER INTEGRATION TEST SUITE
 * 
 * Purpose: To verify that the TrendingJobAnalyzer page correctly handles complex state,
 * dynamic data fetching from the backend, and user interactions like saving roles.
 */
describe('Trending Job Analyzer Integration Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.setItem('token', 'mock-token');
    });

    /**
     * TEST CASE: Load and Display Data
     * Check: Does the component fetch and render job cards on mount?
     * logic: Mock a success response for the 'Information Technology' category.
     */
    test('should fetch and display trending roles on mount', async () => {
        axios.get.mockResolvedValue({ data: mockTrendingJobs });

        render(
            <BrowserRouter>
                <TrendingJobAnalyzer />
            </BrowserRouter>
        );

        // Verify that the loading state appears first
        expect(screen.getByText(/aggregating global market signals/i)).toBeInTheDocument();

        // Wait for the data to be rendered
        await waitFor(() => {
            expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
            expect(screen.getByText('Cloud Architect')).toBeInTheDocument();
        });
    });

    /**
     * TEST CASE: Category Selection
     * Check: Does changing the industry filter trigger a new API call?
     * logic: Change the select value and verify axios.get was called again.
     */
    test('should fetch new data when category is changed', async () => {
        axios.get.mockResolvedValue({ data: mockTrendingJobs });

        render(
            <BrowserRouter>
                <TrendingJobAnalyzer />
            </BrowserRouter>
        );

        // Change category to 'Cybersecurity'
        const select = screen.getByLabelText(/select industry/i);
        fireEvent.change(select, { target: { value: 'Cybersecurity' } });

        await waitFor(() => {
            // Check that axios was called with the new category
            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining('category=Cybersecurity'),
                expect.any(Object)
            );
        });
    });

    /**
     * TEST CASE: Save Job
     * Check: Can the user save a job role to their profile?
     * logic: Click 'Save' on a job card and verify the POST request.
     */
    test('should call the save API when the save button is clicked', async () => {
        axios.get.mockResolvedValue({ data: mockTrendingJobs });
        axios.post.mockResolvedValue({ data: { status: "00", message: "Success" } });

        render(
            <BrowserRouter>
                <TrendingJobAnalyzer />
            </BrowserRouter>
        );

        // Wait for roles to load
        const saveButton = await screen.findAllByRole('button', { name: /save/i });
        
        // Click save on the first card
        fireEvent.click(saveButton[0]);

        await waitFor(() => {
            // Verify the POST request was made
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('saveJob'),
                expect.objectContaining({ title: 'Full Stack Developer' }),
                expect.any(Object)
            );
            // Verify the user received a notification
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('saved to your career interests'));
        });
    });
});
