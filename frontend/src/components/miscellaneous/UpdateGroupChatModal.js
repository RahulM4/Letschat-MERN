// @ts-nocheck
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, useDisclosure, FormControl,
  Input, useToast, Box, IconButton, Spinner, Text, Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [isUserList, setUserList] = useState(false);
  const toast = useToast();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setUserList(true);
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${query}`, { headers: { "Content-type": "application/json" } });
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({ title: "Search failed", status: "error", duration: 3000, isClosable: true, position: "bottom-left" });
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const { data } = await axios.put(`/api/chat/rename`, { chatId: selectedChat._id, chatName: groupChatName });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      setGroupChatName("");
      toast({ title: "Group renamed!", status: "success", duration: 2000, isClosable: true, position: "bottom" });
    } catch (error) {
      toast({ title: "Rename failed", description: error.response?.data?.message, status: "error", duration: 3000, isClosable: true, position: "bottom" });
      setRenameLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    setUserList(false);
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({ title: "User already in group", status: "warning", duration: 3000, isClosable: true, position: "bottom" });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({ title: "Only admins can add members", status: "error", duration: 3000, isClosable: true, position: "bottom" });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/chat/groupadd`, { chatId: selectedChat._id, userId: user1._id });
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({ title: "Failed to add user", description: error.response?.data?.message, status: "error", duration: 3000, isClosable: true, position: "bottom" });
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({ title: "Only admins can remove members", status: "error", duration: 3000, isClosable: true, position: "bottom" });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.put(`/api/chat/groupremove`, { chatId: selectedChat._id, userId: user1._id }, { headers: { "Content-type": "application/json" } });
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({ title: "Removal failed", description: error.response?.data?.message, status: "error", duration: 3000, isClosable: true, position: "bottom" });
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        icon={<ViewIcon />}
        onClick={onOpen}
        size="sm"
        bg="rgba(0,212,216,0.12)"
        border="1px solid rgba(0,212,216,0.25)"
        color="#00d4d8"
        borderRadius="10px"
        _hover={{ bg: "rgba(0,212,216,0.22)" }}
      />

      <Modal onClose={onClose} isOpen={isOpen} isCentered size="md">
        <ModalOverlay bg="rgba(5,7,15,0.75)" backdropFilter="blur(10px)" />
        <ModalContent
          bg="#13151f"
          border="1px solid rgba(255,255,255,0.07)"
          borderRadius="20px"
          overflow="hidden"
          boxShadow="0 40px 80px rgba(0,0,0,0.6)"
          mx="16px"
          maxH="85vh"
        >
          <Box h="1px" bgGradient="linear(90deg, transparent, #a8ff78, #00d4d8, transparent)" />

          <ModalHeader
            fontFamily="'Syne', sans-serif"
            fontWeight="800"
            fontSize="1.15rem"
            color="#f0f2ff"
            pt="22px" pb="14px" px="24px"
            letterSpacing="-0.01em"
          >
            {selectedChat.chatName}
            <Text fontSize="0.75rem" fontWeight="500" color="rgba(240,242,255,0.4)" mt="2px" letterSpacing="0.01em" fontFamily="'DM Sans', sans-serif">
              Group settings
            </Text>
          </ModalHeader>
          <ModalCloseButton
            color="rgba(240,242,255,0.4)"
            top="20px" right="20px"
            _hover={{ color: "#f0f2ff", bg: "rgba(255,255,255,0.06)" }}
            borderRadius="8px"
          />

          <ModalBody px="24px" pb="8px" display="flex" flexDir="column" gap="14px" overflowY="auto">
            {/* Current members */}
            <Box>
              <Text fontSize="0.72rem" fontWeight="600" letterSpacing="0.12em" textTransform="uppercase" color="rgba(240,242,255,0.35)" mb="8px">
                Members
              </Text>
              <Box display="flex" flexWrap="wrap" gap="4px" p="12px" bg="rgba(255,255,255,0.03)" borderRadius="12px" border="1px solid rgba(255,255,255,0.05)" minH="44px">
                {selectedChat.users.map((u) => (
                  <UserBadgeItem key={u._id} user={u} admin={selectedChat.groupAdmin._id} handleFunction={() => handleRemove(u)} />
                ))}
              </Box>
            </Box>

            {/* Rename */}
            <Box>
              <Text fontSize="0.72rem" fontWeight="600" letterSpacing="0.12em" textTransform="uppercase" color="rgba(240,242,255,0.35)" mb="8px">
                Rename Group
              </Text>
              <Flex gap="8px">
                <Input
                  placeholder="New group name..."
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRename()}
                  bg="rgba(255,255,255,0.04)"
                  border="1px solid rgba(255,255,255,0.08)"
                  borderRadius="12px"
                  color="#f0f2ff"
                  fontSize="0.875rem"
                  height="42px"
                  _placeholder={{ color: "rgba(240,242,255,0.35)" }}
                  _focus={{ borderColor: "rgba(0,212,216,0.5)", boxShadow: "0 0 0 3px rgba(0,212,216,0.1)" }}
                />
                <Button
                  onClick={handleRename}
                  isLoading={renameloading}
                  bg="rgba(0,212,216,0.15)"
                  color="#00d4d8"
                  border="1px solid rgba(0,212,216,0.25)"
                  borderRadius="12px"
                  fontWeight="600"
                  fontSize="0.82rem"
                  px="16px"
                  flexShrink="0"
                  _hover={{ bg: "rgba(0,212,216,0.25)" }}
                >
                  Rename
                </Button>
              </Flex>
            </Box>

            {/* Add member */}
            <Box>
              <Text fontSize="0.72rem" fontWeight="600" letterSpacing="0.12em" textTransform="uppercase" color="rgba(240,242,255,0.35)" mb="8px">
                Add Member
              </Text>
              <Input
                placeholder="Search users..."
                onChange={(e) => handleSearch(e.target.value)}
                bg="rgba(255,255,255,0.04)"
                border="1px solid rgba(255,255,255,0.08)"
                borderRadius="12px"
                color="#f0f2ff"
                fontSize="0.875rem"
                height="42px"
                _placeholder={{ color: "rgba(240,242,255,0.35)" }}
                _focus={{ borderColor: "rgba(0,212,216,0.5)", boxShadow: "0 0 0 3px rgba(0,212,216,0.1)" }}
              />
              <Box maxH="160px" overflowY="auto" mt="6px">
                {loading ? (
                  <Box display="flex" justifyContent="center" py="16px">
                    <Spinner color="#00d4d8" size="sm" />
                  </Box>
                ) : (
                  isUserList && searchResult?.slice(0, 4).map((u) => (
                    <UserListItem key={u._id} user={u} handleFunction={() => handleAddUser(u)} />
                  ))
                )}
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter px="24px" pt="12px" pb="22px">
            <Button
              onClick={() => handleRemove(user)}
              bg="rgba(255,80,80,0.1)"
              color="#ff7070"
              border="1px solid rgba(255,80,80,0.2)"
              borderRadius="12px"
              fontWeight="600"
              fontSize="0.875rem"
              px="20px"
              _hover={{ bg: "rgba(255,80,80,0.18)", borderColor: "rgba(255,80,80,0.35)" }}
              isLoading={loading}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
