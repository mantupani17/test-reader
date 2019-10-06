'use strict'
const Route = use('Route')

Route.group('Reader', ()=>{
    Route.get('/test-encryption', 'App/Controllers/Http/frontend/FrontendController.renderEncryptionTestPage')
    Route.get('/upload-images', 'App/Controllers/Http/frontend/FrontendController.uploadImages')
}).prefix('/dashboard/')

Route.group('Reader', ()=>{
    Route.post('/encryption', 'App/Controllers/Http/AuthController.encryptData')
    Route.post('/decryption', 'App/Controllers/Http/AuthController.decryptData')
}).prefix('/api/encrypt')


Route.group('Excelljs', ()=>{
    Route.post('/read-images', 'App/Controllers/Http/ExcellController.readImages')
}).prefix('/api/excelljs')

