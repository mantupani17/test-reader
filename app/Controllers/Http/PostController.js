'use strict'

const postModel = use('App/Models/Post')
class PostController {
    async createPost({request, response}){
        const res = {
            status:true,
            message:'Post added successfully!',
            data:''
        }
        try {
            const postData = request.all()
            const postmodel = new postModel()

            postmodel.username = postData['username']
            postmodel.post = postData['post']

            const result = await postmodel.save()

            response.send(res)
            
        } catch (error) {
            console.log(error)
            response.send({
                status:false,
                message:error.message,
                data:''
            })
        }
    }

    async deletePost({request , response}){
        const res = {
            status:true,
            message:'Post deleted successfully!',
            data:''
        }
        try {
            const postData = request.all()
            const postId = postData['pid']
            const where = {'_id.$oid':pid}

            // const result = await postmodel.save()

            response.send(res)
            
        } catch (error) {
            console.log(error)
            response.send({
                status:false,
                message:error.message,
                data:''
            })
        }
    }

    async getPosts({request, response }){
        const res = {
            status:false,
            message:'No record found!',
            data:''
        }
        try {
            let postData = await postModel
                    .select()
                    .fetch()

            postData = postData.toJSON()
            if(postData.length > 0){
                res.status=true
                res.data = postData
                res.message = ''
            }
            response.send(res)
        } catch (error) {
            console.log(error)
            response.send({
                status:false,
                message:error.message,
                data:''
            })
        }
    }

    async deletePost({request, response, params}){
        const res = {
            status:true,
            message:'Deleted successfully!',
            data:''
        }
        try {
            const postData = request.all()
            const _id = postData['id']
            const where = {'_id':_id}
            const effectedRows = await postModel
                            .where(where)
                            .delete()
            response.send(res)
        } catch (error) {
            console.log(error)
            response.send({
                status:false,
                message:error.message,
                data:''
            })
        }
    }


}

module.exports = PostController
