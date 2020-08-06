## Salppurin kirjaston käyttöohje

### Järjestelmän käyttötarkoitus ja käyttöympäristö

Sovellus on suunniteltu koulukirjaston käyttöön. Tämän vuoksi sovelluksella on joitakin erityispiirteitä:
- Kirjaston asiakkaat eivät voi itse hallinnoida lainojaan, ja vain opettajat voivat olla kirjautuneita käyttäjiä.
- Kirjoja käsitellään koulukirjastossa usein isoina nidesarjoina, joten käyttöliittymässäkin kunkin nimekkeen niteet esitetään kaikki samassa näkymässä, josta poistumatta on mahdollista myös käsitellä kunkin niteen lainaustilannetta.
- Kirjojen varausjärjestelmä perustuu siihen, että opettaja varaa tiettyä oppilasryhmää varten tarvitsemansa niteet ja varaus kirjautuu opettajan nimelle. Varausta lunastaessaan opettaja kirjaa lainat oppilaille eli asiakkaille.
- Asiakastunnuksina voidaan käyttää koulun sisäisessä tietojärjestelmässä jo valmiiksi olemassa olevia käyttäjätunnuksia, joiden avulla kirjastonkin asiakkaat voidaan yksilöidä.
- Järjestelmään on rakennettu kirjautuneelle käyttäjälle mahdollisuus ohittaa asiakkaalle automaattisesti asetettu lainauskielto. Näin opettaja voi harkintansa mukaan luovuttaa kirjan lainaksi sellaisellekin oppilaalle, jolla on erääntyneitä lainoja.

### Käyttäjätunnukset ja käyttöoikeudet

Järjestelmän ylläpitäjä luo käyttäjätunnukset. Ylläpitäjän lisäksi ainoa käyttäjäryhmä on lainoja hallinnoivat käyttäjät, joilla on oikeus lainata kirjoja asiakkaille, tehdä kirjavarauksia asiakkaiden puolesta ja palauttaa asiakkaiden lainoja. Käyttäjät voivat myös hallinnoida asiakkaiden lainauskieltoja (väliaikaisesti). Käyttäjät eivät voi rekisteröityä itse, ja asiakkailla ei ole lainkaan pääsyä järjestelmään.

Käyttäjästä kirjataan järjestelmään seuraavat tiedot: etunimi, sukunimi ja käyttäjätunnus. Kirjautumiseen tietenkin tarvitaan myös salasana.

Asiakkaista kirjataan järjestelmään vain asiakastunnus, jonka täytyy olla uniikki. Lisäksi järjestelmässä pidetään tietoa siitä, onko asiakkaalla lupa käyttää kirjaston palveluja. Järjestelmä ajaa kerran vuorokaudessa ohjelman, jolla asetetaan lainauskiellot kaikille asiakkaille, joilla on erääntyneitä lainoja.

### Kirjan tietojen hakeminen

Kun olet kirjautunut järjestelmään, valitse päävalikosta `Kirjasto`. Näkymään avautuvalla hakulomakkeella voit etsiä kirjaa käyttämällä hakuterminä joko ISBN-tunnusta tai nimekettä / nimekkeen osaa.

Haun suorittamisen jälkeen näet luettelon nimekkeistä, jotka vastaavat syöttämääsi hakutermiä. Napsauttamalla nimekettä saat esiin näkymän, jossa on lisätietoja nimekkeestä ja josta voit valita haluamasi toiminnon: Jos haluat lainata tai palauttaa kirjan, napsauta `Lainaa`. Jos taas haluat tehdä kirjavarauksen, napsauta `Varaa`.

### Kirjan lainaaminen ja palauttaminen

Napsauttamalla `Lainaa`-painiketta saat esiin luettelon, joka sisältää kaikki kyseisen nimekkeen niteet. Listassa esitetään ensimmäisenä kunkin niteen yksilöivä numero. Valitse listasta nide, jonka haluat lainata tai palauttaa, ja avaa niteen tiedot napsauttamalla otsikkoa.

Jos nide on lainattavissa, näkymään avautuu lainauslomake. Lomakkeella syötetään lainan alkamis- ja päättymisaika sekä asiakkaan käyttäjätunnus. Mikäli asiakkaalle ei ole aikaisemmin kirjattu lainoja, hänelle luodaan käyttäjätunnus ensimmäisen lainan yhteydessä.

Jos nide on lainassa, näkymässä esitetään lainan tiedot (laina-aika ja asiakkaan käyttäjätunnus). Voit palauttaa lainan napsauttamalla `Palauta`-painiketta.

Napsauttamalla `Näytä lainat`-painiketta saat esiin niteen lainaushistorian. Napsauttamalla painiketta uudestaan voit piilottaa tiedot.

Jos kirjan lainaaminen ei onnistu ja saat virheilmoituksen, syynä on se, että kirjaan on olemassa varaus, tai sitten asiakkaalla on lainauskielto.

Huomaa, että vaikka järjestelmä mahdollistaa kirjojen lainaamisen ilman varausta, niin ei ole kuitenkaan suositeltavaa tehdä. Varauskalenterin tiedot pysyvät paikkansapitävinä vain siten, että tarvittava määrä kirjoja varataan ennen lainaamista.

### Kirjan varaaminen

