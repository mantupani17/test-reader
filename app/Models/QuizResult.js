'use strict'
/*
|-----------------------------------------------------------
|***********************QuizResultModel***************************
|-----------------------------------------------------------
|  QuizResult model schema
|  {
     quizAttemptedId:'_id',
     quizId:'QuizId',
     userId:'User_id',
     quizQuestions:[
         {question_string:'', userAnswer:'', correctAnser:''}
     ],
     quizResults:{totalQuestions:0, attemptedQuestions:0, correctAnswer:0, percentage:0}
     
    }
}
| 
*/


const Model = use('Model')

class QuizResult extends Model {

}

module.exports = QuizResult
