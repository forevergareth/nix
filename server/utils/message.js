const moment = require('moment')

let makeMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  }
}

let makeLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createdAt: moment().valueOf()
  }
}


module.exports = {makeMessage, makeLocationMessage}