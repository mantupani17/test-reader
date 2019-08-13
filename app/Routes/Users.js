'use strict'

const Route = use('Route')


Route
 .group(()=>{
        Route.get('/','UserController.getUsers')
        // Route.get('/:id','UserController.getUser')
        Route.post('/','UserController.createUser')
        Route.get('/delete','UserController.deleteUser')
        Route.get('/test/test','TestController.test')
 }).prefix('/api/user')