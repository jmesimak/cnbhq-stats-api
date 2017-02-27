var Device = require('../Models/Device')

class DeviceController {

  constructor(knex) {
    this.knex = knex
    this.loadRoutes = this.loadRoutes.bind(this)
  }

  loadRoutes(app) {
    app.get('/devices', (req, res) => {
      Device.findAll(this.knex)
        .then((devices) => {
          res.send(devices)
        })
    })

    app.get('/devices/:id', (req, res) => {
      Device
        .findOne(this.knex, req.params.id)
        .then((device) => device.appendReadings(this.knex))
        .then(res.send.bind(res))
        .catch(console.log)
    })

    app.post('/devices/:id/readings', (req, res) => {
      Device
        .findOne(this.knex, req.params.id)
        .then((device) => device.saveReadings(this.knex, req.body.readings))
        .then((row) => res.send({id: row[0]}))
        .catch((error) => console.log)
    })

    app.post('/devices', (req, res) => {
      let device = new Device(undefined, req.body.name, req.body.shortname, undefined)
      device.saveDevice(this.knex)
        .then((row) => res.send({id: row[0]}))
    })
  }

}

module.exports = DeviceController