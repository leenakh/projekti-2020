export const filtteri = () => {
    console.log('Kukkuu')
    const taulukko = [
        {
            nimi: 'esko',
            asiat: ['kala', 'koira', 'kana']
        },
        {
            nimi: 'katti',
            asiat: ['kissa', 'kana']
        }
    ]

    const tulos = taulukko.filter(t => t.asiat.includes('kala'))
    console.log('tulos', tulos)
}