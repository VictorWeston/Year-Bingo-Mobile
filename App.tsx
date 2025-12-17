import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './src/types';
import HomeScreen from './src/screens/HomeScreen';
import CreateCardScreen from './src/screens/CreateCardScreen';
import CardViewerScreen from './src/screens/CardViewerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateCard"
          component={CreateCardScreen}
          options={{title: 'New Bingo Card'}}
        />
        <Stack.Screen
          name="CardViewer"
          component={CardViewerScreen}
          options={{title: 'Bingo Card'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
