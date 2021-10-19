describe('Login test', () => {
    it('can login to an account', () => {

        cy.visit('/users/login');
        cy.get('form');

        cy.get('input[name="username"]')
            .type('ExistingUser')
            .should('have.value', 'ExistingUser');

        cy.get('input[name="password"]')
            .type('TestPass')
            .should('have.value', 'TestPass');

        cy.intercept('POST', '/users/**', {
            statusCode: 201,
            body: {
                status: 'ok', message: 'You are now logged in.'
            },
        }).as('/users/login');

        cy.get('form').submit();

        cy.wait('@/users/login').then(({ request }) => {
            expect(request.body).to.have.property('username', 'ExistingUser');
            expect(request.body).to.have.property('password', 'TestPass');
        });

        cy.url()
            .should('equal', 'http://localhost:3000/');
    });

    it('receives an error when using an invalid username', () => {
        
        cy.visit('/users/login');
        cy.get('form');

        cy.get('input[name="username"]')
            .type('NotARealUser')
            .should('have.value', 'NotARealUser');

        cy.get('input[name="password"]')
            .type('TestPass')
            .should('have.value', 'TestPass');

        cy.get('form').submit();
        
        cy.get('div[id="messages"]').should(($messages) => {
            expect($messages).to.have.property('show');
            expect($messages).to.have.text('User does not exist.');
        });
    })

    it('receives an error when using an invalid password', () => {
        
        cy.visit('/users/login');
        cy.get('form');

        cy.get('input[name="username"]')
            .type('ExistingUser')
            .should('have.value', 'ExistingUser');

        cy.get('input[name="password"]')
            .type('WrongPassword')
            .should('have.value', 'WrongPassword');

        cy.get('form').submit();
        
        cy.get('div[id="messages"]').should(($messages) => {
            expect($messages).to.have.property('show');
            expect($messages).to.have.text('Incorrect password.');
        });
    })
});