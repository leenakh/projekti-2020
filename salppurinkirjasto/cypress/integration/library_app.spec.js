import helper from '../test_helper'

describe('Library', function () {
    beforeEach(function () {
        cy.request(helper.reset)
        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function () {
        cy.contains('Kirjaudu sisään')
    })

    it('user can log in', function () {
        cy.get('#username').type(helper.user.username)
        cy.get('#password').type(helper.user.password)
        cy.get('#login').click()
        cy.contains(helper.loginMessage)
    })

    it('login fails when wrong password is entered', function () {
        cy.get('#username').type(helper.user.username)
        cy.get('#password').type('password')
        cy.get('#login').click()
        cy.get('#error').should('exist').and('contain', helper.errorMessage)
    })

    it('login fails when non-existent username is entered', function () {
        cy.get('#username').type('t')
        cy.get('#password').type('testaaja')
        cy.get('#login').click()
        cy.get('#error').should('exist').and('contain', helper.errorMessage)
    })
})

describe('Library with basic user', function () {
    beforeEach(function () {
        cy.request(helper.reset)
        cy.request(helper.insertBooks(helper.books))
        cy.request(helper.login(helper.user.username, helper.user.password))
            .then(response => {
                localStorage.setItem('loggedInUser', JSON.stringify(response.body))
            })
        cy.visit('http://localhost:3000')
    })

    it('create book form is not visible to basic user', function () {
        cy.get('html').should('contain', helper.loginMessage)
        cy.get('#createBook').should('not.exist')
    })

    it('user cannot be created by basic user', function () {
        cy.request(helper.insertUser())
            .then((response) => {
                expect(response.status).to.eq(401)
            })
        cy.get('#logout').click()
        cy.get('#username').type('matti')
        cy.get('#password').type('matti')
        cy.get('#login').click()
        cy.get('#error').should('exist').and('contain', helper.errorMessage)
    })

    it('search book can be executed with isbn', function () {
        cy.get('#isbn').type('9789511258810')
        cy.get('#fetch').click()
        cy.get('html').should('contain', 'Särmä : yläkoulun äidinkieli ja kirjallisuus. 9')
        cy.get('html').should('not.contain', 'Tekstitaituri')
    })

    it('search book can be executed with title', function () {
        cy.get('#title').type('Särmä : yläkoulun äidinkieli ja kirjallisuus. 9')
        cy.get('#fetch').click()
        cy.get('html').should('contain', 'Särmä : yläkoulun äidinkieli ja kirjallisuus. 9')
        cy.get('html').should('not.contain', 'Tekstitaituri').and('not.contain', 'Särmä : yläkoulun äidinkieli ja kirjallisuus. 7')
    })

    it('search book can be executed with part of title', function () {
        cy.get('#title').type('äidinkieli')
        cy.get('#fetch').click()
        cy.get('html')
            .should('contain', 'Särmä : yläkoulun äidinkieli ja kirjallisuus. 9')
            .and('contain', 'Särmä : yläkoulun äidinkieli ja kirjallisuus. 7')
            .and('contain', 'Tekstitaituri : äidinkieli ja kirjallisuus. 9')
            .and('not.contain', 'Maailma on teonsana')
    })

    describe('when book has been fetched', function () {
        beforeEach(function () {
            cy.get('#title').type('äidinkieli')
            cy.get('#fetch').click()
        })

        it('spesific book can be chosen from list of titles', function () {
            cy.contains('Särmä : yläkoulun äidinkieli ja kirjallisuus. 9')
                .contains('Valitse')
                .click()
            cy.get('html')
                .should('contain', 'Särmä : yläkoulun äidinkieli ja kirjallisuus. 9')
                .and('not.contain', 'Tekstitaituri')
            cy.get('li').should('have.length', 2)
        })

        describe('when spesific book has been chosen from list of titles', function () {
            beforeEach(function () {
                cy.contains('Särmä : yläkoulun äidinkieli ja kirjallisuus. 9')
                    .contains('Valitse')
                    .click()
            })

            it('book can be selected by copy number from list of books', function () {
                cy.get('#copy').type('2')
                cy.get('#fetchCopy').click()
                cy.get('#choose').should('contain', '2')
                cy.get('li').should('have.length', 1)
            })

            it('borrowing book form opens when specific copy is chosen from list of books', function () {
                cy.get('button').contains('2').click()
                cy.get('#borrow').should('exist')
            })

            it('book can be borrowed', function () {
                cy.get('button').contains('2').click()
                cy.get('#beginDate').type('01/01/2020')
                cy.get('#endDate').type('02/01/2020')
                cy.get('#customer').type('katti')
                cy.get('#borrow-button').click()
                cy.get('#message').should('exist').and('contain', helper.borrowingMessage)
            })

            it('when borrowing book a new customer can be created', function () {
                cy.get('button').contains('2').click()
                cy.get('#beginDate').type('01/01/2020')
                cy.get('#endDate').type('02/01/2020')
                cy.get('#customer').type('esko')
                cy.get('#borrow-button').click()
                cy.get('#message').should('exist').and('contain', helper.borrowingMessage)
                cy.request('GET', 'http://localhost:3001/api/customers/esko')
                .then((response) => {
                    expect(response.body).to.have.property('username', 'esko')
                })
            })

            describe('when book has been borrowed', function () {
                beforeEach(function () {
                    cy.get('button').contains('2').click()
                    cy.get('#beginDate').type('01/01/2020')
                    cy.get('#endDate').type('02/01/2020')
                    cy.get('#customer').type('katti')
                    cy.get('#borrow-button').click()
                })

                it('book can be returned', function () {
                    cy.get('#return-button').click()
                    cy.get('#error').should('not.exist')
                })
            })
        })
    })
})

describe('Library with admin', function () {
    beforeEach(function () {
        cy.request(helper.reset)
        cy.request(helper.insertBooks(helper.books))
        cy.request(helper.login('admin', 'admin'))
            .then(({ body }) => {
                localStorage.setItem('loggedInUser', JSON.stringify(body))
                cy.visit('http://localhost:3000')
            })
    })

    it('create book form is visible to admin', function () {
        cy.get('html').should('contain', helper.adminLoginMessage)
        cy.get('#createBook').should('exist')
    })

    it('book can be created by admin', function () {
        cy.get('#createBook').within(() => {
            cy.get('#isbn').type('9510236640')
            cy.get('#copy').type('2')
            cy.get('#create-button').click()
        })
        cy.get('html').should('contain', 'Uuden kirjan lisääminen onnistui!')
    })

    it('user can be created by admin', function () {
        cy.request(helper.insertUser())
            .then((response) => {
                expect(response.status).to.eq(200)
            })
        cy.get('#logout').click()
        cy.get('#username').type('matti')
        cy.get('#password').type('matti')
        cy.get('#login').click()
        cy.get('html').should('contain', 'matti matti')
        cy.request(helper.removeUser)
    })
})