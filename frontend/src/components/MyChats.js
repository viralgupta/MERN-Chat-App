import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { Box, Button, Stack, Text } from '@chakra-ui/react'
import Loadingchat from '../smallComponents/loadingchat';
import { getSender } from '../config/chatlogic';
import GroupChatModal from '../smallComponents/GroupChatModal';

const MyChats = ({fetchAgain}) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()
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
  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const { data } = await axios.get('/api/chats/', config)
      setChats(data)
    } catch (error) {
      toast.error(error, toastconfig)
    }
  }
  useEffect(() => {
    // console.log(user)
    fetchChats()
    // var chatUser = chats.users
  }, [fetchAgain])

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <GroupChatModal>
          <Button display={'flex'} fontSize={{ base: '17px', md: '10px', lg: '17px' }}>New Group Chat&nbsp;<i className="fa-solid fa-plus"></i></Button>
          </GroupChatModal>
        </Box>
        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="1g"
          overflowY="hidden"
        >
          {chats ? (<Stack overflowY={'scroll'}>
            {chats.map((chat) => {
              return <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}
                </Text>
              </Box>
            })}
          </Stack>) : (<Loadingchat />)}
        </Box>
      </Box >

    </>
  )
}

export default MyChats