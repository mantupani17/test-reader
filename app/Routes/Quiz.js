'use strict'
const Route = use('Route')

Route.group('Reader', ()=>{
    Route.get('/quiz', 'App/Controllers/Http/frontend/FrontendController.renderQuizTemplate')
    Route.get('/manage-quiz', 'App/Controllers/Http/frontend/FrontendController.manageQuiz')
}).prefix('/dashboard/')

Route.group('API', ()=>{
    Route.get('/all', 'App/Controllers/Http/AssessmentController.getAllQuestions')
    Route.post('/create', 'App/Controllers/Http/AssessmentController.createQuiz')
    Route.get('/get', 'App/Controllers/Http/AssessmentController.getAllAssessments')
    Route.post('/initialize' , 'App/Controllers/Http/AssessmentController.initializeUserResult')
    Route.post('/save-result' , 'App/Controllers/Http/AssessmentController.saveQuizResult')
}).prefix('/api/quiz/')
