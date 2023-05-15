import React from 'react'
import { ChatState } from '../context/chatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain}) => {
  const {selectedChat} = ChatState()

  return (
    <>
    <Box w={{base: '100%' , md: '68%'}} alignItems={'center'} flexDir={'column'} p={3} backgroundColor={'white'} display={{base: selectedChat? "flex": "none", md: 'flex'}} borderRadius={'lg'} borderWidth={'1px'}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </Box>
    </>
  )
}

export default ChatBox