import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';

const ModalF = ({ isModalVisible, setModalVisible, currentNoteData,api}) => {
    const [loading, setLoading] = useState(false);
    const [noteData, setNoteData] = useState({ title: '', description: '' });

    useEffect(() => {
        if (currentNoteData) {
            setNoteData({
                title: currentNoteData.title,
                description: currentNoteData.description,
            });
        }
    }, [currentNoteData]);

    const handleEdit = async () => {
        if (!noteData.title.trim() || !noteData.description.trim()) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `https://notesserver-alpha.vercel.app/api/note/update/${currentNoteData._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: noteData.title,
                        msg: noteData.description,
                    }),
                }
            );

            if (response.ok) {
                Alert.alert('Success', 'Note edited successfully!');
                setModalVisible(false);
                api();
               
            } else {
                const errorText = await response.text();
                Alert.alert('Error', errorText || 'Failed to edit the note.');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setLoading(false);
            api();
        }
    };

    return (
        <Modal
            visible={isModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit Note</Text>
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
                        onPress={handleEdit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.addButtonText}>Edit Note</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    input: {
        width: '100%',
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

export default ModalF;
