
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Alert,
  Modal,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_800ExtraBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';

import AppLoading from 'expo-app-loading';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import Card from './Card';

const Home = () => {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_800ExtraBold,
    Poppins_700Bold,
  });
 

  const route = useRoute();
  const { id, user } = route.params;
  const navigation = useNavigation();
  const [userNotes, setUserNotes] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [noteData, setNoteData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(true);

  const fetchApiData = async () => {
    try {
      const response = await fetch(`https://notesserver-alpha.vercel.app/api/note/notebyuid/${id}`);
      if (response.ok) {
        const data = await response.json();
        setUserNotes(data.notes); // Store API response in state
      } else {
        Alert.alert('Error', 'Failed to fetch data from the server.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred while fetching data.');
    } finally {
      setLoading2(false); // Stop loading indicator
    }
  };
 

  useEffect(() => {
    fetchApiData();
    const backAction = () => {
      if (!navigation.canGoBack()) {
        Alert.alert(
          'Hold on!',
          'Are you sure you want to exit?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {
              text: 'YES',
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [navigation, noteData]);

  const handleAddNote = async () => {
    if (!noteData.title.trim() || !noteData.description.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://notesserver-alpha.vercel.app/api/note/addnew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          title: noteData.title,
          msg: noteData.description,
          postedBy: id,
        }),
      });

      if (response.ok) {
        // const result = await response.json();
        Alert.alert('Success', 'Note added successfully!');
        setNoteData({ title: '', description: '' });
        setModalVisible(false);

      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to add the note.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred.');
      setNoteData({ title: '', description: '' });
      setModalVisible(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {loading2 ? (
        <ActivityIndicator size="large" color="#780000" />
      ) : userNotes.length > 0 ? (
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.text}> Welcome, <Text style={{ color: '#780000',fontFamily:'Poppins_800ExtraBold', letterSpacing: -1, }}>{user.username}!</Text>  {'\n'} Here are Your Notes{'\n'} </Text>
          <Card userNotes={userNotes} api={fetchApiData} />
        </ScrollView>
      ) : (
        <View style={{ height: '100%' }}>

          <Text style={styles.text1}> Welcome, <Text style={{ color: '#780000',fontFamily:'Poppins_800ExtraBold', letterSpacing: -1, }}>{user.username}! </Text></Text>
          <Text style={styles.text11}>Opps! Seems Like you haven't added any note. {'\n'}Add new notes to see them!</Text>
        </View>


      )}



      {/* Circular Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.floatingButtonText}><AntDesign name="addfile" size={24} color="white" /></Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add a Note</Text>
            <TextInput
              style={styles.input}
              placeholder="Title of Note"
              value={noteData.title}
              onChangeText={(text) => setNoteData({ ...noteData, title: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description of Note"
              value={noteData.description}
              onChangeText={(text) =>
                setNoteData({ ...noteData, description: text })
              }
              multiline={true}
              numberOfLines={4}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddNote}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.addButtonText}>Add Note</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 45,
    backgroundColor: '#fff',
  },
  text: {
    fontFamily: 'Poppins_800ExtraBold',
    letterSpacing: -1,
    fontSize: 30,
    padding: 15,
    color: '#333',
    marginBottom: -45,
  },
  text1: {
    fontFamily: 'Poppins_800ExtraBold',
    fontSize: 25,
    padding: 15,
    color: '#333',
  },
  text11: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    padding: 15,
    marginLeft: 10,
    color: 'gray',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#780000',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  scrollContainer: {
    height: '100%',
    width: '100%',
  },
  noteCard: {
    margin: 15,
    borderWidth: 1, // Thickness of the border
    borderColor: '#ced4da', // Green border color
    borderRadius: 10, // Rounded corners (optional)
    borderStyle: 'solid', // Solid border (default)
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  noteTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: 'black',
    marginBottom: 8,
  },
  noteDescription: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    fontWeight: '500',
    color: '#495057',
    marginBottom: 12,
    lineHeight: 20,
  },
  noteButton: {
    backgroundColor: '#780000',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    marginBottom: 10,
    color: '#333',
  },
  input: {
    width: '100%',
    fontFamily: 'Poppins_400Regular',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
  },
  addButton: {
    width: '100%',
    fontFamily: 'Poppins_800ExtraBold',

    height: 50,
    backgroundColor: '#780000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;
