// @ts-nocheck
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton, Button, useDisclosure,
  FormControl, Input, useToast, Box, Text, Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({ title: "User already added", status: "warning", duration: 3000, isClosable: true, position: "top" });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
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

  const handleDelete = (delUser) => setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));

  const handleSubmit = async () => {
    if (selectedUsers.length <= 2) {
      toast({ title: "Please select more than 2 users", status: "warning", duration: 3000, isClosable: true, position: "top" });
      return;
    }
    if (!groupChatName) {
      toast({ title: "Please add a group name", status: "warning", duration: 3000, isClosable: true, position: "top" });
      return;
    }
    try {
      const { data } = await axios.post(`/api/chat/group`,
        { name: groupChatName, users: JSON.stringify(selectedUsers.map((u) => u._id)) },
        { headers: { "Content-type": "application/json" } }
      );
      setChats([data, ...chats]);
      onClose();
      toast({ title: "Group chat created!", status: "success", duration: 3000, isClosable: true, position: "bottom" });
    } catch (error) {
      toast({ title: "Failed to create group", description: error.response?.data, status: "error", duration: 3000, isClosable: true, position: "bottom" });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal onClose={onClose} isOpen={isOpen} isCentered size="md">
        <ModalOverlay bg="rgba(5,7,15,0.75)" backdropFilter="blur(10px)" />
        <ModalContent
          bg="#13151f"
          border="1px solid rgba(255,255,255,0.07)"
          borderRadius="20px"
          overflow="hidden"
          boxShadow="0 40px 80px rgba(0,0,0,0.6)"
          mx="16px"
        >
          {/* Top accent line */}
          <Box h="1px" bgGradient="linear(90deg, transparent, #00d4d8, transparent)" />

          <ModalHeader
            fontFamily="'Syne', sans-serif"
            fontWeight="800"
            fontSize="1.25rem"
            color="#f0f2ff"
            pt="24px" pb="16px" px="24px"
            letterSpacing="-0.01em"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton
            color="rgba(240,242,255,0.4)"
            top="20px" right="20px"
            _hover={{ color: "#f0f2ff", bg: "rgba(255,255,255,0.06)" }}
            borderRadius="8px"
          />

          <ModalBody px="24px" pb="8px" display="flex" flexDir="column" gap="12px">
            <FormControl>
              <Input
                placeholder="Group name..."
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                bg="rgba(255,255,255,0.04)"
                border="1px solid rgba(255,255,255,0.08)"
                borderRadius="12px"
                color="#f0f2ff"
                fontSize="0.9rem"
                height="44px"
                px="16px"
                _placeholder={{ color: "rgba(240,242,255,0.35)" }}
                _focus={{ borderColor: "rgba(0,212,216,0.5)", boxShadow: "0 0 0 3px rgba(0,212,216,0.1)" }}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Search users to add..."
                onChange={(e) => handleSearch(e.target.value)}
                bg="rgba(255,255,255,0.04)"
                border="1px solid rgba(255,255,255,0.08)"
                borderRadius="12px"
                color="#f0f2ff"
                fontSize="0.9rem"
                height="44px"
                px="16px"
                _placeholder={{ color: "rgba(240,242,255,0.35)" }}
                _focus={{ borderColor: "rgba(0,212,216,0.5)", boxShadow: "0 0 0 3px rgba(0,212,216,0.1)" }}
              />
            </FormControl>

            {/* Selected user badges */}
            {selectedUsers.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap="4px" p="10px" bg="rgba(255,255,255,0.03)" borderRadius="12px" border="1px solid rgba(255,255,255,0.05)">
                {selectedUsers.map((u) => (
                  <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                ))}
              </Box>
            )}

            {/* Search results */}
            <Box maxH="200px" overflowY="auto">
              {loading ? (
                <Box display="flex" justifyContent="center" py="20px">
                  <Spinner color="#00d4d8" size="md" />
                </Box>
              ) : (
                searchResult?.slice(0, 5).map((user) => (
                  <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter px="24px" pt="12px" pb="24px" gap="10px">
            <Button
              variant="ghost"
              onClick={onClose}
              color="rgba(240,242,255,0.5)"
              borderRadius="12px"
              fontSize="0.875rem"
              _hover={{ bg: "rgba(255,255,255,0.05)", color: "#f0f2ff" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              bg="linear-gradient(135deg, #00d4d8, #00b8bc)"
              color="#071014"
              fontWeight="700"
              fontSize="0.875rem"
              borderRadius="12px"
              px="24px"
              boxShadow="0 6px 20px rgba(0,212,216,0.35)"
              _hover={{ transform: "translateY(-1px)", boxShadow: "0 10px 28px rgba(0,212,216,0.45)" }}
              _active={{ transform: "none" }}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
