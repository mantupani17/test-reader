'use strict'

//const UserHelper = use('Helpers/UserHelper')

const userModel = use('App/Models/User')
const userData = [
    {name:'mantu pani',id:'123',desc:'i am simple and cool <h1>guy</h1> and i like to do programming'},
    {name:'sruti patra',id:'143',desc:'i am simple and cool <h1>girl</h1> and i like to do programming'},
    {name:'venketes achary',id:'121',desc:'i am simple and cool <h1>boy</h1> and i like to do programming'},
    {name:'deepak maharana',id:'101',desc:'i am simple and cool <h1>dude</h1> and i like to do programming'}
]
class AuthController {
    async login ({ request, response, auth, sesion }) {
        const res = {
            status:true,
            message:'Login successfull',
            data:'',
            redirect:''
        }
        try {
            const postData = request.all()
            const email = postData['email']
            const password = postData['password']
            await auth.attempt(email, password)
            res.redirect = '/home' 
            response.send(res)
            } catch (error) {
                console.log(error)
                const errorConstant = error.message.split(':')
                const res = {
                    status:false,
                    message:error.message,
                    data:''
                }
                if(errorConstant[0] == 'E_CANNOT_LOGIN'){
                    res.status = true
                    res.message = 'This user is aready logged in.'
                    res.redirect = '/api/auth/user/logout'                    
                }           
            response.send(res)
        }
        
    }
    async logout({request, response, auth, session}){
        try {
            console.log(auth.user)
            await auth.logout()
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = AuthController
