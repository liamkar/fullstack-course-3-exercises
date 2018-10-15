
const express = require('express')
const app = express()

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

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

//app.get('/persons', (req, res) => {
app.get(`${URL_BASE}persons`, (req, res) => {
  res.json(persons)
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


//console.log('hello world')