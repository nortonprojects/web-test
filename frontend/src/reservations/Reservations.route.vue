<template>
  <ReservationLayout>
    <template #modifiers>
      <router-link to="/reservations/settings">
        <v-btn rounded color="primary">
          Settings
        </v-btn>
      </router-link>
    </template>
    <template #content>
      <v-row>
        <v-col>
          <v-date-picker
            v-model="currentDate"
            landscape
            full-width
            :min="minDate"
            color="primary"
          ></v-date-picker>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="1" v-for="num in timeSlots" :key="num">
          <v-btn
            tile
            block
            max-width="100%"
            :color="getColor(num, item)"
            v-for="item in everyFifteen"
            :key="item"
            :disabled="isDisabled(num, item)"
            @click.stop="setupNewReservation(num, item)"
          >
            {{getLabel(num, item)}}
          </v-btn>
        </v-col>
      </v-row>
      <v-dialog
        v-model="dialog"
      >
        <ReservationsNewDialog
          :error="error"
          @save="saveReservation"
        />
      </v-dialog>
    </template>
  </ReservationLayout>
</template>

<script lang="ts">
import Vue from 'vue'

import ReservationLayout from './ReservationLayout.component.vue';
import ReservationsNewDialog from './ReservationsNew.dialog.vue';
import { formatTime, getReservations, saveReservation, getSettings } from './Reservation.service';

export default Vue.extend({
  components: {
    ReservationLayout,
    ReservationsNewDialog,
  },
  data() {
    return {
      reservations: [],
      settings: [],
      timeSlots: [...Array(24).keys()],
      everyFifteen: ['00', '15', '30', '45'],
      dialog: false,
      currentDate: new Date().toISOString().slice(0,10),
      minDate: new Date().toISOString().slice(0,10),
      currentReservation: {
        time: null,
        slotId: null,
      },
      error: '',
    }
  },
  async created() {
    const [reservations, settings] = await Promise.all([getReservations(), getSettings()]);
    this.reservations = [...reservations.data];
    this.settings = [...settings.data];
  },
  methods: {
    getLabel(hour, min) {
      return formatTime(hour, min);
    },
    getColor(hour, min) {
      const time = formatTime(hour, min);
      let color;
      this.settings.map((item) => {
        if(item.startTime <= time && item.endTime >= time) {
          color = 'primary';
          this.reservations.map(res => {
            if(res.time == time && this.currentDate == res.date) {
              if(res.reservations >= res.reservationLimit) {
                color = 'error';
              } else {
                color = 'success';
              }
            }
          });
        }
      });
      return color;
    },
    resetReservation() {
      this.currentReservation = {
        time: null,
        slotId: null,
        partySize: 0,
        name: '',
        email: '',
      };
    },
    setupNewReservation(hour, min) {
      this.dialog = true;
      let reset = false;
      const time = formatTime(hour, min);
      this.reservations.map(res => {
        if(res.time == time && this.currentDate == res.date) {
          if(res.reservations >= res.reservationLimit) {
            reset = true;
          }
          this.currentReservation.id = res.id;
        }
      })
      if(!this.currentReservation.id) {
        this.currentReservation.time = time;
      }
      if(reset) {
        this.resetReservation();
        this.dialog = false;
      }
    },
    isDisabled(hour, min) {
      const time = formatTime(hour, min);
      let disabled = true;
      this.settings.map((item) => {
        if(item.startTime <= time && item.endTime >= time) {
          disabled = false;
        }
      });
      return disabled;
    },

    async saveReservation({name, email, partySize}) {
      try {
        const res = await saveReservation({
          date: this.currentDate.replace(/-/g,'/'),
          ...this.currentReservation,
          name,
          email,
          partySize,
        });
        this.dialog = false;
        this.reservations.push(res);
      } catch(error) {
        this.error = error.response.data;
      }
    }
  }
});
</script>