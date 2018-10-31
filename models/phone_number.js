const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://ville:TETETETET@ds145923.mlab.com:45923/mongoville'

mongoose.connect(url)

const PhoneNumber = mongoose.model('PhoneNumber', {
  name: String,
  number: String  
})

module.exports = PhoneNumber