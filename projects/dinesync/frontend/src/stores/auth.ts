import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('dinesync_token'));

  const isAuthenticated = computed(() => !!token.value);

  function setAuth(t: string, u: User) {
    token.value = t;
    user.value = u;
    localStorage.setItem('dinesync_token', t);
    axios.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  }

  async function login(email: string, password: string) {
    const response = await axios.post('/api/auth/login', { email, password });
    setAuth(response.data.token, response.data.user);
    return response.data;
  }

  async function register(name: string, email: string, password: string) {
    const response = await axios.post('/api/auth/register', { name, email, password });
    setAuth(response.data.token, response.data.user);
    return response.data;
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('dinesync_token');
    delete axios.defaults.headers.common['Authorization'];
  }

  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  return { user, token, isAuthenticated, login, register, logout };
});
