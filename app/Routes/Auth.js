'use strict'
const Route = use('Route')
Route.group(()=>{
    Route.post('/login','AuthController.login')
    Route.post('/forgot-password','AuthController.forgotPassword')
    Route.post('/change-password','AuthController.changePassword')
    Route.get('/logout','AuthController.logout')
 })
 .prefix('api/auth/user')