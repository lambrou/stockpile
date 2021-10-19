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
    });
});