<template>
  <!-- Modal Modify item-->
  <div
    class="modal fade"
    id="modifyModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-body">
          <div class="code">
            <span>Cód: {{ dataItem.id }}</span>
          </div>
          <div class="modify">
            <p class="h6">Entregados</p>
            <div class="quantity">
              <i class="fa-solid fa-circle-minus" @click="decrementGiven"></i>
              <div class="num">
                <span>{{ dataItem.given }} </span>
                <span>{{ dataItem.ordered }}</span>
              </div>
              <i class="fa-solid fa-circle-plus" @click="incrementGiven"></i>
            </div>
          </div>
        </div>
        <div class="d-flex w-100 justify-content-around">
          <button type="button" class="btn" data-dismiss="modal">Cerrar</button>
          <button
            type="button"
            class="btn text-primary"
            data-dismiss="modal"
            @click="deliveryItem"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex"
export default {
  data() {
    return {
      deliveryId: localStorage.getItem("deliveryId"),
    }
  },

  computed: {
    ...mapState(["dataItem"]),
  },
  methods: {
    ...mapMutations(["decrementGiven", "incrementGiven"]),

    async putDeliveryItems() {
      try {
        if (this.dataItem.given <= 0) return

        const URL = `${process.env.VUE_APP_API}/deliveryItems/${this.deliveryId}`
        let res = await fetch(URL, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token_user"),
            },
            body: JSON.stringify({
              cantidad: this.dataItem.given,
              idItem: this.dataItem.id,
            }),
          }),
          json = await res.json()
        return json
      } catch (error) {
        this.$emit("error", error)
      }
    },
    async deliveryItem() {
      let loader = this.$loading.show({
        // Optional parameters
        container: false,
        canCancel: false,
        backgroundColor: "#ececec",
        color: "rgb(27, 209, 155)",
        height: "25",

        onCancel: false,
      })

      let deliveryItem = await this.putDeliveryItems()
      console.log(deliveryItem)
      if (typeof deliveryItem === "undefined") return
      if (deliveryItem !== null) {
        loader.hide()
        location.reload()
      }
    },
  },
}
</script>
<style scoped>
.quantity .digit {
  color: rgb(31, 5, 102);
  font-weight: bold;
}

.modify {
  background-color: #d0d7df;
}

.modify > p {
  padding-top: 8px;
  margin: 10px !important;
}

.quantity {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.quantity i {
  color: #498095;
  cursor: pointer;
  font-size: 40px;
}

.num {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  flex-grow: 0.25;
  height: 80px;
  margin-bottom: 10px;
}

.num span:nth-child(1) {
  color: #498095;
  font-size: 30px;
}
</style>
