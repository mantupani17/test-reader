'use strict'

const BaseController = use('App/Controllers/Http/BaseController')
const Drive = use('Drive')
const fs = require('fs')

class DrmController extends BaseController{
    async renderPage({request, response, view}){
        try {
            return view.render('reader/reader' , {title:'Reader'})
        } catch (error) {
            console.log(error)
            response.send({
                message:'OOPS ERROR',
                status:false
            })
        }
    }

    async renderFile({request, response}){
        try {
            const getData = request.get()
            const fileName = getData.fileName
            const metaDataFile = use('Helpers').resourcesPath('files')
            let contents = fs.readFileSync(metaDataFile+'/'+fileName+'.pdf')
            response.header('content-type', 'application/pdf')
            // res.metadata = contents
            response.send(contents)
        } catch (error) {
            console.log(error)
            response.send({
                message:'OOPS ERROR',
                status:false
            })
        }
    }

    async getMetaData({request, response}){
        try {
            const res =  {
                message:'',
                status:true,
                metadata:[]
            }
            const metaDataFile = use('Helpers').resourcesPath('metadata')
            let contents = fs.readFileSync(metaDataFile+'/metadata.json')
            contents = JSON.parse(contents.toString())
            response.header('content-type', 'application/json')
            res.metadata = contents
            response.send(res)
        } catch (error) {
            console.log(error)
            response.send({
                message:'OOPS ERROR',
                status:false,
                metadata:[]
            })
        }
    }
}
module.exports = DrmController
