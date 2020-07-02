<template>
  <ReservationLayout parent="/reservations">
    <template #content>
      <v-row>
        <v-col cols="6">
          <v-btn rounded color="success" @click="saveConfiguration(settings)">
            Save Configuration
          </v-btn>
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
            @click.stop="changeSetting(num, item)"
          >
            {{getLabel(num, item)}}
          </v-btn>
        </v-col>
      </v-row>
      <v-dialog
        v-model="dialog"
      >
        <v-card class="pa-4">
          <v-card-title class="headline">Available Reservations</v-card-title>
          <v-text-field
            type="number"
            v-model="availableReservations"
          ></v-text-field>
          <v-card-actions>
            <v-btn
              color="success"
              @click.stop="setSetting(changeStart, changeEnd, availableReservations); dialog = false"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </ReservationLayout>
</template>

<script lang="ts">
import Vue from 'vue'
import ReservationLayout from './ReservationLayout.component.vue';
import { getSettings, saveSettings, formatTime } from './Reservation.service';

export default Vue.extend({
  components: {
    ReservationLayout,
  },
  data() {
    return {
      settings: [],
      timeSlots: [...Array(24).keys()],
      everyFifteen: ['00', '15', '30', '45'],
      changeStart: 0,
      changeEnd: 0,
      dialog: false,
      availableReservations: 0,
    };
  },
  async created() {
    const settings = await getSettings();
    this.settings = [...settings.data];
  },
  methods: {
    saveConfiguration: settings => saveSettings(settings),
    changeSetting(hour, minute) {
      if(this.changeStart) {
        this.changeEnd = formatTime(hour, minute);
        this.dialog = true;
      } else {
        this.changeStart = formatTime(hour, minute);
      }
    },
    setSetting(startTime, endTime, availableReservations){
      this.changeStart = 0;
      this.changeEnd = 0;
      this.availableReservations = 0;
      availableReservations = parseInt(availableReservations);
      this.settings.push({
        startTime, endTime, availableReservations,
      });
      this.$forceUpdate();
    },
    getColor(hour, min) {
      const time = formatTime(hour, min);
      let color = '';
      this.settings.map(item => {
        if(item.startTime <= time && item.endTime >= time) {
          color = 'primary';
        }
      })
      return color;
    },
    getLabel(hour, min) {
      const time = formatTime(hour, min);
      let label = time;
      this.settings.map(item => {
        if(item.startTime < time && item.endTime > time) {
          label = item.availableReservations;
        }
      })
      return label
    }
  },
});
</script>