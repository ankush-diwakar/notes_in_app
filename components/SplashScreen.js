import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Redirect to Login screen after 4 seconds
    }, 3000); 

    return () => clearTimeout(timer); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.jpg')} 
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Background color
  },
  image: {
    width: '70%', // Adjust the image size
    height: 200,
    resizeMode: 'contain', // Keep aspect ratio
  },
});

export default SplashScreen;
