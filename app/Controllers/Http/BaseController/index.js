'use strict'

class BaseController {
    constructor(){
        // console.log('fucking')
        const Helpers = use('Helpers')
        const AppRoot = Helpers.appRoot()
        const resourcesPath = Helpers.resourcesPath()
        const configPath = Helpers.configPath()
        const migrationsPath = Helpers.migrationsPath()
        const seedsPath = Helpers.seedsPath()
        const databasePath = Helpers.databasePath()
        const tmpPath = Helpers.tmpPath()
    }

    async toObjectId(fileId){
        try {
            var ObjectID = require("bson-objectid");
            return ObjectID(fileId)   
        } catch (error) {
            console.log(error)
        }
       
    }
}

module.exports = BaseController