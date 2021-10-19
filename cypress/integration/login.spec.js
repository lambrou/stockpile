describe('Login test', () => {
    it('can login to an account', () => {

        cy.visit('/users/login');
        cy.get('form');

        cy.get('input[name="username"]')
            .type('TestUser')
            .should('have.value', 'TestUser');

        cy.get('input[name="password"]')
            .type('TestPass')
            .should('have.value', 'TestPass');

        cy.intercept('POST', '/users/**', {
            statusCode: 201,
            body: {
                status: 'ok',
            },
        }).as('/users/login');

        cy.get('form').submit();
        cy.wait('@/users/login').then(({ request }) => {
            expect(request.body).to.have.property('username', 'TestUser');
            expect(request.body).to.have.property('password', 'TestPass');
        });
    });
});