const express = require('express')
const { protect } = require('../middlewear/authMiddleware')
const { sendMessage, allMessages } = require('../controlers/messageController')

const messageRoutes = express.Router()

messageRoutes.route('/').post(protect, sendMessage)
messageRoutes.route('/:chatId').get(protect, allMessages)

module.exports = messageRoutes