'use strict'

//const UserHelper = use('Helpers/UserHelper')

const userData = [
    {name:'mantu pani',id:'123',desc:'i am simple and cool <h1>guy</h1> and i like to do programming'},
    {name:'sruti patra',id:'143',desc:'i am simple and cool <h1>girl</h1> and i like to do programming'},
    {name:'venketes achary',id:'121',desc:'i am simple and cool <h1>boy</h1> and i like to do programming'},
    {name:'deepak maharana',id:'101',desc:'i am simple and cool <h1>dude</h1> and i like to do programming'}
]

const UserHelpers = use('App/Helpers/UserHelper')
const BaseController = use('App/Controllers/Http/BaseController')

class UserController extends BaseController{
   
    async createUser({request, response}){
        const Hash = use('Hash')
        const res = {
            status : true,
            message: 'Users added successfully',
            data:''
        }
        try {
            const postData = request.all()
            const usermodel = {}
            usermodel.fname = postData['fname']
            usermodel.lname = postData['lname']
            usermodel.email = postData['email']
            usermodel.password = postData['password']
            const userId = await UserHelpers.createUser(usermodel)
            if(userId == ''){
                res.status = false
                res.message = 'Sorry, The data is not register.' 
            }
            response.send(res);
        } catch (error) {
            console.log(error)
            response.send({
                status:false,
                message:error.message,
                data:'',
            });
        }
    }

    async getUsers({request, response, params }){
        const res = {
            status : true,
            message: 'Users are',
            data:''
        }
        try {
            const getData = request.all()
            const where = {}
            if(typeof getData.id != 'undefined' && getData.id != ''){
                where._id = await this.toObjectId('5d3b14183676800b54cf7b47')
            }
            const result = await UserHelpers.getAllUsers(where, '');
            if(result == undefined){
                res.status = false;
                res.message = 'record not found'
            }else{
                res.data = result
                res.message=''
            }
          
           response.send(res)
       } catch (error) {
           console.log(error)
           response.send({
               message: 'OOPS, ERROR',
               status: false,
               data : []
           })
       }
    }

    async deleteUser({request, response, params }){
        const res = {
            status : true,
            message: 'Delete Successfuly',
            data:''
        }
        try {
            const getData = request.all()
            const where = {}
            if(typeof getData.id != 'undefined' && getData.id != ''){
                where._id = await this.toObjectId('5d3b14183676800b54cf7b47')
            }
            const result = await UserHelpers.deleteUser(where);
            if(result == false){
                res.status = false;
                res.message = 'record not found'
            }else{
                res.data = result
                res.message=''
            }
          
           response.send(res)
       } catch (error) {
           console.log(error)
           response.send({
               message: 'OOPS, ERROR',
               status: false,
               data : []
           })
       }
    }



    async test({request, response}){
        try {
            response.send("working")
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = UserController
