import axios from 'axios';

const GET = 'get', POST = 'post', PUT = 'put';
const API = {
  reservations: {
    url: 'reservations',
    methods: [GET, POST, PUT],
  },
  restaurant: {
    url: '',
    methods: [GET],
  },
  reservationSettings: {
    url: 'reservation-settings',
    methods: [GET, PUT],
  },
}

async function apiCall(call, method, data = null) {
  return await axios({
    baseURL: `http://localhost:9090/restaurants/8`,
    url: call,
    method: method,
    data,
  });
}

export async function saveSettings(settings) {
  return await apiCall(API.reservationSettings.url, PUT, settings);
}

export async function getSettings() {
  return await apiCall(API.reservationSettings.url, GET);
}

export async function getReservations() {
  return await apiCall(API.reservations.url, GET);
}

export async function saveReservation(reservation) {
  return reservation.id ?
    await apiCall(`${API.reservations.url}/${reservation.id}`, PUT, reservation) :
    await apiCall(API.reservations.url, POST, reservation);
}

export function formatTime(hour, minute) {
  const str = `${('0' + (hour+1))}`;
  return `${str.substr(str.length-2)}:${minute}`;
}