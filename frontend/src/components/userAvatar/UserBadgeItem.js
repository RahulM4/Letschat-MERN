import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      gap="6px"
      px="10px"
      py="4px"
      m="3px"
      borderRadius="999px"
      fontSize="0.75rem"
      fontWeight="600"
      cursor="pointer"
      bg="rgba(0,212,216,0.15)"
      color="#00d4d8"
      border="1px solid rgba(0,212,216,0.3)"
      transition="all 0.2s"
      onClick={handleFunction}
      _hover={{ bg: "rgba(0,212,216,0.25)", transform: "translateY(-1px)" }}
    >
      {user.name}
      {admin === user._id && <span style={{ opacity: 0.7 }}> (Admin)</span>}
      <CloseIcon boxSize="8px" opacity="0.7" />
    </Box>
  );
};

export default UserBadgeItem;
