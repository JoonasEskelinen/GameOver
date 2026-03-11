# Projektidokumentaatio: Retro Game House — High Score Hall of Fame

> Tämä dokumentti kattaa "High Score Hall of Fame" -järjestelmän suunnittelun, toteutuksen ja testauksen. Järjestelmä on luotu modernisoimaan retropeliluolan ennätysten seuranta säilyttäen samalla 80-90 lukujen estetiikkaa.

---

## Vaihe 1: perusta

### 1.1 Tavoitteet

Projektin tavoitteena on luoda dynaaminen ennätyslista, joka toimii peliluolan visuaalisena keskipisteenä. Järjestelmän tulee motivoida pelaajia palaamaan rikkomaan ennätyksiä tarjoamalla välittömän ja näyttävän ilmoituksen uudesta tuloksesta.

### 1.2 Mittarit ja laatuvaatimukset

| Mittari | Vaatimus |
|---|---|
| Viive | Tuloksen päivitys mobiilisovelluksesta näytölle reaaliajassa |
| Käytettävyys | Uuden tuloksen syöttö ylläpitäjän toimesta alle kätevästi mobiilista |
| Vakaus | Järjestelmän on toimittava keskeytyksettä jatkuvasti |
| Luettavuus | Ennätysten on oltava luettavissa 0–5 metrin etäisyydeltä |

### 1.3 Työkalut ja teknologiat

- **Versionhallinta:** GitHub
- **Kehitysympäristö:** VS Code

**Teknologia:**

- Firebase Realtime Database (Tietokanta)
- React Native + TypeScript (mobiilisovellus)
- HTML5 / CSS3 / JavaScript (näyttöliittymä)
- Raspberry Pi 5 (hardware & Python-sammutusskripti)

### 1.4 Aikataulu 

Projekti toteutetaan kolmessa vaiheessa:

| Vaihe | Nimi | Sisältö |
|---|---|---|
| Vaihe 1 | Suunnittelu | Teknologiaratkaisujen vertailu huolella, mikä paras yhdistelmä juuri tähän. |
| Vaihe 2 | Arkkitehtuuri | Firebase-projektin pystytys, JSON-rakenteen määrittely ja perus-HTML-yhteyden testaus |
| Vaihe 3 | Toiminnallisuus | React Native -mobiilisovelluksen kehitys ja reaaliaikainen synkronointi |
| Vaihe 4 | Viimeistely | CRT-efektit(90-luku jäljitelmä), karuselli-logiikan hienosäätö, 2x2 grid -asettelu ja lopullinen testaus |

---

## Vaihe 2: Vaatimusmäärittely

### 2.1 Toiminnalliset vaatimukset

- Järjestelmän on näytettävä 8 valitun pelin TOP 5 -ennätykset. Tyyli sen mukaan, että pelejä helppo lisätä jatkossa.
- Näytön on vaihdettava sivua automaattisesti tietyn ajan välein (karuselli).
- Mobiilisovelluksella on voitava lisätä, muokata ja poistaa pelejä ja tuloksia. (Pelien lisäyksen ja poiston voi alkuun toteuttaa firebasen kautta).
- Uuden ennätyksen tullessa näytön on näytettävä "NEW HIGH SCORE" -animaatio.
- Näyttö on voitava sammuttaa turvallisesti mobiilisovelluksen kautta.

### 2.2 Ei-toiminnalliset vaatimukset

- **Visuaalisuus:** Käytössä on oltava `Press Start 2P` -pikselifontti ja CRT-tyyliset scanline-efektit.
- **Reaaliaikaisuus:** Data-yhteyden on oltava jatkuva (WebSocket/Firebase stream).
- **Ylläpito:** Ohjelman on käynnistyttävä automaattisesti Raspberryn käynnistyksen jälkeen (kiosk mode).

### 2.3 Käyttäjätarinat (User Stories)

> **Pelaajana** haluan nähdä nimeni näytöllä heti suorituksen jälkeen, jotta saavuttamani tulos saa ansaitsemansa huomion.

> **Ylläpitäjänä** haluan päivittää tulokset langattomasti kännykällä, jotta voin liikkua vapaasti peliluolassa ilman tarvetta fyysisille oheislaitteille.


---

## Vaihe 3: Tekninen suunnittelu

### 3.1 Tietokannan rakenne (JSON)

Tietokanta on rakennettu NoSQL-muotoon Firebasen Realtime Databaseen. Rakenteen keskiössä on `games`-objekti, joka mahdollistaa dynaamisen listauksen.

Tietokanta alustettiin tuomalla valmis JSON-tiedosto Firebase-konsolin kautta:

```json
{
  "games": {
    "game_01": {
      "title": "Flipperi - Mario Bros",
      "color": "#FFFF00",
      "topScores": {
        "1": { "name": "Matti Meikäläinen", "score": 55000 }
      }
    }
  },
  "status": { "new_entry_trigger": false },
  "commands": { "shutdown": false }
}
```

### 3.2 Käyttöliittymäsuunnitelma

Näyttöliittymä on jaettu 2x2-ruudukkoon, mikä mahdollistaa optimaalisen luettavuuden.

- **Sivu 1:** Pelit 1–4
- **Sivu 2:** Pelit 5–8

**Efektit:** CSS-pohjainen scanline-gradientti ja `@keyframes`-pohjainen flicker-animaatio luovat autenttisen putkitelevisiotunnelman.

---

## Vaihe 4: Testaus ja laadunvarmistus

### 4.1 Testiraportti

| Testi | Kuvaus | Tulos |
|---|---|---|
| Reaaliaikaisuus | Pisteen muutos Firebasessa → heijastuminen näytölle reaaliajassa | ✅ |
| Karuselli | Sivun vaihtuminen 15 sekunnin välein | ✅ |
| Etäsammutus | `commands/shutdown` muutos → Raspberry sammuu | ✅ |
| Dynaamisuus | 9. pelin lisäys → "Sivu 1 / 3" ilmestyy | ✅ |

### 4.2 Palaverimuistiot

- **Aloituspalaveri:** Päätettiin käyttää Firebasea reaaliaikaisuuden vuoksi. Valittiin React Native mobiilialustaksi. Tämän jälkeen kysyin yrittäjältä, montako peliä ennätyslistaukseen tulee ja tyyli päätetty sen pohjalta (2x2 grid).
- **Loppukatselmus:** Todettiin CRT-efektien ja "New High Score" -triggerin toimivan tyylissä odotetulla lailla retrohenkisenä putkitelevisiomaisena tyylinä.

---

## Vaihe 5: Loppuraportti ja yhteenveto

### 5.1 Onnistumiset ja opittu

Projekti onnistui teknisesti erinomaisesti. Erityisen tyytyväinen olen visuaaliseen ilmeeseen, joka saavutettiin puhtaalla CSS:llä ilman raskaita kuvatiedostoja.

**Opittua:** Firebase-sääntöjen (`.read`/`.write`) merkitys turvallisuudessa ja Raspberry Pi:n kiosk-moodin konfigurointi Linux-ympäristössä.

### 5.2 Jatkokehitysehdotukset

- **Pelaajien itsepalvelu:** QR-koodi jokaisen pelikoneen kyljessä, joka vie lomakkeeseen tuloksen syöttämistä varten (vaatii ylläpitäjän hyväksynnän).
- **Historia-data:** Tallennetaan ennätysten historia, jotta voidaan näyttää "Kuukauden parhaat" -listauksia.
- **Ääniefektit:** "New High Score" -ilmoituksen yhteyteen 8-bittinen fanfaari.

