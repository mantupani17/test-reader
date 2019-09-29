'use strict'

const BaseController = use('App/Controllers/Http/BaseController')


class FrontendController extends BaseController{
    async renderQuizTemplate({request, response, view}){
        try {
            return view.render('quiz/quiz' , {title:'Quiz'})
        } catch (error) {
            console.log(error)
            response.send({
                status:false,
                message:'OOPS'
            })
        }
    }

    // Encryption and decryption testing
    async renderEncryptionTestPage({request, response, view}){
        try {
            return view.render('Test/encryption-test' , {title:'Quiz'})
        } catch (error) {
            console.log(error)
            response.send({
                status:false,
                message:'OOPS'
            })
        }
    }

    async manageQuiz({request, response, view}){
        try {
            return view.render('quiz/manage-quiz' , {title:'Manage Quiz'})
        } catch (error) {
            console.log(error)
            response.send({
                status:false,
                message:'OOPS' + error
            })
        }
    }


}

module.exports = FrontendController