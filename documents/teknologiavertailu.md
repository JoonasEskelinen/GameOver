# Teknologiavalintojen vertailu: High Score Hall of Fame

Tämä dokumentti kertaa projektin suunnitteluvaiheessa arvioidut vaihtoehdot laitteistolle ja tietokannalle, sekä perustelut lopullisille valinnoille.

---

## Laitteisto: Näyttöä pyörittävä laite

### Vaihtoehto 1: Raspberry Pi 5  (valittu ratkaisu)

Raspberry Pi 5 (8 GB RAM) löytyi valmiina, joten se valittiin projektiin.

**Edut:**
- Ilmainen (jo omistettu, tähän projektiin kuitenkin jopa liian tehokas, käytän tätä vain kehitysvaiheessa, myöhemmin riittää muukin raspberry)
- Pieni ja hiljainen — sopii piilotettavaksi television taakse
- Chromium-selain toimii hyvin kevyelle HTML/CSS/JS-sovellukselle
- Matala virrankulutus (~5W)
- Kiosk-moodin konfigurointi suoraviivaista

**Haitat:**
- SD-kortti on herkkä virran äkilliselle katkeamiselle → siksi etäsammutus toteutettiin
- Ei Windows-tukea

---

### Vaihtoehto 1: Mini-PC 

Mini-PC olisi ollut ihanteellinen valinta.

**Edut:**
- Täysi Windows/Linux-tuki — normaali selain ilman rajoituksia
- Huomattavasti enemmän suorituskykyä kuin Raspberry Pi
- Luotettava eMMC- tai SSD-tallennus (ei SD-kortin riskejä)
- Pitkä elinikä ja laaja tuki

**Haitat:**
- Ei ollut saatavilla projektin alussa
- Kalliimpi kuin raspberry (~150–300€)
- Suurempi virrankulutus

---



### Vaihtoehto 3: Chromecast / Google TV

Chromecast tai vastaava suoratoistolaite olisi mahdollistanut sivuston heijastamisen puhelimelta tai selaimesta.

**Edut:**
- Halpa (~Riittävä laite tähän 30€)
- Ei erillistä tietokonetta tarvita

**Haitat:**
- Epävakaa pitkäkestoisessa käytössä — yhteys katkeilee
- Riippuvainen erillisestä lähdelaitteesta (puhelin/tietokone auki koko ajan)
- Ei mahdollisuutta ajaa Python-sammutusskriptiä
- Kioskinäyttökäyttöön täysin soveltumaton

---

### Vaihtoehto 4: Älytelevisio (Smart TV)

Uudemmat älytelevisiot sisältävät selaimen, jolla voi avata verkkosivuja.

**Edut:**
- Ei erillistä laitetta tarvita
- Yksinkertainen asennus

**Haitat:**
- TV-selaimet ovat usein rajoitettuja
- Ei tue JavaScript -ominaisuuksia luotettavasti
- Ei automaattista käynnistymistä
- Ei mahdollisuutta ajaa sammutusskriptiä
- kallis

---

### Vaihtoehto 5: Tavallinen kannettava/pöytätietokone

Normaali tietokone jätettynä näyttötilaan.

**Edut:**
- Täysi selaintuki, ei kompromisseja
- Helppo ylläpitää

**Haitat:**
- Suuri virrankulutus (jatkuvassa käytössä kallis)
- Iso, meluisa, ei sovi piilotettavaksi
- Ylimitoitettu yksinkertaiseen näyttötarkoitukseen

---

## Tietokanta: Ennätystietojen tallentaminen

### Vaihtoehto 1: Firebase Realtime Database

Google Firebase Realtime Database on NoSQL-pilvipalvelu, joka tarjoaa reaaliaikaisen JSON-pohjaisen datayhteyden.

**Edut:**
- **Reaaliaikaisuus ilman erillistä palvelinlogiikkaa** — muutos näkyy kaikilla laitteilla alle sekunnissa
- Ilmainen taso riittää projektin tarpeisiin (1 GB data, 10 GB/kk siirto)
- Suora JavaScript SDK selaimelle ja React Native -sovellukselle
- Python scriptin mahdollisuus sammutusskriptille
- SSL-salattu yhteys automaattisesti
- Ei omaa palvelinta tarvita — Google hoitaa infrastruktuurin


---

### Vaihtoehto 2: Supabase *(arvioitu, hylätty)*

Supabase on avoimen lähdekoodin Firebase-vaihtoehto, joka perustuu PostgreSQL-relaatiotietokantaan.

**Edut:**
- Täysi SQL-tuki — monimutkaisemmat kyselyt mahdollisia
- Reaaliaikaisuus myös tuettu (PostgreSQL LISTEN/NOTIFY)
- Avoimen lähdekoodin — voi ajaa omalla palvelimella
- Ilmainen taso saatavilla

**Haitat:**
- **Reaaliaikaisuus on monimutkaisempi** konfiguroida kuin Firebasessa
- Vaatii enemmän alkuasettelua
- Vähemmän dokumentaatiota Raspberry Pi + Python -yhdistelmälle

---

### Vaihtoehto 3: Tavallinen SQL-tietokanta (esim. SQLite, MySQL)

Perinteinen relaatiotietokanta omalla palvelimella tai Raspberry Pi:llä paikallisesti.

**Edut:**
- Täysi kontrolli datasta
- Ei ulkoisia riippuvuuksia
- SQL on tuttu ja standardoitu

**Haitat:**
- **Ei reaaliaikaisuutta** — mobiilisovellus ja näyttö eivät synkronoidu automaattisesti
- Vaatii oman backend-palvelimen (esim. Flask) REST API:n rakentamiseen
- Paikallinen SQLite Raspberry Pi:llä tarkoittaisi että mobiilisovellus ei pystyisi kirjoittamaan dataa suoraan
- Huomattavasti enemmän kehitystyötä ilman merkittävää hyötyä tähän käyttötapaukseen

---

### Vaihtoehto 4: JSON-tiedosto paikallisesti 

Ennätykset tallennettaisiin pelkäksi JSON-tiedostoksi Raspberry Pi:lle.

**Edut:**
- Täysin yksinkertainen — ei ulkoisia palveluja
- Toimii offline-tilassa

**Haitat:**
- **Ei reaaliaikaisuutta lainkaan** — mobiilisovellus ei pysty kirjoittamaan suoraan Pi:n tiedostoon
- Vaatii SSH-yhteyden tai erillisen synkronointimekanismin päivityksiin
- Tiedoston korruptoitumisriski SD-kortin kanssa

---


**Firebase Realtime Database yhdistettynä Raspberry Pi:hin osoittautui selvästi parhaaksi yhdistelmäksi**, koska se tarjoaa natiivisti sen mitä projekti eniten tarvitsi: reaaliaikaisen synkronoinnin mobiilisovelluksen ja näyttöliittymän välille ilman erillistä palvelinlogiikkaa, kevyen ja luotettavan alustan kioskinäytölle, sekä Python Admin scriptin sammutusskriptille — kaikki yhdellä teknologiapinolla.
