'use strict'
const QuizModel = use('App/Models/Quiz')
const QuizResultModel = use('App/Models/QuizResult')

const QuizHelpers = {
    async create(data){
        try {
            const result = await QuizModel.create(data)
            return result._id
        } catch (error) {
            console.log(error)
            return false
        }
    },

    async read(where, select){
        try {
            where = where || {}
            select = select || ''
            const result = await QuizModel.where(where)
            .select(select)            
            .fetch()
            return result.toJSON()
        } catch (error) {
            console.log(error)
            return false
        }
    },

    async isAlreadyAttempted(where, select){
        try {
            where = where || {}
            select = select || ''
            const result = await QuizResultModel.where(where)
            .select(select)            
            .fetch()
            return result.toJSON()
        } catch (error) {
            console.log(error)
            return false
        }
    },

    async initializeQuiz(data){
        try {
            const result = await QuizResultModel.create(data)
            return result._id
        } catch (error) {
            console.log(error)
            return false
        }
    },

    async updateQuizResult(where, data){
        try {
            where = where || {}
            data = data || {}
            const result = await QuizResultModel.where(where).update(data)
            return result
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

module.exports = QuizHelpers