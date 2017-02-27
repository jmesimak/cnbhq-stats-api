var express = require('express')
var app = express()
var bodyParser = require('body-parser')

var Device = require('./Device')

var knex = require('knex')({
  client: 'postgres',
  connection: {
    host : 'db',
    user : 'postgres',
    password : 'puikula',
    database : 'readings'
  }
});

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World! Itseasiassa \n')
})

app.post('/devices', (req, res) => {
  let device = new Device(undefined, req.body.name, req.body.shortname, undefined)
  device.saveDevice(knex)
  res.send("thnx")
})

app.get('/devices', (req, res) => {
  Device.findAll(knex)
    .then((devices) => {
      res.send(devices)
    })
})

app.get('/devices/:id', (req, res) => {
  Device
    .findOne(knex, req.params.id)
    .then((device) => res.send(device))
    .catch(console.log)
})

app.post('/device/:id/readings', (req, res) => {
  Device
    .findOne(knex, req.body.id)
    .then((device) => device.saveReadings(knex, req.body.readings))
    .then(() => res.send("thxbai"))
    .catch((error) => console.log)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

module.exports = app