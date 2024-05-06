export const route = (origin, destination, map, google) => {
  let configDS = {
    origin: origin.getPosition(),
    destination: destination.getPosition(),
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING,
  }

  let ds = new google.maps.DirectionsService()
  let dr = new google.maps.DirectionsRenderer({
    map,
    draggable: true,
    suppressMarkers: true,
    preserveViewport: true,
  })

  ds.route(configDS, (results, status) => {
    if (status == "OK") {
      dr.setDirections(results)
    } else {
      console.log("ROUTE_ERROR: ", status)
    }
  })

  origin.addListener("position_changed", () => {
    configDS.origin = origin.getPosition()

    ds.route(configDS, (results, status) => {
      if (status == "OK") {
        dr.setDirections(results)
      }
    })
  })
}
