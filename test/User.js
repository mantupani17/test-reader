'use strict'

class User{
 constructor(user){
     this.username = user.username
     this.age = user.age
 }

 display(){
     console.log(`name:${this.username}, age:${this.age}`)
 }
}

module.exports = User