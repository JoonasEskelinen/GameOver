# Suunnitteluehdotus

Game House: High Score Hall of Fame
Visio: Luoda high-score listaus "ilmoitustaululle" retropeliluolaan, jossa listattuna kaikkien pelien ennätykset. Näyttö toimii peliluolan dynaamisena keskipisteenä, joka kunnioittaa 80- ja 90-luvun estetiikkaa. Ajatuksena tässä projektissa, että ihmiset tulisivat uudestaan peliluolaan rikkomaan ennätyksiä, koska ne ovat kaikkien nähtävillä jossain näkyvässä kohtaa. 
Tätä projektia mahdollisuus käyttää jatkossa myös muissa vastaavissa käytöissä.

Tekniset ratkaisut:

Mobiilisovellus: React Native (TypeScript) tarjoaa natiivin suorituskyvyn ja helpon käyttöliittymän tulosten syöttöön langattomasti.

Hallintajärjestelmä: Firebase Realtime Database mahdollistaa välittömät päivitykset näytölle ilman sivun päivitystä.

Ekosysteemi: Raspberry Pi toimii "kiosk-laitteena", joka on optimoitu vain tulosten näyttämiseen ja turvalliseen sammuttamiseen.

# Rautalankamallien (Wireframes) ideointi

## Työpöytäversio (HDMI-näyttö / 1440px)

- Vaihtuva näkymä, joka toteutetaan The Rotating Billboard (Karuselli) menetelmällä. Jokaisella sivulla eri pelejä.

- Alareunassa kello ja "Last Updated" -aikaleima, sekä mihin peliin viimeisin ennätys lisätty.

## CSS-efektinä
- Scanline-efekti: Toteutetaan yhdellä div-elementillä, jossa on toistuva lineaarinen gradientti (mustia läpinäkyviä viivoja).
- Välkyntä (Flicker): Lisätään kevyt opacity-animaatio (0.97 -> 1.0) koko näytölle simuloimaan vanhaa putkitelevisiota.
- Dynaaminen Fontti: Käytä @font-face -määrittelyä 'Press Start 2P' -fontille.

# Mobiiliversio (375px)
## Etusivu:
- Lista kaikista peleistä (skrollattava).

- Pikavalinta "Lisää uusi tulos".

- Virtapainike (Sammuta näyttö) selkeästi eroteltuna (esim. oikea yläkulma).

## Pelisivu:

- Lomake: Pelaajan nimi (tekstikenttä) ja Pisteet (numeerinen kenttä).

- "Tallenna ja päivitä Hall of Fame" -nappi.
