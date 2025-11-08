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
  ScrollView,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';

const supabaseUrl = 'https://qrgrydwiopkcomqvxiiw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyZ3J5ZHdpb3BrY29tcXZ4aWl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzE1MjYsImV4cCI6MjA3ODA0NzUyNn0.-SBFsjbLtl5CVyAEVm4Ma75fduLkOs8_lkFRjJOz4sM';
const supabase = createClient(supabaseUrl, SUPABASE_ANON_KEY);

export default function App() {
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [populacao, setPopulacao] = useState('');
  const [pais, setPais] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState(null);

  // 🔹 Carrega os países no Picker
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tb_paises')
          .select('cd_pais, nome');
        if (error) throw error;

        const formatted = data.map((p) => ({
          label: p.nome,
          value: String(p.cd_pais),
        }));
        setPais(formatted);
      } catch (err) {
        console.error(err);
        Alert.alert('Erro', 'Não foi possível carregar os países.');
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // 🔹 Busca cidades (todas ou por nome)
  async function buscarCidades() {
    setLoading(true);
    let query = supabase.from('tb_cidades').select('*').order('nome', { ascending: true });

    if (nome.trim() !== '') {
      query = query.ilike('nome', `%${nome}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar cidades:', error.message);
      Alert.alert('Erro', 'Erro ao buscar cidades.');
    } else {
      setCidades(data);
      if (data.length === 1) {
        const cidade = data[0];
        setSelectedCityId(cidade.cd_cidade);
        setNome(cidade.nome);
        setPopulacao(String(cidade.populacao));
        setSelectedCountry(String(cidade.id_pais));
      }
    }

    setLoading(false);
  }

  // 🔹 Atualizar cidade
  const updateCity = async () => {
    if (!selectedCityId) {
      Alert.alert('Erro', 'Busque uma cidade primeiro.');
      return;
    }

    if (!nome.trim() || !populacao.trim() || !selectedCountry) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de atualizar.');
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase
        .from('tb_cidades')
        .update({
          nome: nome.trim(),
          populacao: Number(populacao),
          id_pais: Number(selectedCountry),
        })
        .eq('cd_cidade', selectedCityId);

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
  const deleteCity = async () => {
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
              .from('tb_cidades')
              .delete()
              .eq('cd_cidade', selectedCityId);

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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#121212', padding: 20 }}>
      <Image style={styles.logo} source={require('./../assets/terra.jpg')} />
      <Text style={styles.title}>Busca e edição de cidades</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome da cidade"
        placeholderTextColor="#C0C0C0"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="População"
        placeholderTextColor="#C0C0C0"
        value={populacao}
        onChangeText={setPopulacao}
        keyboardType="numeric"
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

      <TouchableOpacity onPress={buscarCidades} style={styles.button}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={updateCity} style={styles.button}>
        <Text style={styles.buttonText}>Atualizar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={deleteCity} style={styles.button}>
        <Text style={styles.buttonText}>Deletar</Text>
      </TouchableOpacity>

      {saving && <ActivityIndicator size="large" color="#00d1b2" />}

      <FlatList
        data={cidades}
        keyExtractor={(item) => item.cd_cidade.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCityId(item.cd_cidade);
              setNome(item.nome);
              setPopulacao(String(item.populacao));
              setSelectedCountry(String(item.id_pais));
            }}>
            <View
              style={{
                backgroundColor: '#1e1e1e',
                padding: 12,
                borderRadius: 8,
                marginVertical: 6,
              }}>
              <Text style={{ color: '#00d1b2', fontSize: 16 }}>{item.nome}</Text>
              <Text style={{ color: '#ccc' }}>População: {item.populacao}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}
