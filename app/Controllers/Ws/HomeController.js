'use strict'

class HomeController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }
}

module.exports = HomeController
