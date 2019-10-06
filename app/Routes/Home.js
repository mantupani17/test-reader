'use strict'
const Route = use('Route')
Route.on('/').render('welcome',{title:'I MEAN ME | LOGIN'})
Route.on('/register').render('register',{title:'I MEAN ME | REGISTER'})
Route.on('/forgot-password').render('forgot-password',{title:'I MEAN ME | FORGOT PASSWORD'})


// Route.group('Dynamic pages', ()=>{
//     Route.get('/', 'HomeController.index')
// }).prefix('/home')