import React, { useRef, useState } from 'react'
import { ChatState } from '../context/chatProvider'
import { IconButton, useDisclosure, ModalBody, ModalOverlay, Modal, ModalContent, ModalCloseButton, ModalHeader, ModalFooter, Button, Image, Text, FormControl, Input, Box } from '@chakra-ui/react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';

const GroupChatModal = ({ children }) => {
    const { user, chats, setChats } = ChatState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUser, setSelectedUser] = useState([])
    const search = useRef('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
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
    const handleSearch = async () => {
        if (!search.current.value) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.get(`/api/user?search=${search.current.value}`, config)
            setSearchResults(data)
            setLoading(false)
        } catch (error) {
            toast.error('Failed to Load the Search Results', toastconfig)
        }
    }
    const handlegroup = (userToAdd) => {
        if (selectedUser.includes(userToAdd)) {
            toast.warn('User Already Added', toastconfig)
            return;
        }
        setSelectedUser([...selectedUser, userToAdd])
    }
    const handleSubmit = async () => {
        if (!groupChatName || selectedUser.length < 2) {
            toast.error("Please fill all the fields!", toastconfig)
            return;
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
            const { data } = await axios.post("/api/chats/group/", {
                name: groupChatName,
                users: JSON.stringify(selectedUser.map((u) => u._id))
            }, config)
            setChats([data, ...chats])
            onClose()
            toast.success("New Group Chat Created!", toastconfig)
        } catch (error) {
            toast.warn('Unable to Create Group Chat!')
        }
    }
    const handleDelete = (userToDelete) => {
        if (!selectedUser.includes(userToDelete)) {
            toast.error('User cannot be removed', toastconfig)
        }
        else {
            setSelectedUser(selectedUser.filter((sel) => (sel._id !== userToDelete._id)))
        }
    }



    return (<>
        {children ? <span onClick={onOpen}>{children}</span> : <IconButton
            display={{ base: 'flex' }}
            icon={<i className="fa-solid fa-eye"></i>}
            onClick={onOpen}
        />
        }
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={'35px'} justifyContent={'center'}>Create New Group</ModalHeader>
                <ModalCloseButton />
                <ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
                    <FormControl>
                        <Input placeholder='Chat Name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <Input placeholder='Add Users' mb={1} ref={search} onChange={handleSearch} />
                    </FormControl>
                    <Box display={'flex'}>
                        {selectedUser.map(u => {
                            return <Box key={u._id} display={'flex'} w={'fit-content'} flexWrap={'wrap'}><UserBadgeItem user={u} handleFunction={() => { handleDelete(u) }} /></Box>
                        })
                        }
                    </Box>
                    {loading ? <div>Loading Search Results...</div> :
                        searchResults.slice(0, 4).map(user => {
                            return <div key={user._id} className='mt-1 w-full'><UserListItem user={user} handleFunction={() => { handlegroup(user) }} /></div>
                        })
                    }
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                        Create Chat
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>
    )
}

export default GroupChatModal