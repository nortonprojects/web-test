import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { Reservations, Settings } from '../reservations';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: 'reservations',
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: Reservations,
  },
  {
    path: '/reservations/settings',
    name: 'Reservation Settings',
    component: Settings,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
