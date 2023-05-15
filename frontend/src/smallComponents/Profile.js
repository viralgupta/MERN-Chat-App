import React from 'react'
import { ChatState } from '../context/chatProvider'
import { IconButton, useDisclosure, ModalBody, ModalOverlay, Modal, ModalContent, ModalCloseButton, ModalHeader, ModalFooter, Button, Image, Text } from '@chakra-ui/react'
const Profile = ({user,  children }) => {

  const { isOpen, onOpen, onClose } = useDisclosure()
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
        <ModalHeader>Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div onClick={onOpen} className='mx-auto w-min'>
            <Image className='h-40 mx-auto rounded-full' src={user.picture}></Image>
            <Text className='p-2 text-md font-bold' >Name: {user.name}</Text>
            <Text className='p-2 text-md font-bold'>Email:&nbsp;{user.email}</Text>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default Profile