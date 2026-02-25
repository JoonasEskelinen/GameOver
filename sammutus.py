# Tuodaan käyttöjärjestelmän toiminnot, jotta voimme ajaa Linuxin sammutuskomennon
import os

# Tuodaan aikakirjasto, jolla voimme tauottaa ohjelmaa ja pitää sen käynnissä
import time

# Tuodaan Firebase Admin -kirjasto, jotta Python pystyy keskustelemaan Firebasen kanssa
import firebase_admin

# Tuodaan Firebasesta tunnistautumis- (credentials) ja tietokanta- (db) ominaisuudet
from firebase_admin import credentials, db

# --- 1. FIREBASEN ALUSTUS ---

# Ladataan turva-avain tiedostosta (Tämä ladataan Firebasen asetuksista, ohjeet alla)
cred = credentials.Certificate("serviceAccountKey.json")

# Käynnistetään Firebase-yhteys antamalla turva-avain ja oman tietokantasi URL-osoite
firebase_admin.initialize_app(cred, {
    # Tähän tulee tietokantasi osoite (löytyy Firebasen Realtime Database -välilehdeltä)
    'databaseURL': 'https://retrogamelhall-fbd1f-default-rtdb.europe-west1.firebasedatabase.app/'
})


# --- 2. KUUNTELIJA-FUNKTIO ---

# Määritetään funktio, joka suoritetaan AINA, kun Firebasen kuunneltu arvo muuttuu
def kuuntele_sammutuskomentoa(event):
    
    # Tarkistetaan, onko Firebasesta juuri tullut uusi arvo (event.data) tasan True (tosi)
    if event.data == True:
        
        # Tulostetaan terminaaliin tieto, että komento on otettu vastaan (auttaa testauksessa)
        print("Sammutuskomento vastaanotettu! Sammutetaan laite...")
        
        # TÄRKEÄÄ: Muutetaan Firebasen 'shutdown'-arvo takaisin arvoon 'False' (epätosi)
        # Jos emme tee tätä, Raspberry Pi sammuttaisi itsensä heti joka kerta kun se käynnistetään!
        db.reference('commands/shutdown').set(False)
        
        # Odotetaan 2 sekuntia, jotta Firebase ehtii varmasti tallentaa tuon 'False' arvon verkkoon
        time.sleep(2)
        
        # Ajetaan Linuxin varsinainen sammutuskomento
        # 'sudo' antaa pääkäyttäjän oikeudet, 'shutdown -h now' käskee sammuttaa (halt) heti (now)
        os.system("sudo shutdown -h now")


# --- 3. SKRIPTIN KÄYNNISTYS JA YLLÄPITO ---

# Kohdistetaan huomio Firebasen polkuun 'commands/shutdown'
# .listen() asettaa koodin "kuuntelemaan" kyseistä polkua ja ajamaan ylempänä olevan funktion muutostilanteissa
db.reference('commands/shutdown').listen(kuuntele_sammutuskomentoa)

# Tulostetaan terminaaliin ilmoitus, että ohjelma on onnistuneesti käynnissä
print("Sammutus-skripti käynnissä. Odotetaan komentoja Firebasesta...")

# Luodaan ikuinen silmukka (While True), jotta tämä Python-skripti ei sammu heti suoritettuaan ylemmät rivit
while True:
    
    # Pysäytetään silmukka yhdeksi sekunniksi kerrallaan
    # Tämä on pakollista, jotta skripti ei syö 100% Raspberry Pi:n suoritintehosta pyöriessään tyhjää
    time.sleep(1)