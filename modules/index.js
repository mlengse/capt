require('dotenv').config()
let obj = require("fs").readdirSync(require("path").join(__dirname)).reduce(( obj, file ) => Object.assign({}, obj, require("./" + file)), {})

module.exports = class Core {
  constructor(config) {
    this.path = require('path')
    for( let func in obj) {
      if(func.includes('_')) {
        this[func.split('_').join('')] = async (...args) => await obj[func](Object.assign({}, ...args, {that: this }))
      } else {
        this[func] = obj[func]
      }
    }
  }

}