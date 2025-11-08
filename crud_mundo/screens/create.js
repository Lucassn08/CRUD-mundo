
import styles from './../styles';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useState,useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://qrgrydwiopkcomqvxiiw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ3J5ZHdpb3BrY29tcXZ4aWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzE1MjYsImV4cCI6MjA3ODA0NzUyNn0.-SBFsjbLtl5CVyAEVm4Ma75fduLkOs8_lkFRjJOz4sM';
export const supabase = createClient(supabaseUrl, SUPABASE_ANON_KEY);

export default function App() {
  // cria as variáveis (states)
  
  const [nome, setNome] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [idioma, setIdioma] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const continents = ["Ásia", "Europa", "África", "América do Sul","América do Norte", "Oceania"];
  
  // função executada quando botão Logar é selecionado
  const onPressSubmit = async () => {
    if (!nome.trim() || !populacao.trim() || !idioma.trim() || !selectedContinent ) {
      Alert.alert("Atenção", "Preencha todos os campos antes de cadastrar.");
      return;
    }

    try {
      setSaving(true);

      const { data: existing, error: checkError } = await supabase
        .from("tb_paises")
        .select("cd_pais")
        .eq("nome", nome)

      if (checkError) throw checkError;

      if (existing && existing.length > 0) {
        Alert.alert("Aviso", "pais ja registrado");
        return;
      }

      const { error: insertError } = await supabase.from("tb_paises").insert([
        {
          nome: nome.trim(),
          populacao: Number(populacao),
          idioma: idioma.trim(),
          continente: selectedContinent.trim(),
        },
      ]);

      if (insertError) throw insertError;

      Alert.alert("Sucesso", "pais cadastrado com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("consultar_paises"),
        },
      ]);

      // Limpa campos
      setNome("");
      setPopulacao("");
      setSelectedContinent("");
      setIdioma("");
    }
    catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível cadastrar o pais.");
    }
    finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando...</Text>
      </View>
    );
  }
 


return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/terra.jpg')} />

        <Text style={styles.title}> Cadastro de países </Text>
        
        <TextInput
          style={styles.input}
          placeholder="nome"
          placeholderTextColor="#C0C0C0"
          value={nome}
          onChangeText={setNome}
        />
        <View style={styles.pickerContainer}>
          <Picker
              selectedValue={selectedContinent}
              onValueChange={(value) => setSelectedContinent(value)}
              style={styles.select_input}
            >
              <Picker.Item label="Selecione um continente..." value={""} />
              {continents.map((c) => (
                <Picker.Item key={c} label={c} value={c} />
              ))}
            </Picker>
        </View>
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
          <TouchableOpacity onPress={onPressSubmit} style={styles.button}>
            <Text style={styles.buttonText}>
            {saving ? 'Salvando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )


    

}


