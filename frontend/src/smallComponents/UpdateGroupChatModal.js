import React, { useRef, useState } from 'react'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { ChatState } from '../context/chatProvider'
import UserBadgeItem from './UserBadgeItem'
import UserListItem from './UserListItem'
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import axios from 'axios'

const UpdateGroupChatModal = (fetchMessages, fetchAgain, setFetchAgain) => {

    const search = useRef('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user, selectedChat, setSelectedChat } = ChatState()
    const [groupChatName, setGroupChatName] = useState('')
    const token = localStorage.getItem('token')
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
    const handleRename = async () => {
        if (!groupChatName) return;
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.put('/api/chats/rename', {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)
            if (data._id) {
                setSelectedChat(data)
                // setFetchAgain(!fetchAgain)
                window.location.reload(true)
                toast.success("Group Renamed", toastconfig)
            }
            else {
                toast.error("Error Occured while Renaming", toastconfig)
            }
            setRenameLoading(false)
        } catch (error) {
            console.log(error)
            toast.error("Error Occured while Renaming", toastconfig)
            setRenameLoading(false)
        }
        setGroupChatName('')
    }
    const handleSearch = async () => {
        if (!search.current.value) {
            toast.error("Please Enter a name to Search!", toastconfig)
        }
        else {
            try {
                setLoading(true)
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await axios.get(`/api/user?search=${search.current.value}`, config)
                setLoading(false);
                setSearchResult(data)

            } catch (error) {
                toast.error("Error Occured While Fetching", toastconfig)
            }
        }
    }
    const handleAdd = async (userToAdd) => {
        if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
            toast.warn('User already in group!', toastconfig)
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast.error("Only Admins can add someone!", toastconfig)
            return;
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        try {
            setLoading(true)
            const { data } = await axios.put('/api/chats/groupadd', {
                chatId: selectedChat._id,
                userId: userToAdd._id
            }, config)
            if (data._id) {
                toast.success("User Added Successfully!", toastconfig)
                // setFetchAgain(!fetchAgain)
                setSelectedChat(data)
                setLoading(false)
            }
        } catch (error) {
            toast.error("Error In Adding User!", toastconfig)
            setLoading(false)
        }
    }
    const handleDelete = async (userToDelete) => {
        if (selectedChat.groupAdmin._id !== user._id) {
            toast.error("Only Admins can Remove someone!", toastconfig)
            return;
        }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        try {
            setLoading(true)
            const { data } = await axios.put('/api/chats/groupremove', {
                chatId: selectedChat._id,
                userId: userToDelete._id
            }, config)
            if (data._id) {
                toast.success("User Removed Successfully!", toastconfig)
                userToDelete._id === user._id ? setSelectedChat() : setSelectedChat(data)
                userToDelete._id === user._id && window.location.reload(true)
                // fetchMessages()
                // setFetchAgain(!fetchAgain)
                setLoading(false)
            }
        } catch (error) {
            toast.error("Error in removing user!", toastconfig)
            setLoading(false)
        }
    }
    return (
        <>
            <IconButton
                display={{ base: 'flex' }}
                icon={<i className="fa-solid fa-eye"></i>}
                onClick={onOpen}
            />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w={'100%'} display={'flex'} flexWrap={'wrap'}>
                            {selectedChat.users.map((user) => {
                                return <UserBadgeItem key={user._id} user={user} handleFunction={() => { handleDelete(user) }} />
                            })}
                            <FormControl display="flex">
                                <Input
                                    placeholder="Chat Name"
                                    mb={3}
                                    value={groupChatName}
                                    onChange={(e) => setGroupChatName(e.target.value)}
                                />
                                <Button
                                    variant="solid"
                                    colorScheme='teal'
                                    ml={1}
                                    isLoading={renameLoading}
                                    onClick={handleRename}
                                >
                                    Update
                                </Button>
                            </FormControl>
                            <FormControl display={'flex '}>
                                <Input
                                    placeholder="Add User to group"
                                    mb={1}
                                    ref={search}
                                    onChange={handleSearch}
                                />
                            </FormControl>
                            {loading ? <div>Loading Search Results...</div> :
                                searchResult.slice(0, 4).map(user => {
                                    return <div key={user._id} className='mt-1 w-full'><UserListItem user={user} handleFunction={() => { handleAdd(user) }} /></div>
                                })
                            }
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={() => { handleDelete(user) }}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal >
        </>
    )
}

export default UpdateGroupChatModal