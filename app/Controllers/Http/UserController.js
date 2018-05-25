'use strict'

//const UserHelper = use('Helpers/UserHelper')

const userData = [
    {name:'mantu pani',id:'123',desc:'i am simple and cool <h1>guy</h1> and i like to do programming'},
    {name:'sruti patra',id:'143',desc:'i am simple and cool <h1>girl</h1> and i like to do programming'},
    {name:'venketes achary',id:'121',desc:'i am simple and cool <h1>boy</h1> and i like to do programming'},
    {name:'deepak maharana',id:'101',desc:'i am simple and cool <h1>dude</h1> and i like to do programming'}
]

const userModel = use('App/Models/User')

class UserController {
   
    async getUsers({request,response}){
        const res = {
            status : true,
            message: 'Users are',
            data:userData
        }
        try {
            response.send(res)
        } catch (error) {
            console.log(error)
        }
    }

    async getUser({request, response, params }){
        const res = {
            status : true,
            message: 'Users are',
            data:''
        }
        try {
           const id = params.id
           //console.log(id)
           const result = userData.find( user => user.id === id );
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
       }
    }

    async createUser({request, response}){
        const Hash = use('Hash')
        const res = {
            status : true,
            message: 'Users added successfully',
            data:''
        }
        try {
            const postData = request.all()
            const usermodel = new userModel()
            usermodel.fname = postData['fname']
            usermodel.lname = postData['lname']
            usermodel.email = postData['email']
            usermodel.password = await Hash.make(postData['password'])
            await usermodel.save()
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

    async login ({ request, response, auth, view }) {
        const res = {
            status:true,
            message:'Login successfull',
            data:''
        }
        try {
            const postData = request.all()
            const email = postData['email']
            const password = postData['password']
            const data = await auth.attempt(email, password)
            // return view.render('home', auth)
            response.send(res)
                } catch (error) {
                    const res = {
                        status:false,
                        message:error.message,
                        data:''
                    }
            console.log(error.message)
            response.send(res)
        }
        
      }
}

module.exports = UserController
