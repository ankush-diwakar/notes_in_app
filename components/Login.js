import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';

export default function Login({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        if (!username.trim()) {
            Alert.alert('Validation Error', 'Username is required!');
            return false;
        }
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
            Alert.alert('Validation Error', 'Enter a valid email address!');
            return false;
        }
        if (!password.trim() || password.length < 6) {
            Alert.alert(
                'Validation Error',
                'Password must be at least 6 characters long!'
            );
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Simulate API call
            const response = await fetch('https://notesserver-alpha.vercel.app/api/auth/login', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                Alert.alert('Success', 'Logged in successfully!');
                console.log(data);
                navigation.replace('Home', { id: data.logedInUserId, user: data.user });

            } else {
                Alert.alert('Error', 'Login failed. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = () => {
        navigation.replace('Signup');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login To <Text style={styles.highlightedText}>Notes In</Text></Text>

            {/* Username Field */}
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#aaa"
                value={username}
                onChangeText={setUsername}
            />

            {/* Email Field */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            {/* Password Field */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
            />

            {/* Login Button */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button1, loading]}
                onPress={handleSignup}
                disabled={loading}
            >

                <Text style={{
                    fontFamily: 'Poppins_400Regular',
                    fontSize: 15,
                    color: 'gray',
                }}>Don't have an account? Signup</Text>

            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
    },
    title: {
        fontFamily: 'Poppins_800ExtraBold',
        letterSpacing: -1.4,
        fontSize: 32,
        marginBottom: 30,
        color: '#333',
    },
    highlightedText: {
        fontFamily: 'Poppins_800ExtraBold',
        letterSpacing: -2,
        color: '#780000',
    },
    input: {
        fontFamily: 'Poppins_400Regular',
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#780000',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    button1: {
        width: '100%',
        height: 50,
        color: '#000',
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    cbtn: {
        color: '#000',
    }
    ,
    buttonDisabled: {
        backgroundColor: '#aaa',
    },
    buttonText: {
        fontFamily: 'Poppins_800ExtraBold',
        color: '#fff',
        fontSize: 18,
        fontStyle: 'bold',
    },
});
