const viewports = [
  { label: 'desktop', apply: () => cy.viewport(1280, 800) },
  { label: 'mobile', apply: () => cy.viewport('iphone-6') },
];

describe('Blog index page', () => {
  viewports.forEach(({ label, apply }) => {
    context(label, () => {
      beforeEach(() => {
        apply();
        cy.visit('/blogs/');
      });

      it('lists blog posts with metadata', () => {
        cy.contains('h1', '📝 ブログ').should('be.visible');
        cy.contains('h2', '✨ 最新').parents('section').find('li').should('have.length.at.least', 1);
        cy.contains('h2', '🗂 すべての記事')
          .parents('section')
          .find('li')
          .first()
          .within(() => {
            cy.get('a[href*="/blogs/"]').should('have.length.at.least', 1);
            cy.contains(/\d{4}[/-]\d{2}[/-]\d{2}/).should('exist');
          });
      });

      if (label === 'desktop') {
        it('navigates to detail when clicking a blog card', () => {
          cy.contains('h2', '🗂 すべての記事')
            .parents('section')
            .find('[data-testid="blog-card"] a[href^="/blogs/"]')
            .first()
            .click({ force: true });
          cy.location('pathname', { timeout: 10000 }).should('match', /\/blogs\/[\w-]+\/?$/);
        });
      }
    });
  });
});

describe('Links page', () => {
  viewports.forEach(({ label, apply }) => {
    context(label, () => {
      beforeEach(() => {
        apply();
        cy.visit('/links/');
      });

      it('groups external links by category', () => {
        cy.contains('h1', 'Links').should('be.visible');
        cy.get('section').should('have.length.at.least', 1);
        cy.get('section').first().within(() => {
          cy.get('ul li').should('have.length.at.least', 1);
          cy.get('a').first().should('have.attr', 'target', '_blank');
          cy.get('a').first().should('have.attr', 'rel').and('include', 'noreferrer');
          cy.get('a').first().should('have.attr', 'href').and('match', /^https?:\/\//);
        });
      });

      if (label === 'desktop') {
        it('keeps current page when clicking external link with ctrl+click simulation', () => {
          cy.get('section')
            .first()
            .find('a[target="_blank"]').first()
            .then(($a) => {
              const href = $a.attr('href');
              expect(href).to.match(/^https?:\/\//);
              cy.location('pathname').then((before) => {
                cy.wrap($a).click({ ctrlKey: true, force: true });
                cy.location('pathname').should('eq', before);
              });
            });
        });
      }
    });
  });
});

describe('Publications page', () => {
  viewports.forEach(({ label, apply }) => {
    context(label, () => {
      beforeEach(() => {
        apply();
        cy.visit('/publications/', {
          onBeforeLoad(win) {
            cy.stub(win, 'open').as('publicationOpen');
          },
        });
      });

      it('shows publication list with outbound links', () => {
        cy.contains('h1', 'Publications').should('be.visible');
        cy.contains('h2', '📄 Papers')
          .parents('section')
          .find('li')
          .should('have.length.at.least', 1)
          .first()
          .within(() => {
            cy.get('a[target="_blank"]').should('have.length.at.least', 1);
          });
      });

      it('opens the primary link when clicking a publication card', () => {
        cy.get('[data-testid="publication-card"]').first().click();
        cy.get('@publicationOpen').should('have.been.called');
      });
    });
  });
});

describe('Localized page variants', () => {
  it('renders the Japanese blog index', () => {
    cy.viewport(1280, 800);
    cy.visit('/ja/blogs/');
    cy.contains('h1', '📝 ブログ').should('be.visible');
  });

  it('renders the English blog index', () => {
    cy.viewport(1280, 800);
    cy.visit('/en/blogs/');
    cy.contains('h1', '📝 Blog').should('be.visible');
  });
});
