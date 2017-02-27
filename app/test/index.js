var request = require('supertest')
var app = require('../app')
var should = require("should");
var knex = require('knex')({
  client: 'postgres',
  connection: {
    host : 'db',
    user : 'postgres',
    password : 'puikula',
    database : 'readings'
  }
});

describe('post a device', () => {

  before((done) => {
    knex.raw('DROP SCHEMA public CASCADE; CREATE SCHEMA public;')
      .then(() => knex.migrate.latest())
      .then(() => done())
  })

  it('Insert a new device', (done) => {
    const device = {name: 'Ebin Device', shortname: 'snookadfkadf'}
    request(app)
      .post('/devices')
      .set('Accept', 'application/json')
      .send(device)
      .expect(200)
      .end((err, res) => {
        res.body.should.have.property('id')
        done()
      })
  })

  it('Fetch the created device', (done) => {
    request(app)
      .get('/devices')
      .expect(200)
      .end((err, res) => {
        res.body.should.have.length(1)
        done()
      })
  })

  it('Add readings for the device', (done) => {
    const readings = {temperatue: 15, humidity: 22}
    request(app)
      .post('/devices/1/readings')
      .send(readings)
      .expect(200)
      .end((err, res) => {
        res.body.should.have.property('id')
        done()
      })
  })

  it('Should have readings now', (done) => {
    request(app)
      .get('/devices/1')
      .expect(200)
      .end((err, res) => {
        res.body.readings.should.have.length(1)
        done()
      })
  })
})
