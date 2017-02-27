class Device {
  constructor(id, name, shortname, created_at) {
    this.id = id
    this.name = name
    this.shortname = shortname
    this.created_at = created_at
  }

  saveDevice(knex) {
    return new Promise((resolve, reject) => {
      knex('devices')
        .returning('id')
        .insert({name: this.name, shortname: this.shortname, created_at: new Date()})
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  saveReadings(knex, readings) {
    return new Promise((resolve, reject) => {
      knex('device_readings')
        .returning('id')
        .insert({device_id: this.id, reading_data: readings, created_at: new Date()})
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          console.log(error)
        })
    })
  }

  appendReadings(knex) {
    return new Promise((resolve, reject) => {
      knex('device_readings')
        .where({device_id: this.id})
        .select('id', 'reading_data', 'created_at')
        .limit(100)
        .then((rows) => {
          this.readings = rows
          resolve(this)
        })
        .catch(console.log)
    })
  }

  remove(knex) {
    return new Promise((resolve, reject) => {
      knex('device_readings')
        .where('device_id', this.id)
        .del()
        .then(() => {
          knex('devices')
            .where('id', this.id)
            .del()
            .then(resolve)
        })
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
    return new Promise((resolve, reject) => {
      knex.table('devices').where('id', id).first()
        .then((row) => new Device(row.id, row.name, row.shortname, row.created_at))
        .then(resolve)
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }
}

module.exports = Device