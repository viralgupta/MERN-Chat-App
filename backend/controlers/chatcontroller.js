const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatmodel')
const User = require('../models/userModel')

const accessChats = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ success: false, message: "UserId param not sent with request!" })
    }
    else {
        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } }
            ]
        }).populate("users", "-password").populate("latestMessage")

        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name picture email"
        })

        if (isChat.length > 0) {
            res.status(200).send(isChat[0])
        }
        else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId]
            }
            try {
                const createdChat = await Chat.create(chatData);
                const fullChat = await Chat.findOne(createdChat._id).populate("users", "-password")
                res.status(200).send(fullChat)

            } catch (error) {
                res.status(400).json({ success: false, error: error })
            }
        }
    }
})


const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", "-password").populate("latestMessage").populate("groupAdmin", "-password").sort({ updatedAt: -1 }).then(async (result) => {
            result = await User.populate(result, {
                path: "latestMessage.sender",
                select: "name picture email"
            })
            res.status(200).send(result)
        })
    }
    catch (error) {
        res.status(400).send(error)
    }
})

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        res.status(400).json({ success: false, message: "Please fill all the fields!" })
    }
    else {
        var users = JSON.parse(req.body.users)
        users.push(req.user);
        if (users.length < 2) {
            res.status(400).json({ success: false, message: "More than 2 Users are required to form a group chat!" })
        }
        else {
            try {
                const groupChat = await Chat.create({
                    chatName: req.body.name,
                    users: users,
                    isGroupChat: true,
                    groupAdmin: req.user
                })
                let fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password")

                res.status(200).send(fullGroupChat)
            } catch (error) {
                res.status(400).json({ success: false, error })
            }
        }
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    if (!req.body.chatId || !req.body.chatName) {
        res.status(400).json({ success: false, message: "Please Provide all the fields!" })
    }
    else {
        const chat = await Chat.findById(req.body.chatId)
        if (toString(chat.groupAdmin._id) === toString(req.user._id)) {
            try {
                const updated = await Chat.findByIdAndUpdate(req.body.chatId, { chatName: req.body.chatName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password")
                if (updated) {
                    res.status(200).send(updated)
                }
                else {
                    res.status(400).json({ success: false, message: "Chat not found!" })
                }
            }
            catch (error) {
                res.status(400).json({ success: false, error })
            }
        }
        else {
            res.status(400).json({ success: false, message: "You are not the group Admin!" })
        }
    }
})

const removeFromGroup = asyncHandler(async (req, res) => {
    if (!req.body.chatId || !req.body.userId) {
        res.status(200).json({ success: false, message: "Please Provide all the fields!" })
    }
    else {
        const chat = await Chat.findById(req.body.chatId)
        if (toString(chat.groupAdmin._id) === toString(req.user._id)) {
            try {
                const newchat = await Chat.findByIdAndUpdate(req.body.chatId, { $pull: { users: req.body.userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password")
                if (newchat) {
                    res.status(200).send(newchat)
                }
                else {
                    res.status(400).json({ success: false, message: "Chat not found!" })
                }
            }
            catch (error) {
                res.status(400).json({ success: false, error })
            }
        }
        else {
            res.status(400).json({ success: false, message: "You are not the group Admin!" })
        }
    }
})


const addToGroup = asyncHandler(async (req, res) => {
    if (!req.body.chatId || !req.body.userId) {
        res.status(200).json({ success: false, message: "Please Provide all the fields!" })
    }
    else {
        const chat = await Chat.findById(req.body.chatId)
        if (toString(chat.groupAdmin._id) === toString(req.user._id)) {
            try {
                const checknum = 1
                // const count = await Chat.countDocuments({_id:req.body.chatId, users: {$elemMatch: {_id: req.body.userId}}})
                if (checknum > 0) {
                    const newchat = await Chat.findByIdAndUpdate(req.body.chatId, { $push: { users: req.body.userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password")
                    res.status(200).send(newchat)
                }
                else {
                    res.status(400).json({ success: false, message: "User Already exists!" })
                }
            }
            catch (error) {
                res.status(400).json({ success: false, error })
            }
        }
        else {
            res.status(400).json({ success: false, message: "You are not the group Admin!" })
        }
    }
})

module.exports = { accessChats, fetchChats, createGroupChat, renameGroup, removeFromGroup, addToGroup }