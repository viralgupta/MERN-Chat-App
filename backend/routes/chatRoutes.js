const express = require('express')
const {accessChats, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup} = require('../controlers/chatcontroller')
const {protect} = require('../middlewear/authMiddleware')

const chatRoutes = express.Router()

chatRoutes.route('/').post(protect,accessChats);
chatRoutes.route('/').get(protect,fetchChats)
chatRoutes.route('/group').post(protect,createGroupChat)
chatRoutes.route('/rename').put(protect,renameGroup)
chatRoutes.route('/groupremove').put(protect,removeFromGroup)
chatRoutes.route('/groupadd').put(protect,addToGroup)




module.exports= chatRoutes


