import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ Ahora debería funcionar
});

console.log("🔥 API BASE URL:", import.meta.env.VITE_API_URL);

export default API;
