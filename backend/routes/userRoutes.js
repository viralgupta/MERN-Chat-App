const express = require('express')
const {registerUser, loginUser, getUser} = require('../controlers/usercontroller')
const {protect} = require('../middlewear/authMiddleware')

const userRoutes = express.Router()

userRoutes.route('/register').post(registerUser)
userRoutes.route('/login').post(loginUser)
userRoutes.route('/').get(protect, getUser)

module.exports= userRoutes



