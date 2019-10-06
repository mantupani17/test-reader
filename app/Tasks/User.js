'use strict'

const Task = use('Task')

class User extends Task {
  static get schedule () {
    return '0 */1 * * * *'
  }

  async handle () {
    this.info('Task User handle')
  }
}

module.exports = User
