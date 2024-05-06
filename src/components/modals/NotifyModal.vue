<template>
  <div
    class="modal fade"
    id="modalNotify"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalCenterTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <form class="modal-content" @submit.prevent="sendMessage">
        <div class="modal-header">
          <div class="d-flex align-items-center">
            <span>Notificando a: </span>
            <span class="number-phone mx-2 px-2 py-1 rounded">{{ phone }}</span>
          </div>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="font-weight-bold">ATENCION:</label>

            <div class="custom-control custom-radio">
              <input
                id="atencion1"
                type="radio"
                class="form-check-input"
                value="Estimado Cliente; Llego su pedido solicitado"
                name="sms"
                v-model="sms"
              />
              <label class="form-check-label" for="atencion1">
                Estimado Cliente; Llego su pedido solicitado</label
              >
            </div>
            <div class="custom-control custom-radio">
              <input
                type="radio"
                v-model="sms"
                id="atencion2"
                name="sms"
                value="Buenos dias; A que hora regresara para poder realizar la entrega de sus productos"
                class="form-check-input"
              />
              <label class="form-check-label" for="atencion2"
                >Buenos dias; A que hora regresara para poder realizar la
                entrega de sus productos</label
              >
            </div>
          </div>

          <div class="form-group">
            <label class="font-weight-bold">CLASIFICACION:</label>
            <label class=""
              >Estimado Cliente; Como calificaria mi servicio ofrecido</label
            >
            <div class="custom-control custom-radio">
              <input
                type="radio"
                v-model="sms"
                id="clasificacion1"
                name="sms"
                value="bueno"
                class="form-check-input"
              />
              <label class="form-check-label" for="clasificacion1">
                BUENO</label
              >
            </div>
            <div class="custom-control custom-radio">
              <input
                type="radio"
                v-model="sms"
                id="clasificacion2"
                name="sms"
                value="malo"
                class="form-check-input"
              />
              <label class="form-check-label" for="clasificacion2">MALO</label>
            </div>
            <div class="custom-control custom-radio">
              <input
                type="radio"
                v-model="sms"
                id="clasificacion3"
                name="sms"
                value="regular"
                class="form-check-input"
              />
              <label class="form-check-label" for="clasificacion3"
                >REGULAR</label
              >
            </div>
            <div class="custom-control custom-radio">
              <input
                type="radio"
                v-model="sms"
                id="clasificacion4"
                name="sms"
                value="satisfecho"
                class="form-check-input"
              />
              <label class="form-check-label" for="clasificacion4"
                >SATISFECHO</label
              >
            </div>
            <div class="custom-control custom-radio">
              <input
                type="radio"
                v-model="sms"
                id="clasificacion5"
                name="sms"
                value="insatisfecho"
                class="form-check-input"
              />
              <label class="form-check-label" for="clasificacion5"
                >INSATISFECHO</label
              >
            </div>
          </div>
          <div class="form-group">
            <label class="font-weight-bold">DESPEDIDA:</label>

            <div class="custom-control custom-radio">
              <input
                type="radio"
                v-model="sms"
                id="despedida1"
                name="sms"
                value=" Hasta otra oportunidad; Esperemos haya sido de su agrado la atencion brindada"
                class="form-check-input"
              />
              <label class="form-check-label" for="despedida1">
                Hasta otra oportunidad; Esperemos haya sido de su agrado la
                atencion brindada</label
              >
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Enviar mensaje</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">
            Cancelar
          </button>
        </div>
      </form>
    </div>
    <div
      v-show="error != false"
      class="fixed-bottom alert-danger w-100 py-3 text-center"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      idDelivery: localStorage.getItem("selected-delivery"),
      phone: "",
      sms: "Estimado Cliente; Llego su pedido solicitado",

      error: false,
    }
  },
  methods: {
    /*     searchInfoByIdDelivery(idDelivery) {
      const deliveries = JSON.parse(localStorage.getItem("deliveries"))

      for (const delivery of deliveries) {
        if (delivery.id == idDelivery) {
          return delivery
        }
      }
    }, */
    async sendMessage() {
      let loader = this.$loading.show({
        // Optional parameters
        container: false,
        canCancel: false,
        backgroundColor: "#ececec",
        color: "rgb(27, 209, 155)",
        height: "25",

        onCancel: false,
      })

      try {
        const URL = `${process.env.VUE_APP_API}/sms`

        let res = await fetch(URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: this.phone,
              sms: this.sms,
            }),
          }),
          json = await res.json()

        if (json.status == 200) {
          alert("Mensaje enviado!!")
        } else {
          alert("Error al enviar mensaje!!")
        }
        loader.hide()
      } catch (error) {
        this.error = `Error al enviar sms: ${error}`
      }
    },
  },
  mounted() {
    /*   const info = this.searchInfoByIdDelivery(this.idDelivery)
    this.phone = "+51 " + info.compra.cliente.telefono */
  },
}
</script>
<style scoped>
.number-phone {
  background: rgb(238, 238, 238);
}

.text-small {
  font-size: 12px;
}
</style>
