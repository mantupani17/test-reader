'use strict'

const BaseController = use('App/Controllers/Http/BaseController')
const questions = [
    {
        "question_string": "Javascript is _________ language.",
        "choices": {
            "correct": "Scripting",
            "wrong": ["Programming", "Application", "None of These"]
        }
    }, {
        "question_string": "JavaScript is ______ Side Scripting Language.",
        "choices": {
            "correct": "Browser",
            "wrong": ["Server", "ISP", "None of These"]
        }
    }, {
        "question_string": "Which HTML attribute is used to define inline styles?",
        "choices": {
            "correct": "style",
            "wrong": ["font", "class", "styles"]
        }
    }, {
        "question_string": "What does CSS stand for?",
        "choices": {
            "correct": "Cascading Style Sheets",
            "wrong": ["Computer Style Sheets", "Colorful Style Sheets", "Creative Style Sheets"]
        }
    }, {
        "question_string": "Who is making the Web standards?",
        "choices": {
            "correct": "W3C",
            "wrong": ["Mozilla", "Microsoft", "Google"]
        }
    }
]

const questionColl = [
    {
        objId:'',
        type:'MCQ',
        question:'',
        option1:'',
        option2:'',
        option3:'',
        option4:'',
        option5:'',
        answer:'option',
        subject:'',
        class:'',
        category:'',
        mark:1,
        negMark:1,        
    }
]
const QuizHelpers = use('App/Helpers/AssessmentHelper')
class AssessmentController extends BaseController{
    async getAllQuestions({requset, response}){
        try {
            const res = {
                message:'',
                data: questions
            }
            console.log('fuck')
            response.send(res)
            
        } catch (error) {
            console.log(error)
            response.send({
                message:"OOPS",
                data:[]
            })
        }
    }

    async createQuiz({request, response}){
        try {
            const result = {
                message:"Sorry not able to create Quiz",
                status: false
            }
            const postData = request.all()
            const quiz = {
                title: postData.title,
                noOfQuestions: 0,
                duration: postData.duration,
                questions:[],
                passCriteria:postData.passCriteria,                
            }
            const res = await QuizHelpers.create(quiz)
            if(res){
                result.message = 'Quiz created successfuly.'
                result.status = true
            }
            response.send(result);
        } catch (error) {
            console.log(error)
            response.send({
                message:'Error is :'+ error,
                status:false            
            })
        }
    }

    async getAllAssessments({request, response}){
        try {
            const result = {
                message:"No records found",
                status: false,
                data:[]
            }
            const postData = request.all()
            const where = {
                _id: postData._id             
            }
            const res = await QuizHelpers.read(where)
            if(res.length > 0){
                result.message = ''
                result.status = true
                result.data = res
            }
            response.send(result);
        } catch (error) {
            console.log(error)
            response.send({
                message:'Error is :'+ error,
                status:false,
                data:[]            
            })
        }
    }

    async initializeUserResult({request, response}){
        try {
            const result = {
                message:"Sorry not able to initiate Quiz",
                status: false
            }
            const postData = request.all()
            const checkResultExists = ''
            const quiz = {
                title: postData.title,
                quizId:await this.toObjectId(postData._id),
                userId:await this.toObjectId(postData.userId),
                quizQuestions:[],
                quizResults:{}            
            }
            const where = {
                title: postData.title,
                quizId:await this.toObjectId(postData._id),
                userId:await this.toObjectId(postData.userId)
            }
            let res = false
            const isExist = await QuizHelpers.isAlreadyAttempted(where)
            if(isExist.length > 0){
                res = true
            }else{
                res = await QuizHelpers.initializeQuiz(quiz)
            }
            // const res = await QuizHelpers.initializeQuiz(quiz)
            if(res){
                result.message = 'Quiz initialized successfuly.'
                result.status = true
            }
            response.send(result);
        } catch (error) {
            console.log(error)
            response.send({
                message:'Error is :'+ error,
                status:false            
            })
        }
    }

    async saveQuizResult({request, response}){
        try {
            const result = {
                message:"Sorry not able to save quiz result",
                status: false
            }
            const postData = request.all()
            
            const quiz = {
                $set:{
                    quizQuestions:postData.questions,
                    quizResults:postData.quizResults ,
                    username: postData.username           
                }
            }

            const where = {
                title: postData.title,
                quizId:await this.toObjectId(postData.quizId),
                userId:await this.toObjectId(postData.userId)
            }
            // const checkResultExists = await QuizHelpers.isAlreadyAttempted(where)
            // console.log(checkResultExists)
            // return
            let res = await QuizHelpers.updateQuizResult(where , quiz)
            if(res){
                result.message = 'Quiz result saved successfuly.'
                result.status = true
            }
            response.send(result);
        } catch (error) {
            console.log(error)
            response.send({
                message:'Error is :'+ error,
                status:false            
            })
        }
    }
}

module.exports = AssessmentController