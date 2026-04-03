import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      display="flex"
      alignItems="center"
      gap="12px"
      w="100%"
      py="10px"
      px="14px"
      mb="4px"
      borderRadius="12px"
      border="1px solid transparent"
      transition="all 0.2s ease"
      _hover={{
        bg: "rgba(0,212,216,0.1)",
        borderColor: "rgba(0,212,216,0.2)",
      }}
    >
      <Avatar
        size="sm"
        name={user.name}
        src={user.pic}
        border="2px solid rgba(0,212,216,0.3)"
      />
      <Box>
        <Text fontSize="0.875rem" fontWeight="600" color="#f0f2ff">{user.name}</Text>
        <Text fontSize="0.75rem" color="rgba(240,242,255,0.45)">{user.email}</Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
