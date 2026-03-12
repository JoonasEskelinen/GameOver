# Uuden pelin lisääminen Firebase Realtime Databaseen

## Vaihtoehto 1: Manuaalinen lisäys Firebase-konsolista

Paina `+` suoraan `games`-noden kohdalta (ei minkään olemassa olevan pelin alta).

### 1. Luo uusi peli-node

| Key | Value |
|---|---|
| `game_09` | *(tyhjä — lisää alakenttiä `+`:lla)* |

### 2. Lisää pelin perustiedot

| Key | Value |
|---|---|
| `title` | `Pelin nimi tähän` |
| `color` | `#FF0000` *(hex-värikoodi)* |

### 3. Lisää topScores-rakenne

Lisää `topScores`-node ja sen alle viisi sijaa:

```
topScores
  1
    name: "---"
    score: 0
  2
    name: "---"
    score: 0
  3
    name: "---"
    score: 0
  4
    name: "---"
    score: 0
  5
    name: "---"
    score: 0
```

### Valmis rakenne

```json
{
  "game_09": {
    "title": "Pelin nimi",
    "color": "#FF0000",
    "topScores": {
      "1": { "name": "---", "score": 0 },
      "2": { "name": "---", "score": 0 },
      "3": { "name": "---", "score": 0 },
      "4": { "name": "---", "score": 0 },
      "5": { "name": "---", "score": 0 }
    }
  }
}
```

---

## Vaihtoehto 2: JSON-tuonti (suositeltava, nopeampi)

1. Avaa Firebase-konsoli → Realtime Database
2. Klikkaa olemassa olevaa peliä (esim. `game_01`)
3. Paina kolme pistettä `⋮` → **Export JSON**
4. Muokkaa tiedostosta `title` ja `color`, nollaa pisteet
5. Nimeä avain uudelleen (esim. `game_09`)
6. Palaa `games`-noden kohdalle → `⋮` → **Import JSON**

---

## Huomioita

- **Key-nimen muoto** — käytä johdonmukaisesti `game_01`, `game_02` jne.
- **Värikoodi** — käytetään pelikortin reunavärinä näyttöliittymässä ja mobiilisovelluksessa
- **Pisteet nollaksi** — uudella pelillä `score: 0` ja `name: "---"` kaikilla sijoilla, kunnes oikeita tuloksia syötetään
- **Sivutus** — järjestelmä näyttää 4 peliä kerralla (2x2). Yli 8 peliä lisää automaattisesti kolmannen sivun karuselliin
