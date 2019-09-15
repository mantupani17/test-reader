'use strict'
const Route = use('Route')

Route.group('Reader', ()=>{
    Route.get('/test-encryption', 'App/Controllers/Http/frontend/FrontendController.renderEncryptionTestPage')
}).prefix('/dashboard/')

Route.group('Reader', ()=>{
    Route.post('/encryption', 'App/Controllers/Http/AuthController.encryptData')
    Route.post('/decryption', 'App/Controllers/Http/AuthController.decryptData')
}).prefix('/api/encrypt')

