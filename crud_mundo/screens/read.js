import { createClient } from '@supabase/supabase-js';
import styles from './../styles';
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
const supabaseUrl = 'https://qrgrydwiopkcomqvxiiw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ3J5ZHdpb3BrY29tcXZ4aWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzE1MjYsImV4cCI6MjA3ODA0NzUyNn0.-SBFsjbLtl5CVyAEVm4Ma75fduLkOs8_lkFRjJOz4sM';
export const supabase = createClient(supabaseUrl, SUPABASE_ANON_KEY);

export default function App() {
  const [paises, setPaises] = useState([]);
   const [nome, setNome] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [idioma, setIdioma] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const continents = ["Ásia", "Europa", "África", "América do Sul","América do Norte", "Oceania"];
  

  // Busca inicial
  useEffect(() => {
    buscarPaises();
  }, []);

   async function buscarPaises() {
    setLoading(true);
    let query = supabase.from('tb_paises').select('*').order('nome', { ascending: true });

    if (nome.trim() !== '') {
      query = query.ilike('nome', `%${nome}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar cidades:', error.message);
      Alert.alert('Erro', 'Erro ao buscar cidades.');
    } else {
      setPaises(data);
      if (data.length === 1) {
        const pais = data[0];
        setNome(pais.nome);
        setPopulacao(String(pais.populacao));
        setIdioma(String(pais.idioma));
        setSelectedContinent(String(pais.continente))
      }
    }

    setLoading(false);
  }
  
  // 🔹 Atualizar cidade
  const updateCountry = async () => {


    if (!nome.trim() || !populacao.trim() || !idioma.trim() || !selectedContinent ) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de atualizar.');
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from('tb_paises')
        .update({
          nome: nome.trim(),
          populacao: Number(populacao),
          idioma: idioma.trim(),
          continente: selectedContinent,
        })
        .eq('nome', nome);

      if (error) throw error;
      Alert.alert('Sucesso', 'Cidade atualizada com sucesso!');
      buscarCidades();
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível atualizar a cidade.');
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Deletar cidade
  const deleteCountry = async () => {
    if (!selectedCityId) {
      Alert.alert('Erro', 'Busque uma cidade primeiro.');
      return;
    }

    Alert.alert('Confirmação', 'Deseja realmente excluir esta cidade?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('tb_paises')
              .delete()
              .eq('nome', nome);

            if (error) throw error;
            Alert.alert('Sucesso', 'Cidade excluída.');
            buscarCidades();
          } catch (err) {
            console.error(err);
            Alert.alert('Erro', 'Erro ao excluir cidade.');
          }
        },
      },
    ]);
  };

  // 🔹 Renderização
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00d1b2" />
        <Text style={{ color: '#fff' }}>Carregando...</Text>
      </View>
    );
  }

  const onPressBuscar = () => {
    buscarPaises();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#eeeeee', padding: 20 }}>
      <Image style={styles.logo} source={require('./../assets/terra.jpg')} />
      <Text style={styles.title}>Consulta de Países</Text>

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

      <TouchableOpacity onPress={onPressBuscar} style={styles.button}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={updateCountry} style={styles.button}>
        <Text style={styles.buttonText}>Atualizar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteCountry} style={styles.button}>
        <Text style={styles.buttonText}>Deletar</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#00d1b2" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={paises}
          keyExtractor={(item) => item.cd_pais.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#1e1e1e',
                padding: 12,
                borderRadius: 8,
                marginVertical: 6,
              }}>
              <Text style={{ color: '#00d1b2', fontSize: 16 }}>{item.nome}</Text>
              <Text style={{ color: '#ccc' }}>Continente: {item.continente}</Text>
              <Text style={{ color: '#ccc' }}>População: {item.populacao}</Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}
