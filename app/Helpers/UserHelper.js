'use strict'
const UserModel = use('App/Models/User')


const UserHelpers = {
    async getUsers({request,response}){
        const res = {
            status : true,
            message: 'Users are',
            data:userData
        }
        try {
            response.send(res)
        } catch (error) {
            console.log(error)
        }
    },
    
    async getAllUsers(where, select, limit, skip){
        where = where || {}
        select = select || ''
        limit = limit || 10000
        skip = skip || 0
        try {
           const result = await UserModel
                .select(select)
                .where(where)
                .sort({email:1})
                .limit(limit)
                .skip(skip)
                .fetch()
           return result.toJSON()
       } catch (error) {
           console.log(error)
           return []
       }
    },

    async createUser(user){
        try {
            const userData = await UserModel.create(user)
            return userData 
        } catch (error) {
            console.log(error)
            return 0
        }
    },

    async deleteUser(where){
        try {
            await UserModel
            .where(where)
            .delete()
            return true 
        } catch (error) {
            console.log(error)
            return false
        }
    }



}

module.exports = UserHelpers