import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import deletescreen from './screens/delete';
import readscreen from './screens/read';
import updatescreen from './screens/update';
import createscreen from './screens/create';
import deletecscreen from './screens/deletec';
import readcscreen from './screens/readc';
import updatecscreen from './screens/updatec';
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

const Drawer = createDrawerNavigator();

export default function App() {
    return(
  
      <NavigationContainer>
              
            <Drawer.Navigator initialRouteName="cadastro_paises"
            screenOptions={({ route }) => ({
                drawerIcon: ({ color, size }) => {
                  let iconName: string = '';

                  switch (route.name) {
                    case 'cadastro_paises':
                      iconName = 'home';
                      break;
                    case 'apagar_paises':
                      iconName = 'home';
                      break;
                    case 'consultar_paises':
                      iconName = 'person';
                      break;
                    case 'atualizar_paises':
                      iconName = 'heart';
                      break;
                    case 'cadastro_cidades':
                      iconName = 'home';
                      break;
                    case 'apagar_cidades':
                      iconName = 'home';
                      break;
                    case 'consultar_cidades':
                      iconName = 'person';
                      break;
                    case 'atualizar_cidades':
                      iconName = 'heart';
                      break;
                  }
                return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
                >
            <Drawer.Screen name="cadastro_paises" component={createscreen} />
            <Drawer.Screen name="apagar_paises" component={deletescreen} />
            <Drawer.Screen name="consultar_paises" component={readscreen} />
            <Drawer.Screen name="atualizar_paises" component={updatescreen} />
            <Drawer.Screen name="cadastro_cidades" component={createcscreen} />
            <Drawer.Screen name="apagar_cidades" component={deletecscreen} />
            <Drawer.Screen name="consultar_cidades" component={readcscreen} />
            <Drawer.Screen name="atualizar_cidades" component={updatecscreen} />
            
        </Drawer.Navigator>
      </NavigationContainer>
            )
    
    

}


