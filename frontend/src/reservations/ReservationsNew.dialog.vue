<template>
  <v-card class="pa-4">
    <v-card-title class="headline">New Reservation</v-card-title>
    <v-alert type="error" v-if="error">
      {{error}}
    </v-alert>
    <v-text-field
      type="text"
      placeholder="Name"
      v-model="name"
    ></v-text-field>
    <v-text-field
      type="email"
      placeholder="Email"
      v-model="email"
    ></v-text-field>
    <v-select
      placeholder="Party Size"
      v-model="partySize"
      :items="partySizes"
    ></v-select>
    <v-card-actions>
      <v-btn
        color="success"
        @click.stop="saveReservation"
      >
        Save Reservation
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    error: String,
  },
  data() {
    return {
      name: '',
      email: '',
      partySize: 0,
      partySizes: [...Array(16).keys()].map(item => item + 1),
    };
  },
  methods: {
    saveReservation() {
      this.$emit('save', {
        name: this.name,
        email: this.email,
        partySize: this.partySize
      });
    }
  }
})
</script>