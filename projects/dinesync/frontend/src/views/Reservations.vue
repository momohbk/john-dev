<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <h1 class="text-4xl font-display font-bold text-center mb-4">Make a Reservation</h1>
    <p class="text-gray-600 text-center mb-10">
      Book your table at DineSync for an unforgettable dining experience.
    </p>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            id="date"
            v-model="form.date"
            type="date"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
          />
        </div>
        <div>
          <label for="time" class="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <select
            id="time"
            v-model="form.time"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
          >
            <option value="">Select time</option>
            <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div>
          <label for="guests" class="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
          <input
            id="guests"
            v-model.number="form.guests"
            type="number"
            min="1"
            max="20"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
          />
        </div>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
          />
        </div>
        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            required
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-shadow"
          />
        </div>
      </div>

      <div class="mt-6">
        <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
        <textarea
          id="notes"
          v-model="form.notes"
          rows="3"
          placeholder="Allergies, dietary restrictions, special occasions..."
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none transition-shadow"
        ></textarea>
      </div>

      <button
        type="submit"
        :disabled="submitting"
        class="mt-6 w-full bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {{ submitting ? 'Submitting...' : 'Confirm Reservation' }}
      </button>

      <p v-if="submitted" class="mt-4 text-center text-green-600 font-medium">
        Reservation submitted successfully! We'll confirm shortly.
      </p>
      <p v-if="error" class="mt-4 text-center text-red-600 font-medium">
        {{ error }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import axios from 'axios';

const timeSlots = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
];

const form = reactive({
  date: '',
  time: '',
  guests: 2,
  name: '',
  email: '',
  phone: '',
  notes: '',
});

const submitting = ref(false);
const submitted = ref(false);
const error = ref('');

async function handleSubmit() {
  submitting.value = true;
  error.value = '';
  submitted.value = false;

  try {
    await axios.post('/api/reservations', form);
    submitted.value = true;
    form.date = '';
    form.time = '';
    form.guests = 2;
    form.name = '';
    form.email = '';
    form.phone = '';
    form.notes = '';
  } catch (e) {
    if (axios.isAxiosError(e) && e.response?.data?.error) {
      error.value = e.response.data.error;
    } else {
      error.value = 'Failed to submit reservation. Please try again.';
    }
  } finally {
    submitting.value = false;
  }
}
</script>
