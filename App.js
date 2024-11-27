import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import SplashScreen from './components/SplashScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={Login}  options={{ headerShown: false }}/>
        <Stack.Screen name="Signup" component={Signup}  options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={Home}  options={{ headerShown: false }}/>
    
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
