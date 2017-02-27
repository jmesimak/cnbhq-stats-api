class Device {
  constructor(id, name, shortname, created_at) {
    this.id = id
    this.name = name
    this.shortname = shortname
    this.created_at = created_at
  }

  saveDevice(knex) {
    knex('devices')
    .insert({name: this.name, shortname: this.shortname, created_at: new Date()})
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  saveReadings(knex, readings) {
    knex('device_readings')
    .insert({device_id: this.id, reading_data: readings, created_at: new Date()})
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  static findAll(knex) {
    return new Promise((resolve, reject) => {
      knex
        .select()
        .from('devices')
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  static findOne(knex, id) {
    function findReadings(device_id) {
      return new Promise((resolve, reject) => {
        knex('device_readings')
          .where({device_id: device_id})
          .select()
          .then(resolve)
          .catch(console.log)
      })
    }

    return new Promise((resolve, reject) => {
      knex.table('devices').where('id', id).first()
        .then((row) => new Device(row.id, row.name, row.shortname, row.created_at))
        .then((device) => {
          findReadings(device.id)
            .then((readings) => {
              device.readings = readings
              resolve(device)
            })
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }
}

module.exports = Device