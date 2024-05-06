export const Route = (originPosition, destinationPosition, map, google) => {
  const origin = new google.maps.Marker({
    position: originPosition,
    identificador: 'originPosition',
  })
  const destination = new google.maps.Marker({
    position: destinationPosition,
    identificador: 'destinationPosition',
  })
  let configDS = {
    origin: origin.getPosition(),
    destination: destination.getPosition(),

    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING,
  }

  let ds = new google.maps.DirectionsService()
  let dr = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: '#252525',
      strokeWeight: 4,
    },
    map,
    draggable: false,
    suppressMarkers: true,
    preserveViewport: true,
  })

  ds.route(configDS, (results, status) => {
    if (status == 'OK') {
      dr.setDirections(results)
    } else {
      console.log('ROUTE_ERROR: ', status)
    }
  })

  origin.addListener('position_changed', () => {
    configDS.origin = origin.getPosition()

    ds.route(configDS, (results, status) => {
      if (status == 'OK') {
        dr.setDirections(results)
      }
    })
  })
}
export default Route
