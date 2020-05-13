
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


const insertBooks = (booksArray) => {
    const insertBooksObject = {
        method: 'POST',
        url: `${baseUrl}/bookdata`,
        body: booksArray
    }
    return insertBooksObject
}

const createBasicUser = {
    method: 'POST',
    url: `${baseUrl}/user`,
    body: user
}

const createUser = (userObject) => {
    const createUserObject = {
        method: 'POST',
        url: `${baseUrl}/user`,
        body: userObject
    }
    return createUserObject
}

const login = (username, password) => {
    const loginObject = {
        method: 'POST',
        url: 'http://localhost:3001/api/login',
        body: {
            username: username, password: password
        }
    }
    return loginObject
}

const loginAdmin = {
    method: 'POST',
    url: 'http://localhost:3001/api/login',
    body: {
        username: 'admin', password: 'admin'
    }
}

const reset = {
        method: 'POST',
        url: `${baseUrl}/reset`
    }

export default {
    books,
    admin,
    user,
    insertBooks,
    createBasicUser,
    createUser,
    login,
    loginAdmin,
    reset
}