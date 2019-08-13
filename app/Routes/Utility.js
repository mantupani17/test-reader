 'use strict'
const Route = use('Route')
 Route
 .group(()=>{
     Route.get('/','CsvController.getCsvData')
 })
 .prefix('api/csv')