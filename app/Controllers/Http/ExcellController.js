'use strict'

const BaseController = use('App/Controllers/Http/BaseController/index')
const DrmHelpers = use('App/Helpers/DrmHelper')
const { validate } = use('Validator')
const Helpers = use('Helpers')

class ExcellController{
   
    async readImages({request, response}){
        try {
            const rules = {
                filename:'required'
            }
            const messages = {
                'filename.required':'File name is required'
            }
            const formData = request.all()
            const validation = await validate(formData, rules , messages)
            if (validation.fails()) {
                return response.send({
                    message:validation.messages(),
                    status:false,
                    validation:false,
                    data:{}
                })
            }else{
                const profilePic = request.file('filename', {
                    types: ['vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
                    size: '2mb'
                })
                const fileExts = {
                    'vnd.openxmlformats-officedocument.spreadsheetml.sheet':'xlsx'
                }
                const filename = `${new Date().getTime()}.${fileExts[profilePic.subtype]}`
                await profilePic.move(Helpers.tmpPath('uploads'), {
                    name: filename
                })
                
            
                if (!profilePic.moved()) {
                    return profilePic.error()
                }else{
                    const uploadFileLoc = Helpers.tmpPath('uploads')+'/'+filename
                    const data = await DrmHelpers.readBulkImageFile(uploadFileLoc)
                    data.validation = true
                    response.send(data)
                }
            }

        } catch (error) {
            console.log(error)
            response.status(500).send({
                message:'OOPS',
                data:{},
                status:false,
                validation : true
            })
        }
    }




}

module.exports = ExcellController