var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var DeviceController = require('./Controllers/Device')
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

var dc = new DeviceController(knex)
dc.loadRoutes(app)

app.get('/', function (req, res) {
  res.send('Hello World! Itseasiassa \n')
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})

module.exports = app