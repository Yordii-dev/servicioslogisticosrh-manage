<template>
  <div class="container">
    <RedirectInfo
      v-show="visibleRedirectInfo"
      :tittle="redirectInfoProps.tittle"
      :detail="redirectInfoProps.detail"
      :pageToReturn="redirectInfoProps.pageToReturn"
    />
    <RowBack pageName="handle"></RowBack>
    <p class="mt-3 text-secondary h6 sub-satus">{{ management.subStatus }}</p>
    <form ref="form" @submit.prevent="handleSubmit">
      <label class="h5">Foto de Local o Producto</label>
      <div @click="openCamera" class="camara mt-3 d-flex align-items-center">
        <i id="icon" class="fa-solid fa-camera m-auto"></i>
        <img id="img" class="d-none" alt="" />
      </div>
      <!-- Oculto, solo quiero su funcionalidad -->
      <input
        ref="importer"
        @change="takePhoto"
        id="importer"
        name="image"
        class="invisible"
        type="file"
        accept="image/*"
        capture="camera"
      />
      <div class="form-group mt-5">
        <label for="">Comentario</label>
        <input
          name="comment"
          v-model="evidence.comment"
          type="text"
          class="form-control"
          required
        />
      </div>
      <button
        :disabled="emptyEvidence"
        data-toggle="modal"
        data-target="#evidenceConfirmModal"
        class="btn-confirmar btn btn-primary w-100 flex-grow-1"
      >
        Enviar evidencia
      </button>
    </form>
    <EvidenceConfirmModal />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import RowBack from '@/components/RowBack.vue'
import EvidenceConfirmModal from '../components/modals/EvidenceConfirmModal.vue'
import { validateEvidencePage } from '../validations/validateEvidencePage'
import RedirectInfo from '@/components/RedirectInfo.vue'
import { loaderPage } from '@/helpers/loaderPage'

export default {
  components: { RowBack, EvidenceConfirmModal, RedirectInfo },
  data() {
    return {
      deliveryId: localStorage.getItem('deliveryId'),
      loadingSpinner: false,
      visibleRedirectInfo: false,
      redirectInfoProps: {},
    }
  },
  computed: {
    ...mapState(['management', 'evidence']),
    emptyEvidence() {
      return !this.evidence.image || this.evidence.comment == ''
    },
  },
  methods: {
    ...mapMutations([
      'setAppError',
      'setManagementHideHeader',
      'deleteEvidenceImage',
      'setEvidenceImage',
    ]),
    openCamera() {
      this.$refs.importer.click()
    },
    takePhoto() {
      const $camara = document.querySelector('.camara')
      const $importer = document.getElementById('importer')
      const $img = document.getElementById('img')
      const $icon = document.getElementById('icon')

      if ($importer.files.length == 0) return

      let image = $importer.files[0]

      $img.classList.remove('d-none')

      let reader = new FileReader()
      reader.addEventListener('load', (e) => {
        $img.src = e.target.result
      })
      reader.readAsDataURL(image)
      $camara.replaceChild($img, $icon)

      this.setEvidenceImage(image)
    },
  },

  async mounted() {
    let loader = loaderPage(this.$loading)
    this.deleteEvidenceImage()
    this.setManagementHideHeader(true)

    let { validate, pageToReturn } = await validateEvidencePage()
    if (validate.error) throw validate

    if (validate.status == 'fail') {
      this.visibleRedirectInfo = true
      this.redirectInfoProps = {
        tittle: validate.data.message,
        detail: validate.data.details,
        pageToReturn: pageToReturn,
      }
      loader.hide()
      return
    }

    if (!this.management.ACCESS_FORM[this.management.subStatus]) {
      loader.hide()
      this.$router.push({ name: 'handle' })
      return
    }
    loader.hide()
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
</style>
