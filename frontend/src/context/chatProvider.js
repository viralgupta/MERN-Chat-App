import {createContext, useContext, useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom'

const ChatContext = createContext()

const ChatProvider = ({children})=>{
    const history = useHistory()
    const [selectedChat, setSelectedChat] = useState()
    const [chats, setChats] = useState([])
    const [user, setUser] = useState()
    const [notification, setNotification] = useState([])
    useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        setUser(userInfo)
    }, [history])
    
    return <ChatContext.Provider value={{user, setUser, selectedChat, setSelectedChat, chats, setChats, notification, setNotification}}>
        {children}
    </ChatContext.Provider>
}

export const ChatState = () => {
    return useContext(ChatContext)
}

export default ChatProvider