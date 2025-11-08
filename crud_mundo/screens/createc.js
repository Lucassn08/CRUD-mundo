
import styles from './../styles';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://qrgrydwiopkcomqvxiiw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ3J5ZHdpb3BrY29tcXZ4aWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzE1MjYsImV4cCI6MjA3ODA0NzUyNn0.-SBFsjbLtl5CVyAEVm4Ma75fduLkOs8_lkFRjJOz4sM';
export const supabase = createClient(supabaseUrl, SUPABASE_ANON_KEY);

export default function App() {
   // cria as variáveis (states)
  const [nome, setNome] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [pais, setPais] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  //carrega países
  useEffect(() => {
   const fetchCountries = async () => {
     try {
       setLoading(true);
       const { data, error } = await supabase.from("tb_paises").select("cd_pais, nome");
       if (error) throw error;
       const formattedCountries = (data || []).map((pais) => ({
         label: pais.nome, 
         value: String(pais.cd_pais),
        }));
        
        setPais(formattedCountries); 
      }
      catch (err) {
        console.error(err);
        Alert.alert("Erro", "Não foi possível carregar os países.");
      }
      finally {
        setLoading(false);
      }
      };
    fetchCountries();
  }, []);

  const onPressSubmit = async () => {
    if (!nome.trim() || !populacao.trim() || !selectedCountry) {
      Alert.alert("Atenção", "Preencha todos os campos antes de cadastrar.");
      return;
    }

    try {
      setSaving(true);

      const { data: existing, error: checkError } = await supabase
        .from("tb_cidades")
        .select("cd_cidade")
        .eq("id_pais", selectedCountry)
        .ilike("nome", nome.trim());

      if (checkError) throw checkError;

      if (existing && existing.length > 0) {
        Alert.alert("Aviso", "Já existe uma cidade com esse nome neste país.");
        return;
      }

      const { error: insertError } = await supabase.from("tb_cidades").insert([
        {
          nome: nome.trim(),
          populacao: Number(populacao),
          id_pais: Number(selectedCountry),
        },
      ]);

      if (insertError) throw insertError;

      Alert.alert("Sucesso", "Cidade cadastrada com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("consultar_cidades"),
        },
      ]);

      // Limpa campos
      setNome("");
      setPopulacao("");
      setSelectedCountry("");
    }
    catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível cadastrar a cidade.");
    }
    finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Carregando países...</Text>
      </View>
    );
  }
 


return (
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
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCountry}
            onValueChange={(value) => setSelectedCountry(value)}
            style={styles.select_input}>
            <Picker.Item label="Selecione um país..." value="" />
            {pais.map((p) => (
              <Picker.Item key={p.value} label={p.label} value={p.value} />
            ))}
          </Picker>
        </View>
        
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


