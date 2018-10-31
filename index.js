const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const PhoneNumber = require('./models/phone_number')

app.use(express.static('build'))

app.use(cors())

morgan.token('dump_res', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :dump_res :res[content-length] - :response-time ms'))

app.use(bodyParser.json())

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

const URL_BASE = '/api/'

app.get(`${URL_BASE}persons/:id`, (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
  
    if ( person ) {
      response.json(person)
    } else {
      response.status(404).end()
    }
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

app.post(`${URL_BASE}persons`, (request, response) => {
  const body = request.body

	if (body.name === undefined || body.number === undefined ||
		body.name.length <= 0 || body.number.length <= 0) {
    return response.status(400).json({error: 'name or number missing'})
  }

	let personsNumbersAlreadyFound = persons.filter(person => (person.name === body.name || person.number === body.number))

	if (personsNumbersAlreadyFound && personsNumbersAlreadyFound.length > 0) {
		return response.status(400).json({error: 'name or number already in use'})
	}

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(10000)
  }

	console.log('new person:' + person);
  persons = persons.concat(person)

  response.json(person)
})

app.delete(`${URL_BASE}persons/:id`, (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.get('/info', (req, res) => {
    res.send(`<p>puhelinluettelossa ${persons.length} hengen tiedot</p><p>${new Date().toUTCString()}</p>`)
  })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)