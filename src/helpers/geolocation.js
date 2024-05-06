const Geolocation = () => ({
  watchPosition: (success) => {
    const n = navigator
    const error = (err) => {
      console.log(err)
    }

    n.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    })
  },

  actualPosition: async () => {
    return new Promise((res) => {
      const n = navigator

      const success = (position) => {
        res(position)
      }
      const error = (err) => {
        console.log(err)
      }

      n.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
    })
  },
})

export default Geolocation
