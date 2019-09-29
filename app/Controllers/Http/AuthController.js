'use strict'

//const UserHelper = use('Helpers/UserHelper')

const userModel = use('App/Models/User')
const BaseController = use('App/Controllers/Http/BaseController')
const Encryption = use('App/Helpers/Encryption')
const userData = [
    {name:'mantu pani',id:'123',desc:'i am simple and cool <h1>guy</h1> and i like to do programming'},
    {name:'sruti patra',id:'143',desc:'i am simple and cool <h1>girl</h1> and i like to do programming'},
    {name:'venketes achary',id:'121',desc:'i am simple and cool <h1>boy</h1> and i like to do programming'},
    {name:'deepak maharana',id:'101',desc:'i am simple and cool <h1>dude</h1> and i like to do programming'}
]
class AuthController extends BaseController {
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

    async encryptData({request, response}){
        try {
            // await Encryption.encryptionTechniques()
            const postData = request.all()
            const username = postData.name
            console.log(username)
            const password = postData.password
            const encryptName = await Encryption.encrypt(username)
            const decryptName = await Encryption.decrypt(encryptName)
            console.log(decryptName)
            const encryptPassword = await Encryption.encrypt(password)
            response.send({
                message:'Encryption is done',
                data:{encryptName , encryptPassword}
            })
        } catch (error) {
            console.log(error)
            response.send({
                message:'OOPS'
            })
        }
    }

    async decryptData({request, response}){
        try {
            const postData = request.all()
            const username = postData.encryptName
            const password = postData.encryptPassword
            const decryptName = await Encryption.decrypt(username)
            response.send({
                message:'Decryption is done',
                data:decryptName
            })
        } catch (error) {
            console.log(error)
            response.send({
                message:'OOPS'
            })
        }
    }
}

module.exports = AuthController
