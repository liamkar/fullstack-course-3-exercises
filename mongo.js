const mongoose = require('mongoose')

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
//const url = 'mongodb://fullstack:sekred@ds211088.mlab.com:11088/fullstack-notes'
const url = 'mongodb://ville:THEPASSU@ds145923.mlab.com:45923/mongoville'

mongoose.connect(url)

//let readParamOne = "TODO1";
//let readParamTwo = "TODO02";

let readParamOne = process.argv[2]; 
let readParamTwo = process.argv[3]; 

 
const PhoneNumber = mongoose.model('PhoneNumber', {
  name: String,
  number: String  
})

const phoneNumber = new PhoneNumber({
    name: readParamOne,
    number: readParamTwo
})

if (readParamOne === undefined && readParamTwo === undefined) {

    PhoneNumber
  .find({})
  .then(result => {
    result.forEach(phoneNumber => {
      console.log(phoneNumber)
    })
    mongoose.connection.close()
  })

}
else {



phoneNumber
  .save()
  .then(response => {
    console.log('phoneNumber saved!')
    mongoose.connection.close()
  })

}
