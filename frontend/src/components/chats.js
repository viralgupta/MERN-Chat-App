import React, { useState } from 'react'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ChatState } from '../context/chatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../smallComponents/SideDrawer';
import MyChats from './MyChats';
import ChatBox from './ChatBox';

const Chats = () => {
  const history = useHistory()
  const [fetchAgain, setFetchAgain] = useState(false)
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if(!userInfo){
        history.push("/")
      }
  }, [history])

  const {user} = ChatState();

  return (
    <>
    <div style={{width: "100%"}}>
      {user && <SideDrawer/>}
      <Box
      display={"flex"}
      justifyContent={'space-between'}
      w={'100%'}
      h={"91.5vh"}
      p={'10px'}
      >
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
    </>
  )
}

export default Chats