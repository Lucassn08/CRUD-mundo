import { StyleSheet } from "react-native";
import Constants from 'expo-constants';


const styles = StyleSheet.create({
  title:{
    alignSelf: 'center',
    fontSize: 22,
    marginBottom: 10,
  },
  pickerContainer: {
    width: '86%',
    alignSelf: 'center',
    padding: 3,
    borderRadius: 5,
    marginBottom: 14,
    backgroundColor: '#e5ecea',
  },
  select_input: {
    color: '#000', // texto branco
    fontSize: 16,
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor:"white"
  },
  input: {
    width:200,
    borderWidth: 1,    
    padding: 10,
    marginBottom: 10,
    backgroundColor:"#eeeeee"
  },
  logo: {
    height: 128,
    width: 128,
    borderWidth: 1,   
    borderRadius: 90,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#841584',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width:100
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default styles;