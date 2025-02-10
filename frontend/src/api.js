import axios from 'axios';

// Crear una instancia de Axios configurada
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Asegúrate de que esta URL sea correcta
});

export default API;
