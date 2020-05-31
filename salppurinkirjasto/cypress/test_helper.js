import bookService from '../src/services/books'
import { loginError } from '../src/components/LoginForm'
import { fetchBookMessage, fetchBookFailMessage } from '../src/reducers/booksReducer'
import { borrowingMessage, failMessage } from '../src/reducers/loansReducer'
import { returningMessage, returningFailMessage } from '../src/components/ReturnBook'

const baseUrl = 'http://localhost:3001/api/testing'

const books =
    [
        {
            title: 'Särmä : yläkoulun äidinkieli ja kirjallisuus. 9',
            authors: [
                {
                    name: "Aarnio, Reeta",
                    role: "kirjoittaja."
                },
                {
                    name: "Kaseva, Tuomas",
                    role: "kirjoittaja."
                },
                {
                    name: "Kuohukoski, Sari",
                    role: "kirjoittaja."
                },
                {
                    name: "Matinlassi, Erja",
                    role: "kirjoittaja."
                },
                {
                    name: "Tylli, Arja",
                    role: "kirjoittaja."
                }
            ],
            languages: [
                'fin'
            ],
            isbn: '9789511258810',
            copy: '1'
        },
        {
            title: 'Särmä : yläkoulun äidinkieli ja kirjallisuus. 9',
            authors: [
                {
                    name: "Aarnio, Reeta",
                    role: "kirjoittaja."
                },
                {
                    name: "Kaseva, Tuomas",
                    role: "kirjoittaja."
                },
                {
                    name: "Kuohukoski, Sari",
                    role: "kirjoittaja."
                },
                {
                    name: "Matinlassi, Erja",
                    role: "kirjoittaja."
                },
                {
                    name: "Tylli, Arja",
                    role: "kirjoittaja."
                }
            ],
            languages: [
                'fin'
            ],
            isbn: '9789511258810',
            copy: '2'
        },
        {
            authors: [
                {
                    name: "Rapatti, Katriina"
                },
                {
                    name: "Kotilainen, Lari"
                },
                {
                    name: "Harmanen, Minna"
                },
                {
                    name: "Leppäjärvi, Anne"
                },
                {
                    name: "Pelto, Tuomas"
                }
            ],
            languages: [
                "fin"
            ],
            title: "Tekstitaituri : äidinkieli ja kirjallisuus. 9",
            isbn: "9789526311340",
            copy: "1"
        },
        {
            authors: [
                {
                    name: "Aarnio, Reeta"
                },
                {
                    name: "Kaseva, Tuomas"
                },
                {
                    name: "Kuohukoski, Sari"
                },
                {
                    name: "Matinlassi, Erja"
                },
                {
                    name: "Tylli, Arja"
                }
            ],
            languages: [
                "fin"
            ],
            title: "Särmä : yläkoulun äidinkieli ja kirjallisuus. 7",
            isbn: "9789511258759",
            copy: "1",
        },
        {
            authors: [
                {
                    name: "Helttunen, Anne"
                },
                {
                    name: "Saure, Annamari"
                }
            ],
            languages: [
                "fin"
            ],
            title: "Maailma on teonsana : suomalaisia runoja",
            isbn: "9510236640",
            copy: "1"
        }
    ]


const user = {
    username: 'testaaja',
    firstName: 'Testaaja',
    lastName: 'Testaaja',
    password: 'testaaja'
}

const admin = {
    username: 'admin',
    firstName: 'Admin',
    lastName: 'Admin',
    password: 'admin'
}

const errorMessage = loginError
const loginMessage = `${user.firstName} ${user.lastName} on kirjautunut sisään.`
const adminLoginMessage = `${admin.firstName} ${admin.lastName} on kirjautunut sisään.`
const borrowMessage = borrowingMessage
const borrowFailMessage = failMessage
const returnMessage = returningMessage
const returnFailMessage = returningFailMessage
const searchBookMessage = fetchBookMessage
const searchBookError = fetchBookFailMessage

const insertBooks = (booksArray) => {
    const insertBooksObject = {
        method: 'POST',
        url: `${baseUrl}/bookdata`,
        body: booksArray
    }
    return insertBooksObject
}

const insertUser = () => {
    const insertUserObject = {
        method: 'POST',
        url: 'http://localhost:3001/api/users',
        body: {
            username: 'matti',
            firstName: 'matti',
            lastName: 'matti',
            password: 'matti'
        },
        failOnStatusCode: false,
        headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
        }
    }
    return insertUserObject
}

const insertCustomer = (name) => {
    const insertCustomerObject = {
        method: 'POST',
        url: 'http://localhost:3001/api/customers',
        body: {
            username: name
        },
        failOnStatusCode: false,
        headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
        }
    }
    return insertCustomerObject
}

const modifyCustomer = (name) => {
    const modifyCustomerObject = {
        method: 'PUT',
        url: `http://localhost:3001/api/customers/${name}`,
        body: {
            accessAllowed: false
        },
        headers: {
            'Authorization': `bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
        }
    }
    return modifyCustomerObject
}

const createUser = (userObject) => {
    const createUserObject = {
        method: 'POST',
        url: 'http://localhost:3001/api/users',
        body: userObject
    }
    return createUserObject
}

const login = (username, password) => {
    const loginObject = {
        method: 'POST',
        url: 'http://localhost:3001/api/login',
        failOnStatusCode: false,
        body: {
            username: username, password: password
        }
    }
    return loginObject
}

const reset = {
    method: 'POST',
    url: `${baseUrl}/reset`
}

const removeUser = {
    method: 'DELETE',
    url: `${baseUrl}/remove`
}

export default {
    books,
    admin,
    user,
    errorMessage,
    loginMessage,
    adminLoginMessage,
    borrowMessage,
    borrowFailMessage,
    returnMessage,
    returnFailMessage,
    searchBookMessage,
    searchBookError,
    insertBooks,
    insertUser,
    insertCustomer,
    modifyCustomer,
    createUser,
    login,
    reset,
    removeUser
}