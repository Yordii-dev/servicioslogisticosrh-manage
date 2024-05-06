import { createStore } from 'vuex'
import { VuexPersistence } from 'vuex-persist'
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
})

export default createStore({
  state: {
    appError: '',
    management: {
      hideHeader: false,
      activeTab: 'gestion',
      status: 'En Ruta',
      subStatus: 'Seleccionar sub estado',
      COLOR: {
        'En Ruta': '#007bff',
        Entregado: 'rgb(27, 209, 155)',
        'No Entregado': 'red',
        'Entrega Parcial': '#ffc300',
        'Devoluciones Programadas': '#630ADC',
      },
      SUB_STATUS: {
        'En Ruta': [],
        Entregado: [],
        'No Entregado': [
          'TEL01: Local Cerrado',
          'TEL02: Sin Dinero',
          'TEL04: Ausente',
          'TEL05: No hizo pedido',
          'TEL06: Por precio de producto',
          'TEL07: Direccion errada',
          'TEL08: Vencimiento cercano',
          'TEL09: Mercaderia deteriorada',
          'TEL10: Asalto/Robo',
          'TEL11: Fuera de horario',
          'TEL12: Fallas Mecanicas',
          'TEL13: Error de picking',
          'TEL14: Falta de Tiempo',
          'TEL15: Por cambios',
          'TEL16: Exceso de Tiempo de Espera',
          'TEL17: Error de Sistema',
          'TEL18: Error de Geoposicion',
          'TEL19: Error toma de pedido',
        ],
        'Entrega Parcial': [
          'TEL01: Error toma de pedido',
          'TEL02: Por precio de producto',
          'TEL03: Vencimiento cerano',
          'TEL04: Mercaderia deteriorada',
          'TEL05: Error de picking',
          'TEL06: Por cambios',
        ],
        'Devoluciones Programadas': [
          'Recojo completo',
          'Recojo parcial',
          'Recojo no efectuado',
        ],
      },
      ACCESS_FORM: {
        'TEL01: Local Cerrado': true,
        'TEL19: Error toma de pedido': true,
      },
    },
    handle: {},
    info: {},
    singleMap: {},
    orders: {
      orderData: {
        id: null,
        itemId: null,
        given: null,
        amount: null,
      },
    },
    evidence: {
      image: null,
      comment: '',
    },
  },
  getters: {},
  mutations: {
    setAppError(state, appError) {
      state.appError = appError
    },
    //Management
    setManagementHideHeader(state, isHidden) {
      state.management.hideHeader = isHidden
    },
    setManagementActiveTab(state, tab) {
      state.management.activeTab = tab
    },
    setManagementStatus(state, status) {
      state.management.status = status
      state.management.subStatus = 'Seleccionar sub estado'
    },
    setManagementSubStatus(state, subStatus) {
      state.management.subStatus = subStatus
    },

    //Orders
    setOrderData(state, data) {
      state.orders.orderData = data
    },

    //Evidence
    setEvidenceImage(state, image) {
      state.evidence.image = image
    },
    deleteEvidenceImage(state) {
      state.evidence.image = null
    },

    //Los unicos que faltan arreglar
    incrementGiven(state) {
      if (state.orders.orderData.given < state.orders.orderData.amount) {
        state.orders.orderData.given++
      }
    },
    decrementGiven(state) {
      if (state.orders.orderData.given > 0) {
        state.orders.orderData.given--
      }
    },
  },
  actions: {},

  plugins: [vuexLocal.plugin],
})
