<template>
  <div class="container">
    <RowBack back="management"></RowBack>
    <div class="mt-3">
      <p class="text-secondary h6 sub-satus">{{ $store.state.subStatus }}</p>
      <span class="h5">Foto de Local o Producto</span>
      <div @click="activeCamara" class="camara mt-3 d-flex align-items-center">
        <i id="icon" class="fa-solid fa-camera m-auto"></i>
        <img id="img" class="d-none" alt="" />
      </div>
      <div class="form-group mt-5">
        <label for="">Comentario</label>
        <input v-model="comentario" type="text" class="form-control" />
      </div>
      <button
        @click="sendEvidence"
        class="btn-confirmar btn bg-primary w-100 flex-grow-1 text-white"
      >
        Finalizar
      </button>
    </div>

    <!-- Oculto, solo quiero su funcionalidad -->
    <input
      @change="loadCapture"
      id="importer"
      class="invisible"
      type="file"
      accept="image/*"
      capture="camera"
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
export default {
  components: { RowBack },
  data() {
    return {
      filePhoto: null,
      comentario: "",
      idEntrega: localStorage.getItem("selected-delivery"),
      error: false,
    }
  },
  methods: {
    activeCamara() {
      const $importer = document.getElementById("importer")
      $importer.click()
    },
    loadCapture() {
      const $camara = document.querySelector(".camara")
      const $importer = document.getElementById("importer")
      const $img = document.getElementById("img")
      const $icon = document.getElementById("icon")

      if ($importer.files.length == 0) return

      this.filePhoto = $importer.files[0]

      $img.file = this.filePhoto
      $img.classList.remove("d-none")

      let reader = new FileReader()
      reader.addEventListener("load", (e) => {
        $img.src = e.target.result
      })
      reader.readAsDataURL(this.filePhoto)
      $camara.replaceChild($img, $icon)
    },
    async sendPhoto(file) {
      try {
        const URL = `${process.env.VUE_APP_API}/evidence/${this.comentario}/${this.idEntrega}`

        let fData = new FormData()
        fData.append("file", file)

        let res = await fetch(URL, {
            method: "POST",
            body: fData,
          }),
          json = await res.json()
        return json
      } catch (error) {
        this.error = `Error al enviar evidencias: ${error}`
      }
    },
    async sendEvidence() {
      const $img = document.getElementById("img")

      if ($img.src == "" || this.comentario == "") {
        alert("Por favor, completar datos de evidencia!")
        return
      }

      let loader = this.$loading.show({
        // Optional parameters
        container: false,
        canCancel: false,
        color: "rgb(27, 209, 155)",
        height: "40",
        onCancel: this.onCancel,
      })

      let sentPhoto = await this.sendPhoto(this.filePhoto)
      if (!sentPhoto) return

      if (sentPhoto.affectedRows >= 1) {
        let idDelivery = Number(this.idEntrega)
        let deliveries = JSON.parse(localStorage.getItem("deliveries"))

        for (const delivery of deliveries) {
          if (delivery.id == idDelivery) {
            delivery.evidencia = true
            break
          }
        }
        localStorage.setItem("deliveries", JSON.stringify(deliveries))

        this.$router.push({ name: `handle` })
      }
      loader.hide()
    },
  },

  mounted() {
    //Hidden Nav
    this.$store.state.hideNav = true
  },
}
</script>

<style scoped>
.container {
  height: 100vh;
}
.btn-confirmar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 20px;
}
.camara {
  height: 300px;
  background-color: rgb(231, 231, 231);
  cursor: pointer;
}

.camara i {
  font-size: 70px;
  color: gray;
}

.camara span {
  font-style: italic;
}

.camara img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}
.comentario span:nth-child(1) {
  font-style: italic;
}
.comentario input {
  border: none;
  border-bottom: 1px solid rgb(185, 185, 185);
  outline: none;
}

.botones a {
  background-color: rgb(255, 153, 1);
}
</style>
