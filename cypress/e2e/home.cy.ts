const viewports = [
  { label: 'desktop', apply: () => cy.viewport(1280, 800) },
  { label: 'mobile', apply: () => cy.viewport('iphone-6') },
];

Cypress.on('uncaught:exception', (err) => {
  if (/Unexpected token/.test(err.message)) {
    return false;
  }
});

describe('Homepage JA', () => {
  viewports.forEach(({ label, apply }) => {
    context(label, () => {
      beforeEach(() => {
        apply();
        cy.visit('/');
      });

      it('shows main hero and contact info', () => {
        cy.contains('h1', 'ホームページ').should('be.visible');
        cy.contains('p', '自然言語処理').should('be.visible');
        cy.contains('a', 'tatsukio0522@gmail.com')
          .should('have.attr', 'href', 'mailto:tatsukio0522@gmail.com')
          .and('be.visible');
      });

      it('renders highlighted sections with items', () => {
        cy.contains('h2', 'Links')
          .should('be.visible')
          .parents('section')
          .find('li')
          .should('have.length.at.least', 3);

        cy.contains('h2', '最新のブログ')
          .should('be.visible')
          .parents('section')
          .find('li')
          .should('have.length.at.least', 1);

        cy.contains('h2', '最近の公開物')
          .should('be.visible')
          .parents('section')
          .find('li')
          .should('have.length.at.least', 1);
      });

      if (label === 'mobile') {
        it('opens and closes the mobile menu', () => {
          cy.get('button[aria-label="Open menu"]').click();
          cy.get('#mobile-menu').should('exist');
          cy.contains('#mobile-menu nav a', 'Links').first().click();
          cy.get('#mobile-menu').should('not.exist');
          cy.location('pathname').should('match', /\/links\/?$/);
        });
      } else {
        it('navigates to a blog post when clicking a card', () => {
          cy.get('body').then(($body) => {
            const link = $body.find('[data-testid="home-latest-blog-link"]').get(0);
            if (link) {
              cy.wrap(link).click({ force: true });
            } else {
              cy.get('a[href="/blogs/"]').first().click({ force: true });
              cy.location('pathname', { timeout: 10000 }).should('match', /\/blogs\/?$/);
              cy.get('[data-testid="blog-card"] a[href^="/blogs/"]').first().click({ force: true });
            }
          });
          cy.location('pathname', { timeout: 10000 }).should((pathname) => {
            expect(pathname).to.match(/\/blogs\/[\w-]+\/?$/);
          });
        });
      }
    });
  });
});

describe('Homepage EN', () => {
  viewports.forEach(({ label, apply }) => {
    context(label, () => {
      beforeEach(() => {
        apply();
        cy.visit('/en');
      });

      it('shows localized content', () => {
        cy.contains('h1', 'Home Page').should('be.visible');
        cy.contains('p', 'engineer working in NLP').should('be.visible');
        cy.contains('h2', 'Latest Blog Posts').should('be.visible');
        cy.contains('h2', 'Recent Publications').should('be.visible');
      });
    });
  });
});

describe('Homepage theme toggle', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('theme', 'light');
      },
    });
  });

  it('switches between light and dark mode', () => {
    cy.get('html').invoke('attr', 'class').should('not.include', 'dark');
    cy.get('button[aria-label="Toggle theme"]').first().click();
    cy.get('html').invoke('attr', 'class').should('include', 'dark');
    cy.get('button[aria-label="Toggle theme"]').first().click();
    cy.get('html').invoke('attr', 'class').should('include', 'light');
  });
});
