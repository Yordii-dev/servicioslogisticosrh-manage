import { createRouter, createWebHistory } from "vue-router"
import LoginView from "../views/LoginView.vue"
import RouteView from "../views/RouteView.vue"

import DeliveriesView from "../views/DeliveriesView.vue"
import MultiMapView from "../views/MultiMapView.vue"

import ManagementView from "../views/ManagementView.vue"
import HandleView from "../views/HandleView.vue"
import ItemsView from "../views/ItemsView.vue"
import InfoView from "../views/InfoView.vue"
import SingleMapView from "../views/SingleMapView.vue"

import FormView from "../views/FormView.vue"

const routes = [
  {
    path: "/",
    name: "",
    component: LoginView,
  },

  {
    path: "/route",
    name: "route",
    component: RouteView,
  },
  {
    path: "/deliveries",
    name: "deliveries",
    component: DeliveriesView,
  },
  {
    path: "/multiMap",
    name: "multiMap",
    component: MultiMapView,
  },
  {
    path: "/management",
    name: "management",
    component: ManagementView,
    children: [
      {
        path: "handle",
        name: "handle",
        component: HandleView,
      },
      {
        path: "info",
        name: "info",
        component: InfoView,
      },
      {
        path: "items",
        name: "items",
        component: ItemsView,
      },
      {
        path: "singleMap",
        name: "singleMap",
        component: SingleMapView,
      },
      {
        path: "form",
        name: "form",
        component: FormView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
