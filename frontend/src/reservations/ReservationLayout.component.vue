<template>
  <div>
    <v-app-bar app clipped-left>
      <router-link v-if="parent" :to="parent">
        <v-btn rounded color="primary" class="mr-2">
          Back
        </v-btn>
      </router-link>
      <v-toolbar-title>{{$route.name || 'Jacob\'s Good Reservation System'}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <slot name="modifiers"></slot>
    </v-app-bar>
    <v-main>
      <v-container>
        <slot name="content"></slot>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    parent: String
  }
})
</script>
