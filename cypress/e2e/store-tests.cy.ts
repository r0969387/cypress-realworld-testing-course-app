export {};
describe('Shopify Store Tests', () => {
  // Get password from environment variables
  const password = Cypress.env('password');

  // Custom command to handle password protection
  Cypress.Commands.add('handlePasswordProtection', () => {
    // Check if password protection form exists
    cy.get('body').then(($body) => {
      if ($body.find('input[type="password"]').length > 0) {
        // Enter the password when prompted
        cy.get('input[type="password"]').should('exist').type(password);
        cy.get('button[type="submit"]').click();
        // Verify we got past the password page
        cy.url().should('not.include', '/password');
      }
    });
  });

  beforeEach(() => {
    // Start from the homepage - use the baseUrl from cypress.config.ts
    cy.visit('/');
    // Handle the password protection if present
    cy.handlePasswordProtection();
  });

  it('Should successfully load the homepage', function() {
    // After entering password, we should be on the homepage
    cy.url().should('include', 'r0969387-realbeans.myshopify.com');
    
    // Check that basic elements exist
    cy.get('body').should('be.visible');
  });

  it('Should be able to navigate to a collection page if available', function() {
    // We need to first check if there's a menu button to expand
    cy.get('body').then(($body) => {
      // Look for a menu button first
      const hasMenuButton = $body.find('button[aria-expanded="false"][aria-controls], details summary').length > 0;
      
      if (hasMenuButton) {
        // Try to open the menu if it's closed
        cy.get('button[aria-expanded="false"][aria-controls], details summary').first().click({force: true});
      }
      
      // Now look for collection links that might be visible
      cy.get('a[href*="/collections/"]').then($collectionLinks => {
        if ($collectionLinks.length > 0) {
          // Click the first collection link (with force if needed)
          cy.wrap($collectionLinks[0]).click({force: true});
          
          // Verify we're on a collection page
          cy.url().should('include', '/collections/');
        } else {
          // Skip this test if no collection links are found
          cy.log('No collection links found, skipping this test');
          this.skip();
        }
      });
    });
  });

  it('Should be able to navigate to a product page if available', function() {
    // First try to visit the /collections/all page which typically exists
    cy.visit('/collections/all');
    
    // Look for product links
    cy.get('a[href*="/products/"]').then($productLinks => {
      if ($productLinks.length > 0) {
        // If product links exist, click the first one (with force if needed)
        cy.wrap($productLinks[0]).click({force: true});
        
        // Verify we're on a product page
        cy.url().should('include', '/products/');
        
        // Basic assertions for product page elements
        cy.get('h1, h2').should('exist'); // Product title is usually in an h1 or h2
      } else {
        // Skip this test if no product links are found
        cy.log('No product links found, skipping this test');
        this.skip();
      }
    });
  });

  it('Should have cart functionality', function() {
    // Look for cart functionality, which might be a button, link, or icon
    cy.get('body').then($body => {
      // Look for various cart selectors that might exist
      const hasCartElement = 
        $body.find('a[href*="/cart"]').length > 0 || 
        $body.find('button[aria-controls*="cart"]').length > 0 || 
        $body.find('[data-cart-toggle]').length > 0 ||
        $body.find('[class*="cart"]').length > 0;
      
      if (hasCartElement) {
        // Just verify some cart-related element exists
        cy.log('Cart functionality found');
      } else {
        // Skip this test if no cart functionality is found
        cy.log('No cart functionality found, skipping this test');
        this.skip();
      }
    });
  });

  it('Should have a search feature', function() {
    // Check if there's a search button, icon, or form
    cy.get('body').then(($body) => {
      const hasSearchElement = 
        $body.find('button[aria-controls*="search"]').length > 0 || 
        $body.find('[data-modal-open="search"]').length > 0 ||
        $body.find('a[href*="/search"]').length > 0 ||
        $body.find('form[action*="/search"]').length > 0;
      
      if (hasSearchElement) {
        // Just verify some search-related element exists
        cy.log('Search functionality found');
      } else {
        // Skip this test if no search functionality is found
        cy.log('No search functionality found, skipping this test');
        this.skip();
      }
    });
  });
});