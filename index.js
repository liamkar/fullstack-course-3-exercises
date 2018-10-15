const express = require('express')
const app = express()
const bodyParser = require('body-parser')

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
  res.json(persons)
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


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})