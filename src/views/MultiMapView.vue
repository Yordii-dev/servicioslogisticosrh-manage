<template>
  <div class="container">
    <RedirectInfo
      v-show="visibleRedirectInfo"
      :tittle="redirectInfoProps.tittle"
      :detail="redirectInfoProps.detail"
      :pageToReturn="redirectInfoProps.pageToReturn"
    />
    <RowBack pageName="deliveries"></RowBack>
    <ClientsMap />
  </div>
</template>
<script>
import RowBack from '../components/RowBack.vue'
import ClientsMap from '../components/maps/ClientsMap.vue'
import { validateMultimapPage } from '../validations/validateMultimapPage'
import RedirectInfo from '@/components/RedirectInfo.vue'
import { loaderPage } from '@/helpers/loaderPage'

export default {
  components: { RowBack, ClientsMap, RedirectInfo },

  data() {
    return {
      visibleRedirectInfo: false,
      redirectInfoProps: {},
    }
  },
  async mounted() {
    /*     ValidatePage(this.$router) */
    //Access control
    /*  this.coords = deliveries.map((el) => ({
      id: el.compra.cliente.id,
      lat: Number(el.compra.cliente.latitud),
      lng: Number(el.compra.cliente.longitud),
      name: el.compra.cliente.nombre,
      address: el.compra.cliente.direccion,
      status: el.gestion,
      service_time: el.tiempo_servicio,
      phone: el.compra.cliente.telefono,
    })) */

    let loader = loaderPage(this.$loading) //Loader desde validar
    let { validate, pageToReturn } = await validateMultimapPage()

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
    loader.hide()
  },
}
</script>
