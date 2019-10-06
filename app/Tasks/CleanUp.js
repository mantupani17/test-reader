'use strict'

const Task = use('Task')

class CleanUp extends Task {
  static get schedule () {
    return '0 */1 * * * *'
  }

  async handle () {
    try {
      const fs = require('fs');
      const path = require('path');
      const Helpers = use('Helpers')

      const directory = Helpers.tmpPath('uploads');

      fs.readdir(directory, (err, files) => {
        if (err) throw err;
        for (const file of files) {
          fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
          });
        }
      });
    } catch (error) {
      console.log(error)
    }
    this.info('Task cleanUp to clear the temp location')
  }
}

module.exports = CleanUp
