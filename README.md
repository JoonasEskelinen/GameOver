# Game House - High Score Hall of Fame

Tämä projekti on retropeliluolan dynaaminen ennätyslistausjärjestelmä. Järjestelmä koostuu React Native -mobiilisovelluksesta, Raspberry Pi:llä pyörivästä näyttöliittymästä, sekä Firebase-pilvipalvelusta.

## Arkkitehtuuri
* **Frontend (Mobile):** React Native + TypeScript
* **Display (HDMI):** HTML/JS/CSS (Kiosk Mode)
* **Backend:** Firebase Realtime Database
* **Hardware:** Raspberry Pi (Python-scripti sammutusta varten)

## Ominaisuudet
* Reaaliaikainen tulospäivitys mobiilista näytölle.
* Retroluolan estetiikkaan sopiva visuaalinen ilme.
* Etäsammutusmahdollisuus suoraan sovelluksesta (turvallinen shutdown).

## Asennus ja konfigurointi
1.  Repositorion luonti GitHubiin.
2.  Määritä Firebase API-avaimet `.env`-tiedostoon.
3.  Asenna riippuvuudet: `npm install`.
4.  Käynnistä sovellus: `npx react-native run-android/ios`.

## Projektin rakenne
* `/assets/wireframes`: Suunnittelukuvat ja PDF.
* `/mobile`: React Native -lähdekoodi.
* `/display`: Web-pohjainen näyttöliittymä.
* `/scripts`: Raspberry Pi:n Python-sammutusskripti.
