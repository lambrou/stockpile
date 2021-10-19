describe('Register test', () => {
    it('can register an account', () => {

        cy.visit('/users/register');
        cy.get('form');

        cy.get('input[name="username"]')
            .type('TestUser')
            .should('have.value', 'TestUser');

        cy.get('input[name="password"]')
            .type('TestPass')
            .should('have.value', 'TestPass');

        cy.get('input[name="password2"]')
            .type('TestPass')
            .should('have.value', 'TestPass');

        cy.intercept('POST', '/users/**', {
            statusCode: 201,
            body: {
                status: 'ok',
            },
        }).as('/users/register');
        cy.get('form').submit();

        cy.wait('@/users/register').then(({ request }) => {
            expect(request.body).to.have.property('username', 'TestUser');
            expect(request.body).to.have.property('password', 'TestPass');
        });

        cy.url()
            .should('equal', 'http://localhost:3000/');
    });

    it('receives an error when using an existing username', () => {
        
        cy.visit('/users/register');
        cy.get('form');

        cy.get('input[name="username"]')
            .type('ExistingUser')
            .should('have.value', 'ExistingUser');

        cy.get('input[name="password"]')
            .type('TestPass')
            .should('have.value', 'TestPass');

        cy.get('input[name="password2"]')
            .type('TestPass')
            .should('have.value', 'TestPass');

        cy.get('form').submit();
        
        cy.get('div[id="messages"]').should(($messages) => {
            expect($messages).to.have.property('show');
            expect($messages).to.have.text('Username already exists.');
        });
    })

    it('receives an error when using a password that is too short', () => {
        
        cy.visit('/users/register');
        cy.get('form');

        cy.get('input[name="username"]')
            .type('TestUser')
            .should('have.value', 'TestUser');

        cy.get('input[name="password"]')
            .type('Short')
            .should('have.value', 'Short');

        cy.get('input[name="password2"]')
            .type('Short')
            .should('have.value', 'Short');

        cy.get('form').submit();
        
        cy.get('div[id="messages"]').should(($messages) => {
            expect($messages).to.have.property('show');
            expect($messages).to.have.text('Password must be at least 6 characters long.');
        });
    })
});