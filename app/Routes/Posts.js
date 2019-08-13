'use strict'
const Route = use('Route')
Route 
    .group(()=>{
        Route.post('/','PostController.createPost')
        Route.get('/','PostController.getPosts')
        Route.get('/:id','PostController.getPost')
        Route.get('/delete/:id','PostController.deletePost')
    }).prefix('/api/post')