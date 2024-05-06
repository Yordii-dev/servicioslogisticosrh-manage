export const Geolocation = (google) => ({
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
        let coord = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        )

        res(coord)
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
