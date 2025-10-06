
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
  const [populacao, setPopulacao] = useState('');
  const [pais, setPais] = useState('');
  
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
        <Image style={styles.logo} source={require('../assets/cidade.jpg')} />

        <Text style={styles.title}> Cadastro de cidades </Text>
        
        <TextInput
          style={styles.input}
          placeholder="nome"
          placeholderTextColor="#C0C0C0"
          value={nome}
          onChangeText={setNome}
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
          placeholder="pais"
          placeholderTextColor="#C0C0C0"
          value={pais}
          onChangeText={setPais}
        />
        
        
        <View style={{ marginTop: 20, alignItems:'center'}}>
          <TouchableOpacity onPress={onPressCadastrar} style={styles.button}>
            <Text style={styles.buttonText}>cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    )

    return content(styles);
    

}


