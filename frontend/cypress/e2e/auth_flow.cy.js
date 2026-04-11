/**
 * AUTH FLOW E2E INTEGRATION TEST
 * 
 * Purpose: Verify the end-to-end journey from Splash -> Login -> Home Dashboard.
 * Logic: We use precise IDs and classes from the React components to ensure stability.
 */
describe('User Authentication Journey', () => {
    
    beforeEach(() => {
        // Mock the login API
        cy.intercept('POST', '**/api/auth/login', {
            statusCode: 200,
            body: {
                status: "00",
                data: {
                    token: "mock-token",
                    user: { name: "John Doe", email: "john@example.com", role: "user" }
                }
            }
        }).as('loginRequest');

        // Mock the jobs API (uses the fixture we just created)
        cy.intercept('GET', '**/api/v1/trendingJobAnalyzer/**', {
            fixture: 'trending_jobs.json'
        }).as('getJobs');
    });

    it('should navigate from Splash to Login and then to Home on success', () => {
        // 1. Visit the Splash Page
        cy.visit('/');
        cy.contains('Career Bridge').should('be.visible');

        // 2. Click the Login button in the header (sticky bar)
        // We use the header button because the Hero button might be covered by the sticky header itself.
        cy.get('.login-btn_splash').click();

        // 3. Verify we reached the Login page
        cy.url().should('include', '/login');
        cy.get('.login-heading_log').should('contain', 'Welcome');

        // 4. Fill in credentials (using specific IDs like #email_log)
        cy.get('#email_log').type('john@example.com');
        cy.get('#password_log').type('password123');

        // 5. Submit the form (using specific button ID)
        cy.get('#submit-login_log').click();

        // 6. Verify redirection to Home
        cy.wait('@loginRequest');
        cy.url().should('include', '/home');
        
        // 7. Check for Home Dashboard content
        cy.contains('Your Career Dashboard').should('be.visible');
        cy.contains('Welcome Back').should('be.visible');
        
        // 8. Optional: Verify that a feature card is present
        cy.get('#home-card-job-analyzer').should('be.visible');
    });
});
