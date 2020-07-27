// Args
exports.required = ['time', 'timezone']

// Define
exports.isDST = function (time) {
  const today = new Date(time)
  const month = today.getMonth()
  const dow = today.getDay()
  const day = today.getDate()
  const hours = today.getHours()
  if (month < 2 || month > 10) {
    return false
  }
  if (month > 2 && month < 10) {
    return true
  }
  if (dow === 0) {
    if (month === 2) {
      if (day >= 8 && day <= 14) {
        return hours >= 2
      }
    } else if (month === 10) {
      if (day >= 1 && day <= 7) {
        return hours < 2
      }
    }
  }
  const previousSunday = day - dow
  if (month === 2) {
    return previousSunday >= 8
  }
  return previousSunday <= 0
}

exports.func = function (args) {
  const time = args.time
  const timezone = args.timezone
  return new Date(time + ' ' + timezone.substring(0, 1) + (exports.isDST(time) ? 'D' : 'S') + timezone.substring(1))
}
