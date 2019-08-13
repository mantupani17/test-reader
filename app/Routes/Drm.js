'use strict'
const Route = use('Route')

Route.group('Reader', ()=>{
    Route.get('/reader', 'App/Controllers/Http/DrmController.renderPage')
}).prefix('/dashboard/media/')

Route.group('ApiReader', ()=>{
    Route.get('/reader', 'App/Controllers/Http/DrmController.renderFile')
    Route.get('/metadata', 'App/Controllers/Http/DrmController.getMetaData')
}).prefix('/api/media/')