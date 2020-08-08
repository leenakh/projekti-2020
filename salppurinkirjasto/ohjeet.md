# Salppurin kirjasto

## Järjestelmän kuvaus

### Käyttötarkoitus ja käyttöympäristö

Sovelluksella on mahdollista hallinnoida kirjastotietokantaa ja siihen liittyviä lainaustietoja. Lisäksi sovellus sisältää kirjaston varausjärjestelmän. Sovelluksen toimintoja ovat siis
- kirjojen lisääminen tietokantaan
- kirjojen lainaaminen asiakkaille
- lainojen palauttaminen
- kirjavarausten tekeminen.

Sovellus on suunniteltu koulukirjaston käyttöön. Tämän vuoksi sillä on joitakin erityispiirteitä:
- Kirjaston asiakkaat eivät voi itse hallinnoida lainojaan, ja vain opettajat voivat olla kirjautuneita käyttäjiä.
- Kirjoja käsitellään koulukirjastossa usein isoina nidesarjoina, joten käyttöliittymässäkin kunkin nimekkeen niteet esitetään kaikki samassa näkymässä, josta poistumatta on mahdollista myös käsitellä kunkin niteen lainaustilannetta.
- Kirjojen varausjärjestelmä perustuu siihen, että opettaja varaa tiettyä oppilasryhmää varten tarvitsemansa niteet ja varaus kirjautuu opettajan nimelle. Varausta lunastaessaan opettaja kirjaa lainat oppilaille eli asiakkaille.
- Asiakastunnuksina voidaan käyttää koulun sisäisessä tietojärjestelmässä jo valmiiksi olemassa olevia käyttäjätunnuksia, joiden avulla kirjastonkin asiakkaat voidaan yksilöidä. Siksi jäjestelmässä ei ole toiminnallisuutta asiakastietojen rekisteröimiseksi.
- Järjestelmään on rakennettu kirjautuneelle käyttäjälle mahdollisuus ohittaa asiakkaalle automaattisesti asetettu lainauskielto. Näin opettaja voi harkintansa mukaan luovuttaa kirjan lainaksi sellaisellekin oppilaalle, jolla on erääntyneitä lainoja.

### Käyttäjätunnukset ja käyttöoikeudet

Järjestelmän ylläpitäjä luo käyttäjätunnukset. Ylläpitäjän lisäksi ainoa käyttäjäryhmä on lainoja hallinnoivat käyttäjät, joilla on oikeus lainata kirjoja asiakkaille, tehdä kirjavarauksia asiakkaiden puolesta ja palauttaa asiakkaiden lainoja. Käyttäjät voivat myös hallinnoida asiakkaiden lainauskieltoja (väliaikaisesti). Käyttäjät eivät voi rekisteröityä itse, ja asiakkailla ei ole lainkaan pääsyä järjestelmään.

Käyttäjästä kirjataan järjestelmään etunimi, sukunimi ja käyttäjätunnus. Kirjautumiseen tietenkin tarvitaan myös salasana.

Asiakkaista kirjataan järjestelmään vain asiakastunnus, jonka täytyy olla uniikki. Lisäksi järjestelmässä pidetään tietoa siitä, onko asiakkaalla lupa käyttää kirjaston palveluja. Järjestelmä ajaa kerran vuorokaudessa ohjelman, jolla asetetaan lainauskiellot kaikille asiakkaille, joilla on erääntyneitä lainoja.

Järjestelmän ylläpitäjällä on käytettävissään hallintanäkymä (päävalikossa `Kirjastonhoitaja`), jonka kautta hän voi lisätä kirjoja tietokantaan. Sovellus hakee kirjan tiedot ISBN-numeron perusteella Helmet-tietokannasta avoimen rajapinnan kautta. Lisäyslomakkeella on kuitenkin syötettävä erikseen kirjan julkaisuvuosi (Helmet-tietokannasta sitä ei ole saatavilla) ja niteen numero.

## Käyttöohje

### Kirjan tietojen hakeminen

Kun olet kirjautunut järjestelmään, valitse päävalikosta `Kirjasto`. Näkymään avautuvalla hakulomakkeella voit etsiä kirjaa käyttämällä hakuterminä joko ISBN-tunnusta tai nimekettä / nimekkeen osaa.

Haun suorittamisen jälkeen näet luettelon nimekkeistä, jotka vastaavat syöttämääsi hakutermiä. Napsauttamalla nimekettä saat esiin näkymän, jossa on lisätietoja nimekkeestä ja josta voit valita haluamasi toiminnon: Jos haluat lainata tai palauttaa kirjan, napsauta `Lainaa`. Jos taas haluat tehdä kirjavarauksen, napsauta `Varaa`.

### Kirjan lainaaminen ja palauttaminen

Napsauttamalla `Lainaa`-painiketta saat esiin luettelon, joka sisältää kaikki kyseisen nimekkeen niteet. Listassa esitetään ensimmäisenä kunkin niteen yksilöivä numero. Jos haluat suodattaa näkymään vain ne niteet, jotka eivät parhaillaan ole lainassa, napsauta painiketta `Lainattavissa`.

Valitse listasta nide, jonka haluat lainata tai palauttaa, ja avaa niteen tiedot napsauttamalla otsikkoa. Jos nide on lainattavissa, näkymään avautuu lainauslomake. Lomakkeella syötetään lainan alkamis- ja päättymisaika sekä asiakkaan tunnus. Mikäli asiakkaalle ei ole aikaisemmin kirjattu lainoja, hänelle luodaan asiakastunnus ensimmäisen lainan yhteydessä.

Jos nide on lainassa, näkymässä esitetään lainan tiedot (laina-aika ja asiakkaan tunnus). Voit palauttaa lainan napsauttamalla `Palauta`-painiketta.

Napsauttamalla `Näytä lainat`-painiketta saat esiin niteen lainaushistorian. Napsauttamalla painiketta uudestaan voit piilottaa tiedot.

Jos kirjan lainaaminen ei onnistu ja saat virheilmoituksen, syynä on se, että kirjaan on olemassa varaus, tai sitten asiakkaalla on lainauskielto.

Huomaa, että vaikka järjestelmä mahdollistaa kirjojen lainaamisen ilman varausta, niin ei ole kuitenkaan suositeltavaa tehdä. Varauskalenterin tiedot pysyvät paikkansapitävinä vain siten, että **tarvittava määrä kirjoja varataan ennen lainaamista**.

### Kirjan varaaminen

Kirjojen varausnäkymässä on lomake varauksen tekemistä varten sekä kalenteri varaustilanteen tarkastelemista varten. Varauskalenterin merkintöjen selitykset ovat seuraavat:
- Vihreällä taustavärillä on merkitty päivät, jolloin kaikki niteet ovat varattavissa.
- Keltaisella värillä on merkitty päivät, jolloin osa niteistä on varattavissa.
- Punaisella värillä merkittyinä päivinä kaikki niteet ovat varattuina.
- Varattujen niteiden lukumäärä on merkitty punaisella kieltomerkillä. Varattavissa olevien niteiden lukumäärä on merkitty vihreällä merkillä.
- Kalenteriin on merkitty myös varaukset tehneiden käyttäjien tunnukset.

Voit valita haluamasi varauksen alkamispäivän suoraan kalenterista napsauttamalla kalenteriruutua. Päivämäärän saat näkyviin viemällä hiiren osoittimen kalenteriruudun päälle. Varauslomake asettaa varauksen päättymispäivän automaattisesti neljän viikon päähän alkamispäivästä, mutta halutessasi voit siirtää päättymispäivää.

### Omien varausten hallinnointi

Valitse päävalikosta `Omat varaukset`. Näkymässä esitetään oletuksena ne varaukset, jotka ovat aktiivisessa tilassa eli joita ei ole arkistoitu. Napsauttamalla painiketta `Kaikki` saat näkyviin myös arkistoidut varaukset.

Napsauttamalla painiketta `Lunasta` pääset näkymään, jossa on luettelo kaikista varaukseen kuuluvista niteistä. Tässä näkymässä voit lainata varaukseen kuuluvia niteitä asiakkaille. Kaikkia niteitä ei tarvitse lainata yhdellä kertaa, vaan voit jatkaa lainaamista myöhemmin. Kun olet lainannut kaikki tarvitsemasi niteet, napsauta painiketta `Arkistoi`. Arkistoimisen jälkeen varaus poistetaan lainaamatta jääneiltä niteiltä.

Jos haluat poistaa varauksen ja kaikki siihen liittyvä tiedot pysyvästi, napsauta painiketta `Poista`.

### Asiakkaan tietojen tarkasteleminen

Valitse päävalikosta `Asiakas`. Syötä hakulomakkeelle asiakastunnus. Avautuvassa näkymässä on luettelo asiakkaalle kirjatuista lainoista. Oletuksena esitetään vain ne lainat, jotka ovat palauttamatta. Napsauttamalla painiketta `Kaikki` saat näkyviin myös asiakkaan palauttamat lainat.

Vihreällä taustalla on merkitty ne lainat, jotka asiakas on palauttanut tai joissa on laina-aikaa vielä jäljellä. Erääntyneet lainat on merkitty punaisella raidalla. Nimekekenttää napsauttamalla pääset kirjan lainauslomakkeelle ja voit esim. palauttaa lainan tai jatkaa kirjan laina-aikaa.

Asiakastiedoista näet myös, onko asiakkaalle asetettu lainauskielto. Napsauttamalla painiketta `Aseta` tai `Poista` voit asettaa tai poistaa lainauskiellon väliaikaisesti. Järjestelmä asettaa lainauskiellot automaattisesti kerran vuorokaudessa kaikille asiakkaille, joilla on erääntyneitä lainoja. Väliaikaisesti poistettu lainauskieltokin siis asetetaan uudestaan vuorokauden kuluessa, mikäli erääntynyttä lainaa ei palauteta. Samoin väliaikaisesti asetettu lainauskielto poistuu, jollei asiakkaalla ole erääntyneitä lainoja.