export const Info = (google) => ({
  label: (marker, text) => {
    marker.setLabel({
      text,
      color: "white",
      fontSize: "15px",
      fontWeight: "bold",
    })
  },
  windows: (marker, el, map) => {
    const content = `
      <div>
        <h6>${el.name}</h6>
        <hr>
        <p><b>Dir</b>: ${el.address}</p>
        <p><b>Tiem</b>: ${el.service_time}</p>
        <p><b>Telf</b>: <a href="tel:+51 ${el.phone}">+51 ${el.phone}</a></p>
      </div> 
    `
    const infowindow = new google.maps.InfoWindow({
      content,
    })

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      })
    })
  },
})
