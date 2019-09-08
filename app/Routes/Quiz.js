'use strict'
const Route = use('Route')

Route.group('Reader', ()=>{
    Route.get('/quiz', 'App/Controllers/Http/frontend/FrontendController.renderQuizTemplate')
}).prefix('/dashboard/')

Route.group('API', ()=>{
    Route.get('/all', 'App/Controllers/Http/AssessmentController.getAllQuestions')
}).prefix('/api/quiz/')