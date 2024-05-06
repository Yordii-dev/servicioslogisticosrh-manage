export const getNext = (customers) => {
  //Only Un Manageds
  customers = customers.filter((el) => !el.status)

  //Only With coors
  customers = customers.filter((el) => el.lng != 0)

  let minTime = Math.min(...customers.map((el) => el.service_time))

  let next = customers.find((el) => el.service_time == minTime)

  return next
}
