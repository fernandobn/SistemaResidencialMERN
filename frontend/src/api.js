import axios from 'axios';

// Crear una instancia de Axios configurada
const API = axios.create({
  baseURL: import.meta.env.VITE_API_UR, // Utiliza la variable de entorno
});

export default API;
