'use strict'
const User = require('./User')
const data = [
    {username : 'mantu pani',age:28}
]

const user = new User(data[0])
user.display()