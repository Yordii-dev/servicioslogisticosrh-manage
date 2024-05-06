<template>
  <div class="container">
    <RowBack back="handle"></RowBack>

    <div class="items">
      <Item v-for="item in items" :key="item.id" :item="item"></Item>
    </div>

    <button
      v-if="VIEW_BUTTON_ITEM[status]"
      data-toggle="modal"
      data-target="#modalConfirmarGestionItems"
      class="btn-confirmar btn bg-primary w-100 flex-grow-1 text-white"
    >
      Finalizar
    </button>
    <ItemConfirm @error="emitError" />
    <ModifyItemModal
      @refresh="refresh"
      v-if="ACCESS_MODAL[status]"
      @error="emitError"
    />
    <div
      v-show="error != false"
      class="fixed-bottom alert-danger w-100 py-3 text-center"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
import RowBack from "@/components/RowBack.vue"
import Item from "@/components/Item.vue"
import ModifyItemModal from "../components/modals/ModifyItemModal.vue"
import ItemConfirm from "../components/modals/ItemConfirm.vue"

import { mapState } from "vuex"

export default {
  name: "ManagementItems",
  data() {
    return {
      deliveryId: localStorage.getItem("deliveryId"),
      items: [],
      error: false,

      ACCESS_MODAL: {
        "En Ruta": false,
        Entregado: false,
        "No Entregado": false,
        "Entrega Parcial": true,
        "Devoluciones Programadas": true,
      },
      VIEW_BUTTON_ITEM: {
        "En Ruta": true,
        Entregado: false,
        "No Entregado": true,
        "Entrega Parcial": true,
        "Devoluciones Programadas": true,
      },
    }
  },
  components: {
    RowBack,
    Item,
    ModifyItemModal,
    ItemConfirm,
  },
  computed: {
    ...mapState(["status"]),
  },

  methods: {
    async getItems() {
      try {
        const URL = `${process.env.VUE_APP_API}/deliveryItems/${this.deliveryId}`
        let res = await fetch(URL, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token_user"),
            },
          }),
          json = await res.json()

        return json
      } catch (error) {
        this.error = `Error al obtener items: ${error}`
      }
    },
    emitError(error) {
      this.error = `Error al confirmar en items: ${error}`
    },

    refresh() {
      const idDelivery = localStorage.getItem("selected-delivery")
      this.items = this.searchItemsByIdDelivery(idDelivery)
    },
    searchItemsByIdDelivery(idDelivery) {
      const deliveries = JSON.parse(localStorage.getItem("deliveries"))

      for (const delivery of deliveries) {
        if (delivery.id == idDelivery) {
          return delivery.compra.items
        }
      }
    },
  },
  async mounted() {
    let loader = this.$loading.show({
      // Optional parameters
      container: this.fullPage ? null : this.$refs.formContainer,
      canCancel: false,
      color: "rgb(27, 209, 155)",
      height: "40",
      onCancel: this.onCancel,
    })

    //Hidden Nav
    this.$store.state.hideNav = true
    const items = await this.getItems()
    if (typeof items === "undefined") return

    if (items !== null) {
      this.items = items
      console.log(items)
      loader.hide()
    }
  },
}
</script>
<style scoped>
.items {
  padding-top: 20px;
  padding-bottom: 80px;
  padding-right: 10px;
  height: 85vh !important;
  overflow-y: auto;
}
.btn-confirmar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 20px;
}
</style>
