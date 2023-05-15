import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
    return (
        <Box
            px={2}
            py={1}
            borderRadius="2xl"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorscheme="purple"
            cursor="pointer"
            onClick={handleFunction}
            bgColor={'purple.100'}
        >
            {user.name}&nbsp;<i className="fa-solid fa-x"></i>
        </Box>
    )
}

export default UserBadgeItem