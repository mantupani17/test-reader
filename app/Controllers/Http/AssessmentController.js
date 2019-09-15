'use strict'

const BaseController = use('App/Controllers/Http/BaseController')
const questions = [
    {
        question_string: "Javascript is _________ language.",
        choices: {
            correct: "Scripting",
            wrong: ["Programming", "Application", "None of These"]
        }
    }, {
        question_string: "JavaScript is ______ Side Scripting Language.",
        choices: {
            correct: "Browser",
            wrong: ["Server", "ISP", "None of These"]
        }
    }, {
        question_string: "Which HTML attribute is used to define inline styles?",
        choices: {
            correct: "style",
            wrong: ["font", "class", "styles"]
        }
    }, {
        question_string: 'What does CSS stand for?',
        choices: {
            correct: "Cascading Style Sheets",
            wrong: ["Computer Style Sheets", "Colorful Style Sheets", "Creative Style Sheets"]
        }
    }, {
        question_string: 'Who is making the Web standards?',
        choices: {
            correct: "W3C",
            wrong: ["Mozilla", "Microsoft", "Google"]
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
}

module.exports = AssessmentController