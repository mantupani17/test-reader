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
}

module.exports = FrontendController