<template>
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-display font-bold">Admin Dashboard</h1>
      <button
        v-if="!auth.isAuthenticated"
        @click="showLogin = !showLogin"
        class="text-sm text-brand-600 hover:text-brand-700 font-medium"
      >
        {{ showLogin ? 'Cancel' : 'Admin Login' }}
      </button>
      <button
        v-else
        @click="handleLogout"
        class="text-sm text-gray-500 hover:text-gray-700 font-medium"
      >
        Logout
      </button>
    </div>

    <div v-if="!auth.isAuthenticated && showLogin" class="max-w-md mx-auto mb-10">
      <form @submit.prevent="handleLogin" class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-lg font-bold mb-4">Login</h2>
        <div class="mb-4">
          <label for="login-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="login-email"
            v-model="loginForm.email"
            type="email"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>
        <div class="mb-4">
          <label for="login-password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="login-password"
            v-model="loginForm.password"
            type="password"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>
        <p v-if="loginError" class="text-red-600 text-sm mb-4">{{ loginError }}</p>
        <button
          type="submit"
          class="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-lg transition-colors"
        >
          Login
        </button>
      </form>
    </div>

    <template v-if="auth.isAuthenticated">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-100 rounded-lg">
              <CalendarDays class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Today's Reservations</p>
              <p class="text-3xl font-bold">{{ stats.todayReservations }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-100 rounded-lg">
              <DollarSign class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Today's Revenue</p>
              <p class="text-3xl font-bold">${{ stats.todayRevenue }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-brand-100 rounded-lg">
              <TrendingUp class="w-6 h-6 text-brand-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Available Items</p>
              <p class="text-3xl font-bold">{{ stats.popularItems }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">Upcoming Reservations</h2>
          <button @click="loadReservations" class="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Refresh
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="py-3 px-4 text-sm font-medium text-gray-500">Guest</th>
                <th class="py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th class="py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                <th class="py-3 px-4 text-sm font-medium text-gray-500">Guests</th>
                <th class="py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th class="py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="r in reservations"
                :key="r.id"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="py-3 px-4 font-medium">{{ r.name }}</td>
                <td class="py-3 px-4 text-gray-600">{{ r.date }}</td>
                <td class="py-3 px-4 text-gray-600">{{ r.time }}</td>
                <td class="py-3 px-4 text-gray-600">{{ r.guests }}</td>
                <td class="py-3 px-4">
                  <span
                    :class="[
                      'text-xs font-medium px-2 py-1 rounded-full',
                      r.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700',
                    ]"
                  >
                    {{ r.status }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <select
                    :value="r.status"
                    @change="updateStatus(r.id, ($event.target as HTMLSelectElement).value)"
                    class="text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:border-brand-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
              <tr v-if="reservations.length === 0">
                <td colspan="6" class="py-10 text-center text-gray-500">No reservations yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <div v-else-if="!showLogin" class="text-center py-20">
      <p class="text-gray-500">Log in to view the admin dashboard.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CalendarDays, DollarSign, TrendingUp } from 'lucide-vue-next';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';

interface Reservation {
  id: number;
  name: string;
  date: string;
  time: string;
  guests: number;
  status: string;
}

interface Stats {
  todayReservations: number;
  todayRevenue: number;
  popularItems: number;
}

const auth = useAuthStore();
const showLogin = ref(false);
const loginError = ref('');
const loginForm = ref({ email: '', password: '' });
const stats = ref<Stats>({ todayReservations: 0, todayRevenue: 0, popularItems: 0 });
const reservations = ref<Reservation[]>([]);

async function loadReservations() {
  try {
    const [statsRes, reservationsRes] = await Promise.all([
      axios.get('/api/admin/stats'),
      axios.get('/api/reservations'),
    ]);
    stats.value = statsRes.data;
    reservations.value = reservationsRes.data;
  } catch {
    // Not authenticated or server error
  }
}

async function handleLogin() {
  loginError.value = '';
  try {
    await auth.login(loginForm.value.email, loginForm.value.password);
    showLogin.value = false;
    await loadReservations();
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.data?.error) {
      loginError.value = e.response.data.error;
    } else {
      loginError.value = 'Login failed. Please try again.';
    }
  }
}

async function updateStatus(id: number, status: string) {
  try {
    await axios.patch(`/api/reservations/${id}/status`, { status });
    await loadReservations();
  } catch {
    // Handle error
  }
}

function handleLogout() {
  auth.logout();
  reservations.value = [];
  stats.value = { todayReservations: 0, todayRevenue: 0, popularItems: 0 };
}

onMounted(() => {
  if (auth.isAuthenticated) {
    loadReservations();
  }
});
</script>
