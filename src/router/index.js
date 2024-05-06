import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RouteView from '../views/RouteView.vue'

import DeliveriesView from '../views/DeliveriesView.vue'
import MultiMapView from '../views/MultiMapView.vue'

import ManagementView from '../views/ManagementView.vue'
import HandleView from '../views/HandleView.vue'
import OrdersView from '../views/OrdersView.vue'
import InfoView from '../views/InfoView.vue'
import SingleMapView from '../views/SingleMapView.vue'

import EvidenceView from '../views/EvidenceView.vue'

const routes = [
  {
    path: '/:userId?',
    name: 'login',
    component: LoginView,
  },

  {
    path: '/route',
    name: 'route',
    component: RouteView,
  },
  {
    path: '/deliveries',
    name: 'deliveries',
    component: DeliveriesView,
  },
  {
    path: '/multiMap',
    name: 'multiMap',
    component: MultiMapView,
  },
  {
    path: '/management',
    name: 'management',
    component: ManagementView,
    children: [
      {
        path: '',
        name: '',
        component: HandleView,
      },
      {
        path: 'handle',
        name: 'handle',
        component: HandleView,
      },
      {
        path: 'orders',
        name: 'orders',
        component: OrdersView,
      },
      {
        path: 'evidence',
        name: 'evidence',
        component: EvidenceView,
      },
      {
        path: 'info',
        name: 'info',
        component: InfoView,
      },
      {
        path: 'singleMap',
        name: 'singleMap',
        component: SingleMapView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
