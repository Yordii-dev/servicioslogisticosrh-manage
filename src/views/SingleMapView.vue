<template>
  <div class="container">
    <RedirectInfo
      v-show="visibleRedirectInfo"
      :tittle="redirectInfoProps.tittle"
      :detail="redirectInfoProps.detail"
      :pageToReturn="redirectInfoProps.pageToReturn"
    />
    <RowBack pageName="info"></RowBack>
    <ClientMap></ClientMap>
  </div>
</template>
<script>
import RowBack from '@/components/RowBack.vue'
import ClientMap from '../components/maps/ClientMap.vue'
import { mapMutations } from 'vuex'
import { loaderPage } from '@/helpers/loaderPage'
import { validateSinglemapPage } from '../validations/validateSinglemapPage'
import RedirectInfo from '@/components/RedirectInfo.vue'

export default {
  components: { ClientMap, RowBack, RedirectInfo },
  data() {
    return {
      visibleRedirectInfo: false,
      redirectInfoProps: {},
    }
  },
  methods: {
    ...mapMutations(['setManagementHideHeader']),
  },
  async mounted() {
    let loader = loaderPage(this.$loading) //Loader desde validar
    this.setManagementHideHeader(true)
    let { validate, pageToReturn } = await validateSinglemapPage()
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
