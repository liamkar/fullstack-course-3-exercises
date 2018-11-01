const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
var assert = require('assert');

const PhoneNumber = require('./models/phone_number')

app.use(express.static('build'))

app.use(cors())

morgan.token('dump_res', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :dump_res :res[content-length] - :response-time ms'))

app.use(bodyParser.json())

/*
let persons  = [
	{
		name: "Arto Hellas",
		number: "040-55545",
		id: 1
	},
	{
		name: "Matti Tienari",
		number: "040-665756",
		id: 2
	},
	{
		name: "Arto Järvinen",
		number: "040-8887772",
		id: 3
	},
	{
		name: "Lea Kutvonen",
		number: "066-6663456",
		id: 4
	}
]
*/

const URL_BASE = '/api/'

app.get(`${URL_BASE}persons/:id`, (request, response) => {
  const id = request.params.id
  console.log('id to be used to search for phonenumber:',id)
  
   PhoneNumber
   .findById(id)
   .then(result => {
     console.log('phonenumber we found:',result)

   if ( result ) {
      response.json(PhoneNumber.format(result))
    } else {
      response.status(404).end()
    }
     mongoose.connection.close()
   })
  })

app.get(`${URL_BASE}persons`, (req, res) => {
  //TODO:should this be refactored to the phone_number.js as well?
  PhoneNumber
  .find({})
  .then(result => {
    let resultFormatted = []

    result.forEach(phoneNumber => {
      console.log(phoneNumber)
      resultFormatted.push(PhoneNumber.format(phoneNumber))
    })

    console.log('just before trying to format results...')

    res.json(resultFormatted)
    mongoose.connection.close()
  })

})

const generateId = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

  app.put(`${URL_BASE}persons/:id`, (request, response) => {
  
  const body = request.body

  const phoneNumber = {
    name: body.name,
    number: body.number
  }

  PhoneNumber
    .findByIdAndUpdate(request.params.id, phoneNumber, { new: true } )
    .then(updatedPhoneNumber => {
      response.json(PhoneNumber.format(updatedPhoneNumber))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})




app.post(`${URL_BASE}persons`, (request, response) => {
  
  const body = request.body

  console.log('at post');

	if (body.name === undefined || body.number === undefined ||
		body.name.length <= 0 || body.number.length <= 0) {
    return response.status(400).json({error: 'name or number missing'})
  }

 const phoneNumber = new PhoneNumber({
  name: body.name,
  number: body.number
})

/*
  Person
  .find({name: nameToBeAdded})
  .then(result => {
    // jatka koodia täällä
  })
*/

/*

var contact = new aircraftContactModel(postVars.contact);
contact.save().then(function(){
    var aircraft = new aircraftModel(postVars.aircraft);
    return aircraft.save();
})
.then(function(){
    console.log('aircraft saved')
}).catch(function(){
    // want to handle errors here
});

*/

   var query = PhoneNumber.find({name: body.name});
   assert.ok(!(query instanceof Promise));
   
   // A query is not a fully-fledged promise, but it does have a `.then()`.
   query.then(function (foundPhoneNumber) {
     // use doc
     if (foundPhoneNumber.length <= 0) {
       console.log('no phoneNumber found with the given name yet, SAVE NEW!')
      return phoneNumber.save();
    }
    else {
      //TODO:should we return something here
      console.log('trying to save phone number with existing name-  DO NOTHING !')
      //return phoneNumber.; 
    }
   })
   .then(result => {
    console.log('code went through without errors')
    //TODO:pitää closettaa aina manuaalisesti?
    //TODO:heittääkin tässä kohtaa poikkeuksen - ei jostain syystä täällä tunnista mongoosea...
    //mongoose.connection.close()
    if (result === undefined || result.length <= 0) {
      //TODO: would there be a chance to actually throw error here and catch it later in actual promise?
      response.status(400).send({ error: 'tried to store duplicate phonenumber' })
    }
    else {
      response.json(PhoneNumber.format(result))
    }
  })
   .catch(error => {

    console.log('ERROR HAPPENED while posting new phonenumber:',error)
    response.status(400).send({ error: 'malformatted id' })
  })


})


/*
app.post(`${URL_BASE}persons`, (request, response) => {
  const body = request.body

  console.log('at post');

	if (body.name === undefined || body.number === undefined ||
		body.name.length <= 0 || body.number.length <= 0) {
    return response.status(400).json({error: 'name or number missing'})
  }
  
  
  //let personsNumbersAlreadyFound = persons.filter(person => (person.name === body.name || person.number === body.number))

	//if (personsNumbersAlreadyFound && personsNumbersAlreadyFound.length > 0) {
		//return response.status(400).json({error: 'name or number already in use'})
	//}
  

 const phoneNumber = new PhoneNumber({
  name: body.name,
  number: body.number
})

  console.log('new person:' + phoneNumber);

  phoneNumber
    .save()
    .then(savedPhoneNumber => {
    response.json(PhoneNumber.format(savedPhoneNumber))
    .catch(error => {
      console.log(error)
    })    
 })


})
*/


app.delete(`${URL_BASE}persons/:id`, (request, response) => {
  /*
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
*/
    PhoneNumber
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
  })

app.get('/info', (req, res) => {
    PhoneNumber
    .find({})
    .then(result => {

      res.send(`<p>puhelinluettelossa ${result.length} hengen tiedot</p><p>${new Date().toUTCString()}</p>`)

      mongoose.connection.close()
    })
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)