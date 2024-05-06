export const middle = (markersMap, map) => {
  let bounds = new google.maps.LatLngBounds()
  markersMap.forEach((marker) => {
    bounds.extend(marker.getPosition())
    map.fitBounds(bounds)
  })
}
