
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


const insertBooks = {
    method: 'POST',
    url: `${baseUrl}/bookdata`,
    body: books
}


const reset = {
    method: 'POST',
    url: `${baseUrl}/reset`
}

export default {
    insertBooks,
    reset
}