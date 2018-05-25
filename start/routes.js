'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|__________________________________________________________________________
|
|+++++++++++++++++++++++++++DB Configuration+++++++++++++++++++++++++++++++
|==========================================================================
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|  DBUSER:mantu_1234
|  DBPASSWORD:abc123xyz
|  SERVER:mongodb://mantu_mean_db:@ds115198.mlab.com
|  PORT:15198
|  DB:schedule
|    
|
|    HOST=127.0.0.1
|    PORT=3333
|    NODE_ENV=development
|    APP_URL=http://${HOST}:${PORT}
|    CACHE_VIEWS=false
|    APP_KEY=CavET6tdWVTpzcDHiInvGd35w4WIEQNI
|    DB_CONNECTION=mongodb
|    DB_HOST=ds129939.mlab.com
|    DB_PORT=29939
|    DB_USER=mantu
|    DB_PASSWORD=adonis
|    DB_DATABASE=schedule
|    SESSION_DRIVER=cookie
|
|========================================================================
| *************************** mlab configuration*************************
|========================================================================
| user name- mantu_1234
| password - m@ntup@ni123
|------------------------------------------------------------------------
*/

const Route = use('Route')

Route.on('/').render('welcome',{title:'I MEAN ME | LOGIN'})
Route.on('/register').render('register',{title:'I MEAN ME | REGISTER'})
Route.on('/forgot-password').render('forgot-password',{title:'I MEAN ME | FORGOT PASSWORD'})


Route
 .group(()=>{
        Route.get('/','UserController.getUsers')
        Route.get('/:id','UserController.getUser')
        Route.post('/','UserController.createUser')
        Route.delete('/','UserController.deleteUser')
 })
 .prefix('api/user')

 Route.group(()=>{
    Route.post('/login','UserController.login')
    Route.post('/forgot-password','UserController.forgotPassword')
    Route.post('/change-password','UserController.changePassword')
 })
 .prefix('api/auth/user')


 Route
 .group(()=>{
     Route.get('/','CsvController.getCsvData')
 })
 .prefix('api/csv')


 Route 
    .group(()=>{
        Route.post('/','PostController.createPost')
        Route.get('/','PostController.getPosts')
        Route.get('/:id','PostController.getPost')
        Route.get('/delete/:id','PostController.deletePost')
    }).prefix('api/post')

    
Route
    .group(()=>{
        Route.post('/','PostController.createPost')
    }).prefix('api/admin/post')


