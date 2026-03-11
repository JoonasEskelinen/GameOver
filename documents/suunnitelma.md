# Projektidokumentaatio: Retro Game House — High Score Hall of Fame

> Tämä dokumentti kattaa "High Score Hall of Fame" -järjestelmän suunnittelun, toteutuksen ja testauksen. Järjestelmä on luotu modernisoimaan retropeliluolan ennätysten seuranta säilyttäen samalla 80-luvun estetiikan.

---

## Vaihe 1: Hallinnollinen perusta

### 1.1 Tavoitteet

Projektin tavoitteena on luoda dynaaminen ennätyslista, joka toimii peliluolan visuaalisena keskipisteenä. Järjestelmän tulee motivoida pelaajia palaamaan rikkomaan ennätyksiä tarjoamalla välittömän ja näyttävän palautteen uudesta tuloksesta.

### 1.2 Mittarit ja laatuvaatimukset

| Mittari | Vaatimus |
|---|---|
| Viive | Tuloksen päivitys mobiilisovelluksesta näytölle alle 1 sekunnissa |
| Käytettävyys | Uuden tuloksen syöttö ylläpitäjän toimesta alle 15 sekunnissa |
| Vakaus | Järjestelmän on toimittava keskeytyksettä vähintään 24 tuntia (stressitesti) |
| Luettavuus | Ennätysten on oltava luettavissa 3–5 metrin etäisyydeltä |

### 1.3 Työkalut ja teknologiat

- **Versionhallinta:** GitHub
- **Projektinhallinta:** Trello (tehtävien seuranta ja backlog)
- **Kehitysympäristö:** VS Code

**Teknologiapino:**

- Firebase Realtime Database (Sijainti: Belgium/Europe)
- React Native + TypeScript (mobiilisovellus)
- HTML5 / CSS3 / JavaScript (näyttöliittymä)
- Raspberry Pi 4 (hardware & Python-sammutusskripti)

### 1.4 Aikataulu ja sprintit

Projekti toteutettiin kolmessa vaiheessa (sprintissä):

| Sprint | Nimi | Sisältö |
|---|---|---|
| Sprint 1 | Arkkitehtuuri | Firebase-projektin pystytys, JSON-rakenteen määrittely ja perus-HTML-yhteyden testaus |
| Sprint 2 | Toiminnallisuus | React Native -mobiilisovelluksen kehitys, CRUD-toiminnot ja reaaliaikainen synkronointi |
| Sprint 3 | Viimeistely | CRT-efektit, karuselli-logiikan hienosäätö, 2x2 grid -asettelu ja lopullinen testaus |

---

## Vaihe 2: Vaatimusmäärittely

### 2.1 Toiminnalliset vaatimukset

- Järjestelmän on näytettävä 8 valitun pelin TOP 5 -ennätykset.
- Näytön on vaihdettava sivua automaattisesti 15 sekunnin välein (karuselli).
- Mobiilisovelluksella on voitava lisätä, muokata ja poistaa pelejä ja tuloksia.
- Uuden ennätyksen tullessa näytön on näytettävä "NEW HIGH SCORE" -animaatio.
- Näyttö on voitava sammuttaa turvallisesti mobiilisovelluksen kautta.

### 2.2 Ei-toiminnalliset vaatimukset

- **Visuaalisuus:** Käytössä on oltava `Press Start 2P` -pikselifontti ja CRT-tyyliset scanline-efektit.
- **Reaaliaikaisuus:** Data-yhteyden on oltava jatkuva (WebSocket/Firebase stream).
- **Ylläpito:** Järjestelmän on käynnistyttävä automaattisesti sähkökatkon jälkeen (kiosk mode).

### 2.3 Käyttäjätarinat (User Stories)

> **Pelaajana** haluan nähdä nimeni näytöllä heti suorituksen jälkeen, jotta saavuttamani tulos saa ansaitsemansa huomion.

> **Ylläpitäjänä** haluan päivittää tulokset langattomasti kännykällä, jotta voin liikkua vapaasti peliluolassa ilman tarvetta fyysisille oheislaitteille.

> **Ylläpitäjänä** haluan sammuttaa järjestelmän hallitusti sovelluksesta, jotta vältän Raspberry Pi:n SD-kortin vioittumisen.

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
| Reaaliaikaisuus | Pisteen muutos Firebasessa → heijastuminen näytölle | ✅ PASS (viive ~200ms) |
| Karuselli | Sivun vaihtuminen 15 sekunnin välein | ✅ PASS |
| Etäsammutus | `commands/shutdown` muutos → Raspberry sammuu | ✅ PASS |
| Dynaamisuus | 9. pelin lisäys → "Sivu 1 / 3" ilmestyy | ✅ PASS |

### 4.2 Palaverimuistiot

- **Aloituspalaveri:** Päätettiin käyttää Firebasea reaaliaikaisuuden vuoksi. Valittiin React Native mobiilialustaksi.
- **Sprint Review (Sprint 2):** Huomattiin, että 20 peliä kerralla on liikaa. Päätettiin siirtyä 4 peliä/sivu (2x2 grid) -malliin.
- **Loppukatselmus:** Todettiin CRT-efektien ja "New High Score" -triggerin toimivan odotetusti.

---

## Vaihe 5: Loppuraportti ja yhteenveto

### 5.1 Onnistumiset ja opittu

Projekti onnistui teknisesti erinomaisesti. Erityisen tyytyväinen olen visuaaliseen ilmeeseen, joka saavutettiin puhtaalla CSS:llä ilman raskaita kuvatiedostoja.

**Opittua:** Firebase-sääntöjen (`.read`/`.write`) merkitys turvallisuudessa ja Raspberry Pi:n kiosk-moodin konfigurointi Linux-ympäristössä.

### 5.2 Jatkokehitysehdotukset

- **Pelaajien itsepalvelu:** QR-koodi jokaisen pelikoneen kyljessä, joka vie lomakkeeseen tuloksen syöttämistä varten (vaatii ylläpitäjän hyväksynnän).
- **Historia-data:** Tallennetaan ennätysten historia, jotta voidaan näyttää "Kuukauden parhaat" -listauksia.
- **Ääniefektit:** "New High Score" -ilmoituksen yhteyteen 8-bittinen fanfaari.
