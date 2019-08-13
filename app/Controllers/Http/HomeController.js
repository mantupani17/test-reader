'use strict'

//const UserHelper = use('Helpers/UserHelper')

const userData = [
    {name:'mantu pani',id:'123',desc:'i am simple and cool <h1>guy</h1> and i like to do programming'},
    {name:'sruti patra',id:'143',desc:'i am simple and cool <h1>girl</h1> and i like to do programming'},
    {name:'venketes achary',id:'121',desc:'i am simple and cool <h1>boy</h1> and i like to do programming'},
    {name:'deepak maharana',id:'101',desc:'i am simple and cool <h1>dude</h1> and i like to do programming'}
]

const userModel = use('App/Models/User')

class UserController {
    async index({view, auth}){
        try {
            console.log('fuck')
        } catch (error) {
            console.log(error)
        }
    }
    async test({request, response}){
        try {
            response.send("working")
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = UserController
