import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Button, 
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  Image
} from 'react-native';

// Tuodaan tarvittavat Firebase-työkalut
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, update } from 'firebase/database';

// FIREBASE ASETUKSET

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

// Alustetaan Firebase-yhteys
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function App() {
  const [games, setGames] = useState([]);           // Kaikki pelit tietokannasta
  const [selectedGame, setSelectedGame] = useState(null); // Peli, jota parhaillaan katsotaan
  const [modalVisible, setModalVisible] = useState(false); // Pelin tuloslistan näkyvyys
  const [editModalVisible, setEditModalVisible] = useState(false); // Syöttölomakkeen näkyvyys
  
  // Lomakkeen kentät uutta tulosta varten
  const [newName, setNewName] = useState('');
  const [newScore, setNewScore] = useState('');

  // tiedon haku tietokannasta
  useEffect(() => {
    const gamesRef = ref(db, 'games');
    
    // onValue kuuntelee muutoksia reaaliajassa
    return onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Muutetaan Firebase-objekti helpommin käsiteltäväksi taulukoksi
        const gameList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setGames(gameList);
        
        // Jos peli on valittuna, päivitetään sen tiedot myös näkymään
        if (selectedGame) {
          const updatedSelected = gameList.find(g => g.id === selectedGame.id);
          setSelectedGame(updatedSelected);
        }
      }
    });
  }, [selectedGame]);

  // raspberryn sammutuskäsky
  const handleShutdown = () => {
    Alert.alert(
      "Sammuta näyttö",
      "Haluatko varmasti lähettää sammutuskomennon Raspberry Pi:lle?",
      [
        { text: "Peruuta", style: "cancel" },
        { 
          text: "KYLLÄ", 
          onPress: () => update(ref(db, 'commands'), { shutdown: true }) 
        }
      ]
    );
  };

  // ennätyksien tallennus ja järjestyksen asetus
  const saveNewEntry = () => {
    // Tarkistetaan että kentät eivät ole tyhjiä
    if (!newName || !newScore) {
      return Alert.alert("Virhe", "Syötä sekä nimi että pisteet!");
    }

    const scoreValue = parseInt(newScore);
    const updates = {};

    // Haetaan nykyiset tulokset ja muutetaan ne taulukoksi järjestämistä varten
    let currentScores = [];
    if (selectedGame.topScores) {
      currentScores = Object.values(selectedGame.topScores);
    }

    // lisätään uusi tulos listalle
    currentScores.push({ 
      name: newName.trim().toUpperCase(), 
      score: scoreValue 
    });

    // järjestetään (suurimmat pisteet ensin)
    currentScores.sort((a, b) => b.score - a.score);

    // valitaan taulukosta vain 5 parasta (huonoin tippuu listalta pois)
    const newTop5 = currentScores.slice(0, 5);

    // päivitys firebaseen ja käydään läpi uusi top 5
    newTop5.forEach((entry, index) => {
      const rank = index + 1; 
      updates[`games/${selectedGame.id}/topScores/${rank}/name`] = entry.name;
      updates[`games/${selectedGame.id}/topScores/${rank}/score`] = entry.score;
    });

    // Jos uusi syötetty tulos on listan kärjessä, laukaistaan popup
    if (newTop5[0].score === scoreValue && newTop5[0].name === newName.trim().toUpperCase()) {
      updates['status/latest_winner_game'] = selectedGame.title;
      updates['status/latest_winner_name'] = newName.trim().toUpperCase();
      updates['status/latest_winner_score'] = scoreValue;
      updates['status/new_entry_trigger'] = true;
    }

    // lähetetään päivitykset, Update suorittaa kaikki muutokset samanaikaisesti
    update(ref(db), updates)
      .then(() => {
        Alert.alert("Onnistui", "Tulokset päivitetty ja järjestetty!");
        setEditModalVisible(false); // Suljetaan lomake
        setNewName('');             // Tyhjennetään kentät
        setNewScore('');
      })
      .catch(err => Alert.alert("Virhe", err.message));
  };

  // käyttöliittymä
  return (
    <SafeAreaView style={styles.container}>
      {/* Yläpalkki */}
      <View style={styles.header}>
        <Image 
          source={require('./gameover.png')} 
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.shutdownBtn} onPress={handleShutdown}>
          <Text style={styles.shutdownText}>SAMMUTA</Text>
        </TouchableOpacity>
      </View>

      {/* Pelilista (Päänäkymä) */}
      <FlatList
        data={games}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.gameCard, { borderLeftColor: item.color || '#00ffff' }]}
            onPress={() => { setSelectedGame(item); setModalVisible(true); }}
          >
            <View>
              <Text style={styles.gameTitle}>{item.title}</Text>
              <Text style={styles.gameSubtitle}>Muokkaa tuloksia</Text>
            </View>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>
        )}
      />

      {/* pelin tulosten katselu */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContent}>
          <Text style={styles.modalTitle}>{selectedGame?.title}</Text>
          
          {/* Listataan nykyinen TOP 5 (haetaan valitun pelin tiedoista) */}
          <View style={styles.scoreContainer}>
            {selectedGame && selectedGame.topScores && 
              Object.keys(selectedGame.topScores).sort((a,b) => a-b).map(rank => (
                <View key={rank} style={styles.rankRow}>
                  <Text style={styles.rankNum}>{rank}.</Text>
                  <Text style={styles.rankName}>{selectedGame.topScores[rank].name}</Text>
                  <Text style={styles.rankScore}>{selectedGame.topScores[rank].score.toLocaleString()}</Text>
                </View>
            ))}
          </View>

          {/* Nappi joka avaa syöttölomakkeen */}
          <TouchableOpacity 
            style={styles.addBtn} 
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={styles.addBtnText}>LISÄÄ UUSI TULOS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.closeBtn} 
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeBtnText}>TAKAISIN</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      {/* Syöttölomake*/}
      <Modal visible={editModalVisible} transparent={true} animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.editOverlay}
        >
          <View style={styles.editBox}>
            <Text style={styles.editTitle}>Uusi ennätys</Text>
            <Text style={styles.editSub}>{selectedGame?.title}</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="PELAAJAN NIMI" 
              placeholderTextColor="#999"
              value={newName} 
              onChangeText={setNewName}
              autoCapitalize="characters" // Muuttaa tekstin automaattisesti isoksi
              maxLength={15}
            />
            
            <TextInput 
              style={styles.input} 
              placeholder="PISTEET" 
              placeholderTextColor="#999"
              keyboardType="numeric" 
              value={newScore} 
              onChangeText={setNewScore}
            />

            <View style={styles.btnRow}>
              <TouchableOpacity 
                style={[styles.formBtn, {backgroundColor: '#666'}]} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.btnText}>PERUUTA</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.formBtn, {backgroundColor: '#00cc00'}]} 
                onPress={saveNewEntry}
              >
                <Text style={styles.btnText}>TALLENNA</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// TYYLIT
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
    paddingBottom: Platform.OS === 'android' ? 30 : 10,
   },
  
  // Header
  header: { 
    padding: 30, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#111',
    borderBottomWidth: 2,
    borderBottomColor: '#333'
  },
  headerLogo: { height: 110, width: 240, maxWidth: '50%' },
  
  // virta painike
  shutdownBtn: { backgroundColor: '#440000', padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ff0000' },
  shutdownText: { color: '#ff0000', fontWeight: 'bold', fontSize: 10 },
  
  // Pelikortit listalla
  gameCard: { 
    backgroundColor: '#1a1a1a', 
    marginHorizontal: 15, 
    marginTop: 15, 
    padding: 20, 
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  gameTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  gameSubtitle: { color: '#666', fontSize: 12, marginTop: 4 },
  arrow: { color: '#444', fontSize: 20 },

  // Modaalin sisältö (Tulosten katselu)
  modalContent: { flex: 1, backgroundColor: '#000', padding: 20 },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, textTransform: 'uppercase' },
  scoreContainer: { marginBottom: 30 },
  rankRow: { 
    flexDirection: 'row', 
    backgroundColor: '#111', 
    padding: 15, 
    marginBottom: 8, 
    borderRadius: 6, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222'
  },
  rankNum: { color: '#555', width: 40, fontSize: 16, fontWeight: 'bold' },
  rankName: { color: '#fff', flex: 1, fontSize: 16 },
  rankScore: { color: '#00ff00', fontSize: 16, fontWeight: 'bold' },

  // Painikkeet
  addBtn: { backgroundColor: '#0088ff', padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  closeBtn: { padding: 15, alignItems: 'center' },
  closeBtnText: { color: '#666', fontWeight: 'bold' },

  // Syöttölomake
  editOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  editBox: { backgroundColor: '#222', width: '85%', padding: 25, borderRadius: 15, borderWidth: 1, borderColor: '#444' },
  editTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  editSub: { color: '#888', textAlign: 'center', marginBottom: 20, fontSize: 12 },
  input: { 
    backgroundColor: '#000', 
    color: '#fff', 
    padding: 15, 
    marginBottom: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#333',
    fontSize: 16
  },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  formBtn: { flex: 0.45, padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});