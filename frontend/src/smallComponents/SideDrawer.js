import { Box, Tooltip, Button, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, Spinner } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../context/chatProvider';
import Profile from './Profile';
import { useHistory } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import Loadingchat from './loadingchat';
import UserListItem from './UserListItem';
import { getSender } from '../config/chatlogic';

const SideDrawer = () => {
    const history = useHistory()
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    const {notification,setNotification,  user, setSelectedChat, chats, setChats } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()
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
    const intiateLogout = () => {
        localStorage.removeItem('userInfo')
        localStorage.removeItem('token')
        localStorage.removeItem('chakra-ui-color-mode')
        history.push('/')
    }
    const handleSearch = async () => {
        if (!search) {
            toast.error("Please Enter a name to Search!", toastconfig)
        }
        else {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await axios.get(`/api/user?search=${search}`, config)
                setLoading(false);
                setSearchResult(data)
            } catch (error) {

            }
        }
    }
    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const token = localStorage.getItem('token')
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await axios.post('/api/chats/', { userId }, config)
            if (!chats.find((c) => (c._id === data._id))) { setChats([data, ...chats]) }
            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (error) {
            console.log(error)
            toast.error('Error Creating/Fetching Chat! ', toastconfig)
        }
    }
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
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bg={'white'}
                w={'100%'}
                p={'5px 10px 5px 10px'}
                borderWidth={'5px'}

            >
                <Tooltip label="Search Users to Chat" placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "flex" }} px='4'>Search User</Text>
                    </Button>
                </Tooltip>
                <Text fontSize={'2xl'} fontFamily={'Work sans'}>Talk-A-Tive</Text>
                <div>
                    <Menu>
                        <MenuButton px={3} ><i className="fa-solid fa-bell"></i>
                            <div className='translate-x-2 -translate-y-7 w-4 text-xs bg-red-600 text-white rounded-md'>{notification && Object.keys(notification).length}</div>
                        </MenuButton>
                        <MenuList overflowY={'hidden'} p={2}>
                            {!notification.length && <div className='px-10 w-full'>No New Messages</div>  }
                            {notification.map(notif=>{
                                return <MenuItem onClick={()=>{setSelectedChat(notif.chat); setNotification(notification.filter((n)=>n !== notif))}} w={'100%'} key={notif._id} backgroundColor={'blue.300'} mt={1} borderRadius={'5px'}>
                                    {notif.chat.isGroupChat && `New message in ${notif.chat.chatName}`}
                                    {!notif.chat.isGroupChat && `New message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            }) }
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} >
                            <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.picture}></Avatar>
                            <i className="fa-solid fa-chevron-down p-2"></i>
                        </MenuButton>
                        <MenuList>
                            <Profile user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </Profile>
                            <MenuDivider></MenuDivider>
                            <MenuItem onClick={intiateLogout}>Logout?</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer onClose={onClose} placement='left' isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth={'1px'} mx={'auto'}>Search User</DrawerHeader>
                    <DrawerBody>
                        <Box display={'flex'} pb={2}>
                            <Input placeholder='Search by name or email' mr={2} value={search} onChange={(e) => { setSearch(e.target.value) }} />
                            <Button
                                onClick={handleSearch}
                            >
                                Go
                            </Button>
                        </Box>
                        {loading ? <Loadingchat /> : searchResult.length > 0 ? <div>{searchResult.map((user) => {
                            return <UserListItem key={user._id} user={user} handleFunction={() => { accessChat(user._id) }} />
                        })} </div> : <div className='mx-auto'>No Results Found!</div>}
                        {loading && <Spinner ml={'auto'} display={'flex'} />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default SideDrawer