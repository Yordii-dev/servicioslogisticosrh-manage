import { createStore } from "vuex"
import { VuexPersistence } from "vuex-persist"
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
})

export default createStore({
  state: {
    dataItem: {
      id: 0,
      given: 0,
      ordered: 0,
    },
    hideNav: false,
    status: "En Ruta",
    subStatus: "Seleccionar sub estado",

    COLOR: {
      "En Ruta": "#007bff",
      Entregado: "rgb(27, 209, 155)",
      "No Entregado": "red",
      "Entrega Parcial": "#ffc300",
      "Devoluciones Programadas": "#630ADC",
    },
    SUB_STATUS: {
      "En Ruta": [],
      Entregado: [],
      "No Entregado": [
        "TEL01: Local Cerrado",
        "TEL02: Sin Dinero",
        "TEL04: Ausente",
        "TEL05: No hizo pedido",
        "TEL06: Por precio de producto",
        "TEL07: Direccion errada",
        "TEL08: Vencimiento cercano",
        "TEL09: Mercaderia deteriorada",
        "TEL10: Asalto/Robo",
        "TEL11: Fuera de horario",
        "TEL12: Fallas Mecanicas",
        "TEL13: Error de picking",
        "TEL14: Falta de Tiempo",
        "TEL15: Por cambios",
        "TEL16: Exceso de Tiempo de Espera",
        "TEL17: Error de Sistema",
        "TEL18: Error de Geoposicion",
        "TEL19: Error toma de pedido",
      ],
      "Entrega Parcial": [
        "TEL01: Error toma de pedido",
        "TEL02: Por precio de producto",
        "TEL03: Vencimiento cerano",
        "TEL04: Mercaderia deteriorada",
        "TEL05: Error de picking",
        "TEL06: Por cambios",
      ],
      "Devoluciones Programadas": [
        "Recojo completo",
        "Recojo parcial",
        "Recojo no efectuado",
      ],
    },
    ACCESS_FORM: {
      "TEL01: Local Cerrado": true,
      "TEL19: Error toma de pedido": true,
    },
  },
  getters: {},
  mutations: {
    setStatus(state, status) {
      state.status = status
      state.subStatus = "Seleccionar sub estado"
    },
    setSubStatus(state, subStatus) {
      state.subStatus = subStatus
    },

    setDatatItem(state, datatItem) {
      state.dataItem = datatItem
    },

    incrementGiven(state) {
      if (state.dataItem.given < state.dataItem.ordered) {
        state.dataItem.given++
      }
    },
    decrementGiven(state) {
      if (state.dataItem.given > 0) {
        state.dataItem.given--
      }
    },
  },
  actions: {},

  plugins: [vuexLocal.plugin],
})
