const mongoose = require('mongoose')
let Schema = mongoose.Schema

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = 'mongodb://ville:TETETETE@ds145923.mlab.com:45923/mongoville'

mongoose.connect(url)

var PhoneNumberSchema = new Schema({
    name: String,
    number: String
});


    PhoneNumberSchema.statics.format = function format (phoneNumber) {
        console.log('at static format method:', this.name, this.number, this._id)
        console.log(this);
        return {            
            name: phoneNumber.name,
            number: phoneNumber.number,
            id: phoneNumber._id            
          }
      }
    
const PhoneNumber = mongoose.model('PhoneNumber', PhoneNumberSchema)
  
module.exports = PhoneNumber