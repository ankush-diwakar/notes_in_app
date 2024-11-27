import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

const Signup = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // Loading state

  const validateFields = () => {
    let valid = true;
    let errors = {};

    // Username validation
    if (!formData.username.trim()) {
      valid = false;
      errors.username = "Username is required.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      valid = false;
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      valid = false;
      errors.email = "Enter a valid email address.";
    }

    // Password validation
    if (!formData.password.trim()) {
      valid = false;
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      valid = false;
      errors.password = "Password must be at least 6 characters.";
    }

    setErrors(errors);
    return valid;
  };

  const handleSignin = () => {
    navigation.replace("Login");
  }
  const handleSignup = async () => {
    if (!validateFields()) return;

    setLoading(true); // Start loading

    try {
      const response = await fetch("https://notesserver-alpha.vercel.app/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "You have signed up successfully!");
        console.log("API Response: ", result);
        setFormData({ username: "", email: "", password: "" }); // Reset form
        navigation.replace("Login"); // Navigate to login screen
      } else {
        Alert.alert("Error", result.message || "Signup failed.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again later.");
      console.error("API Error: ", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear error for the specific field
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup To <Text style={styles.highlightedText}>Notes In</Text></Text>
      {/* Username Field */}
      <TextInput
        style={[styles.input, errors.username && styles.errorInput]}
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      {/* Email Field */}
      <TextInput
        style={[styles.input, errors.email && styles.errorInput]}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* Password Field */}
      <TextInput
        style={[styles.input, errors.password && styles.errorInput]}
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* Signup Button */}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Signup</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button1, loading]}
        onPress={handleSignin}
        disabled={loading}
      >

        <Text style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: 15,
          color: 'gray',
        }}>Already have an account? Signin</Text>

      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Poppins_400Regular',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  highlightedText: {
    color: '#780000',
    fontFamily: 'Poppins_800ExtraBold',
    letterSpacing: -2,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_800ExtraBold',
    letterSpacing: -1.4,
    color: "#333",
    marginBottom: 20,
  },
  input: {
    fontFamily: 'Poppins_400Regular',

    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  errorInput: {
    borderColor: "#780000",
  },
  errorText: {
    width: "100%",
    color: "#780000",
    marginBottom: 10,
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
  buttonDisabled: {
    backgroundColor: "#e63946",
  },
  buttonText: {
    fontFamily: 'Poppins_800ExtraBold',
    letterSpacing: -0.7,
    color: "#fff",
    fontSize: 18,
  },
});

export default Signup;
