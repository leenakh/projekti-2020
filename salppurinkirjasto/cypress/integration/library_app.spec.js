import helper from '../test_helper'

describe('Library', function () {
    beforeEach(function () {
        cy.request(helper.reset)
        cy.request(helper.insertBooks)
        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function () {
        cy.contains('Kirjaudu sisään')
    })

    it('user can log in', function () {
        cy.get('#username').type('testaaja')
        cy.get('#password').type('testaaja')
        cy.get('#login').click()
        cy.contains('Testaaja Testaaja on kirjautunut sisään.')
    })
})

    describe('Library with basic user', function () {
        beforeEach(function () {
            cy.visit('http://localhost:3000')
            cy.get('#username').type('testaaja')
            cy.get('#password').type('testaaja')
            cy.get('#login').click()
        })

        it('create book form is not visible to basic user', function () {
            cy.get('html').should('not.contain', 'Lisää uusi kirja tietokantaan')
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

                it('borrowing book form opens when specific copy is chosen from list of books', function () {
                    cy.get('button').contains('2').click()
                    cy.get('#borrow').should('exist')
                })

                it('book can be selected by copy number from list of books', function () {
                    cy.get('#copy').type('2')
                    cy.get('#fetchCopy').click()
                    cy.get('#choose').should('contain', '2')
                    cy.get('li').should('have.length', 1)
                })
            })


        })
    })