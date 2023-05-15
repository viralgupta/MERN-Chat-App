import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text } from '@chakra-ui/react'
import { getSender, getSenderFull } from '../config/chatlogic'
import Profile from '../smallComponents/Profile'
import UpdateGroupChatModal from '../smallComponents/UpdateGroupChatModal'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import '../styles.css'
import ScrollableChatMessages from './ScrollableChatMessages'
import { io } from 'socket.io-client'

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [newMessage, setNewMessage] = useState('')
    const { notification, setNotification, user, selectedChat, setSelectedChat } = ChatState()
    const token = localStorage.getItem('token')
    const [socketConnected, setSocketConnected] = useState(true)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const toastconfig = {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
    };




    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
        setLoading(false)
    }, [selectedChat])
    
    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit("setup", user)
        socket.on('connected', () => {
            setSocketConnected(true)
        })
    }, [])


    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification])
                    setFetchAgain(!fetchAgain)
                    console.log(notification)
                }
            }
            else {
                setMessages([...messages, newMessageRecieved])
            }
        })
        socket.on('typing', () => { setIsTyping(true) })
        socket.on('stop typing', () => { setIsTyping(false) })
    })

    const typingHandler = async (e) => {
            setNewMessage(e.target.value)
            if (!socketConnected) {
                return;
            }
            if (!typing) {
                setTyping(true)
                socket.emit('typing', selectedChat._id)
            }
            let lastTypingTime = new Date().getTime()
            var timerlen = 3000
            setTimeout(() => {
                var timenow = new Date().getTime()
                var timeDiff = timenow - lastTypingTime;
                let newtype = gettyping()
                if (timeDiff >= timerlen) {
                    socket.emit("stop typing", selectedChat._id)
                    setTyping(false)
                }
            }, timerlen)
    }
    
    const gettyping = () =>{
        return typing
    }
    
    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit('stop typing', selectedChat._id)
            setTyping(false)
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
                setNewMessage('')
                const { data } = await axios.post('/api/message/', {
                    chatId: selectedChat._id,
                    content: newMessage
                }, config);
                socket.emit('new message', data)
                setMessages([...messages, data])
                fetchMessages()
            } catch (error) {
                toast.error("Unable to send the message", toastconfig)
            }
        }
    }

    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)
            setMessages(data)
            socket.emit("join chat", selectedChat._id)
            setLoading(false)
        } catch (error) {
            toast.error("Unable to fetch the messages", toastconfig)
        }
    }

    return (
        <>
            {!selectedChat && <Box className='text-2xl'>Click on a user to start chating!</Box>}
            {selectedChat && <>
                <Text
                    fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                >
                    <IconButton display={{ base: 'flex', md: 'none' }} onClick={() => setSelectedChat('')}>
                        <i className="fa-sharp fa-solid fa-left-long"></i>
                    </IconButton>
                    {selectedChat.isGroupChat ? (<>{selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChatModal
                            fetchAgain={fetchAgain}
                            setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                    </>) : <>
                        {getSender(user, selectedChat.users).toUpperCase()}
                        <Profile user={getSenderFull(user, selectedChat.users)}></Profile>

                    </>}
                </Text>
                <Box display="flex"
                    flexDir="column"
                    justifyContent="flex-end"
                    p={3}
                    bg="#E8E8E8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflowY="hidden">
                    {loading ? <Spinner size={'xl'} w={20} h={20} alignSelf={'center'} margin={'auto'} /> : <>
                        <div>
                            <ScrollableChatMessages messages={messages} />
                        </div>
                    </>}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {isTyping ? <div className='px-3 bg-gray-300 w-min mb-2 ml-2 rounded-full'>Typing...</div> : <></>}
                        <Input variant={'filled'} bg={'#E0E0E0'} value={newMessage} placeholder='Enter a message...' onChange={typingHandler} />
                    </FormControl>
                </Box>
            </>}
        </>
    )
}

export default SingleChat