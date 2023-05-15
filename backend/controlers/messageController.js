const express = require('express')
const asyncHandler = require('express-async-handler')
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Chat = require('../models/chatmodel');

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        return res.sendStatus(400)
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    }
    try {
        var message = await Message.create(newMessage)
        message = await message.populate([{ path: 'sender', select: 'name picture' }]);
        message = await message.populate(['chat']);
        message = await User.populate(message, {
            path: 'chat.users',
            select: "name picture email"
        })
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message })
        res.json(message)
    } catch (error) {
        res.status(400).json("Error occured while creating a message")
    }
})

const allMessages = asyncHandler(async (req, res) => {
    if (!req.params.chatId) {
        return res.sendStatus(400).json("Please Enter a chatId")
    }
    try {
        var message = await Message.find({
            chat: req.params.chatId,
        }).populate("sender", "name picture email").populate('chat')
        res.status(200).send(message)
    } catch (error) {
        res.status(400).json("Error occured while finding messages")
    }
})
module.exports = { sendMessage, allMessages }
