// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
/*import helper from '../test_helper'

Cypress.Commands.add('reset', () => {
    cy.request(helper.reset)
})

/*Cypress.Commands.add('insertBooks', (books) => {
    cy.request(helper.insertBooks(books))
})

Cypress.Commands.add('createUser', (userObject) => {
    cy.request(helper.createUser(userObject))
})

Cypress.Commands.add('login', (username, password) => {
    cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/login',
        body: {
            username: 'admin', password: 'admin'
        }
    })
        .then(({ body }) => {
            localStorage.setItem('loggedInUser', JSON.stringify(body))
        })
})
 */

