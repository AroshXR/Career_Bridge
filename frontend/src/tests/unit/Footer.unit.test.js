import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../components/Common/Footer';

/**
 * UNIT TEST SUITE: Footer Component
 * 
 * What is Unit Testing here?
 * We are testing the Footer component in isolation. We don't care about 
 * other pages or the backend. We only check if the UI elements (links, 
 * brand names) that we defined in Footer.js are rendered correctly.
 */
describe('Footer Unit Tests', () => {
    
    /**
     * TEST CASE: Brand Rendering
     * Check: Does the footer show the correct app name?
     */
    test('should render the brand name Career Bridge', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );
        
        // Assert that the brand text is present (using getAllByText because it appears in logo and bottom-brand)
        const brandElements = screen.getAllByText(/Career/i);
        const bridgeElements = screen.getAllByText(/Bridge/i);
        
        expect(brandElements.length).toBeGreaterThan(0);
        expect(bridgeElements.length).toBeGreaterThan(0);
    });

    /**
     * TEST CASE: Section Headers
     * Check: Do "Platform" and "Support" headers exist?
     */
    test('should render section headers like Platform and Support', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );

        expect(screen.getAllByText(/Platform/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Support/i).length).toBeGreaterThan(0);
    });

    /**
     * TEST CASE: Social Links
     * Check: Are Social Media links present with correct Aria Labels?
     */
    test('should have social media links with correct aria-labels', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );

        // Check for aria-labels which are important for accessibility (A11y)
        expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
        expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
        expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
    });
});
