import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import ModalF from './ModalF';

const Notes = ({ userNotes, api }) => {
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentNoteData, setCurrentNoteData] = useState({ title: '', description: '', _id: '' });

    const handleEditOpen = (note) => {
        setCurrentNoteData({ title: note.title, description: note.description, _id: note._id });
        setModalVisible(true);
    };

    const handleDelete = async (note) => {
        setLoading(true);
        try {
            const response = await fetch(`https://notesserver-alpha.vercel.app/api/note/delete/${note._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                Alert.alert('Success', 'Note Deleted successfully!');

            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.message || 'Failed to delete the note.');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred while deleting data.');
        } finally {
            setLoading(false);
            api();
        }
    };

    return (
        // {loading && <ActivityIndicator size="small" color="#780000" style={styles.loader} /> }
        <>
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color="#780000"
                    style={styles.loader}
                />
            ) : (<View>
                {userNotes.map((note, index) => (
                    <View key={index} style={styles.noteCard}>
                        <Text style={styles.noteTitle}>{note.title}</Text>
                        <Text style={styles.noteDescription}>{note.description}</Text>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity onPress={() => handleEditOpen(note)}>
                                <FontAwesome name="edit" size={24} color="#780000" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(note)}>
                                <AntDesign name="delete" size={24} color="#780000" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <ModalF
                    isModalVisible={isModalVisible}
                    setModalVisible={setModalVisible}
                    currentNoteData={currentNoteData}
                    api={api}
                />

            </View>)}

        </>

    );
};

const styles = StyleSheet.create({
    noteCard: {

        margin: 15,
        borderWidth: 1,
        borderColor: '#ced4da',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        padding: 18,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    noteTitle: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 20,
        color: '#780000',
        marginBottom: 8,
    },
    noteDescription: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Poppins_400Regular',
        color: '#495057',
        marginBottom: 12,
        lineHeight: 20,
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 15,
    },
    loader: {
        marginTop: 10,
        alignSelf: 'center',
    },
});

export default Notes;
