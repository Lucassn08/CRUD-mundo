import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import readscreen from './screens/read';
import createscreen from './screens/create';
import readcscreen from './screens/readc';
import createcscreen from './screens/createc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



export default function App() {
      return(
    
        <NavigationContainer>
                
              <Drawer.Navigator initialRouteName="editar_paises"
              screenOptions={({ route }) => ({
                  drawerIcon: ({ color, size }) => {
                    let iconName: string = '';

                    switch (route.name) {
                      case 'cadastro_paises':
                        iconName = 'home';
                        break;
                      case 'editar_paises':
                        iconName = 'person';
                        break;
                      case 'cadastro_cidades':
                        iconName = 'home';
                        break;
                      case 'editar_cidades':
                        iconName = 'person';
                        break;
                    }
                  return <Ionicons name={iconName} size={size} color={color} />;
                  },
              })}
                  >
              <Drawer.Screen name="cadastro_paises" component={createscreen} />
              <Drawer.Screen name="editar_paises" component={readscreen} />
              <Drawer.Screen name="cadastro_cidades" component={createcscreen} />
              <Drawer.Screen name="editar_cidades" component={readcscreen} />
              
              
          </Drawer.Navigator>
        </NavigationContainer>
              )

}


