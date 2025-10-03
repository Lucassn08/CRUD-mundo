import deletescreen from './delete';
import readscreen from './read';
import updatescreen from './update';
import styles from './../styles';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useState } from 'react';

export default function App() {
  // cria as variáveis (states)
  const [nome, setNome] = useState('');
  const [continente, setContinente] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [idioma, setIdioma] = useState('');
  
  // função executada quando botão Logar é selecionado
  const onPressCadastrar = () => {
    if (nome != '' || continente != ''  || populacao != ''  || idioma != '' ) {
      alert('dados enviados');
    } else {
      alert('ha dados faltantes');
    }
  };

  // função executada quando botão Logar é selecionado
  const onPressButtonMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

const content = (styles) =>(
      <View style={styles.container}>
        <Image style={styles.logo} source={require('./../assets/terra.jpg')} />

        <Text style={styles.title}> Consulta de países </Text>
        
        <TextInput
          style={styles.input}
          placeholder="nome"
          placeholderTextColor="#C0C0C0"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="continente"
          placeholderTextColor="#C0C0C0"
          value={continente}
          onChangeText={setContinente}
        />
        <TextInput
          style={styles.input}
          placeholder="população"
          placeholderTextColor="#C0C0C0"
          value={populacao}
          onChangeText={setPopulacao}
          keyboardType= 'numeric'
        />
        <TextInput
          style={styles.input}
          placeholder="idioma"
          placeholderTextColor="#C0C0C0"
          value={idioma}
          onChangeText={setIdioma}
        />
        
        
        <View style={{ marginTop: 20, alignItems:'center'}}>
          <TouchableOpacity onPress={onPressCadastrar} style={styles.button}>
            <Text style={styles.buttonText}>buscar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )

    return content(styles);
    

}


