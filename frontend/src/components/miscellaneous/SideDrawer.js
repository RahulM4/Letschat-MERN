// @ts-nocheck
import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Flex, Text } from "@chakra-ui/layout";
import {
  Menu, MenuButton, MenuDivider, MenuItem, MenuList,
} from "@chakra-ui/menu";
import {
  Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay,
} from "@chakra-ui/modal";
import "./SideDrawer.css";
import { Tooltip } from "@chakra-ui/tooltip";
import {
  BellIcon, ChevronDownIcon, EditIcon, ExternalLinkIcon,
} from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import React from "react";

function SideDrawer({ fetchAgain }) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { setSelectedChat, user, notification, setNotification, chats, setChats, setIsAuth } = ChatState();
  const localUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const profileBio = user?.bio?.trim() || localUserInfo.bio?.trim() || "No bio added yet.";

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isNotifOpen, onOpen: onNotifOpen, onClose: onNotifClose } = useDisclosure();
  const history = useHistory();

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`/api/notification`, { headers: { "Content-type": "application/json" } });
      setNotification(data);
    } catch (error) { console.error("Failed to fetch notifications", error); }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setIsAuth(false);
    history.push("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({ title: "Please enter something to search", status: "warning", duration: 4000, isClosable: true, position: "top-left" });
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${search}`, { headers: { "Content-type": "application/json" } });
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({ title: "Search failed", status: "error", duration: 4000, isClosable: true, position: "bottom-left" });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(`/api/chat`, { userId }, { headers: { "Content-type": "application/json" } });
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({ title: "Error fetching chat", description: error.message, status: "error", duration: 4000, isClosable: true, position: "bottom-left" });
    }
  };

  useEffect(() => { if (user) fetchNotifications(); }, [user, fetchAgain]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#161820"
        w="100%"
        px="20px"
        h="64px"
        borderBottomWidth="1px"
        borderColor="rgba(255,255,255,0.07)"
        position="sticky"
        top="0"
        zIndex="50"
      >
        {/* LEFT: Search */}
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            onClick={onOpen}
            display="flex"
            alignItems="center"
            gap="8px"
            px="14px"
            h="38px"
            bg="rgba(255,255,255,0.04)"
            border="1px solid rgba(255,255,255,0.07)"
            borderRadius="10px"
            color="rgba(240,242,255,0.55)"
            fontSize="0.82rem"
            fontWeight="500"
            _hover={{ bg: "rgba(255,255,255,0.08)", color: "rgba(240,242,255,0.9)" }}
            _active={{ bg: "rgba(255,255,255,0.04)" }}
          >
            <i className="fas fa-search" style={{ fontSize: "0.78rem" }}></i>
            <Text display={{ base: "none", md: "block" }}>Search users</Text>
          </Button>
        </Tooltip>

        {/* CENTER: Logo */}
        <Box
          fontFamily="'Syne', sans-serif"
          fontSize="1.35rem"
          fontWeight="800"
          letterSpacing="-0.02em"
          bgGradient="linear(130deg, #00d4d8, #a8ff78)"
          bgClip="text"
          color="transparent"
        >
          LetsChat
        </Box>

        {/* RIGHT: Notifications + Avatar */}
        <Flex alignItems="center" gap="6px">
          <Menu isOpen={isNotifOpen} onClose={onNotifClose}>
            <MenuButton
              as={Button}
              p="0"
              h="38px"
              w="38px"
              minW="38px"
              bg="rgba(255,255,255,0.04)"
              border="1px solid rgba(255,255,255,0.07)"
              borderRadius="10px"
              _hover={{ bg: "rgba(255,255,255,0.08)" }}
              onClick={onNotifOpen}
            >
              <Box position="relative" display="flex" alignItems="center" justifyContent="center">
                <NotificationBadge count={notification.length} effect={Effect.SCALE} />
                <BellIcon color="rgba(240,242,255,0.6)" fontSize="16px" />
              </Box>
            </MenuButton>
            <MenuList
              bg="#1e2130"
              border="1px solid rgba(255,255,255,0.08)"
              borderRadius="14px"
              boxShadow="0 24px 48px rgba(0,0,0,0.5)"
              p="8px"
              minW="250px"
            >
              {!notification.length && (
                <MenuItem bg="transparent" color="rgba(240,242,255,0.45)" fontSize="0.85rem" _hover={{ bg: "rgba(255,255,255,0.04)" }} borderRadius="8px">
                  No new messages
                </MenuItem>
              )}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  borderRadius="8px"
                  bg="transparent"
                  color="rgba(240,242,255,0.8)"
                  fontSize="0.85rem"
                  _hover={{ bg: "rgba(0,212,216,0.1)", color: "#f0f2ff" }}
                  onClick={async () => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                    try { await axios.delete(`/api/notification/${notif._id}`); } catch {}
                    onNotifClose();
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton
              as={Button}
              p="0"
              h="38px"
              bg="transparent"
              border="none"
              _hover={{ bg: "transparent" }}
              display="flex"
              alignItems="center"
              gap="6px"
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
                border="2px solid rgba(0,212,216,0.5)"
                boxShadow="0 0 12px rgba(0,212,216,0.2)"
              />
              <ChevronDownIcon color="rgba(240,242,255,0.4)" fontSize="12px" />
            </MenuButton>

            <MenuList
              bg="#1e2130"
              border="1px solid rgba(255,255,255,0.08)"
              borderRadius="16px"
              boxShadow="0 24px 48px rgba(0,0,0,0.5)"
              p="8px"
              minW="230px"
            >
              <Box px="12px" py="14px" bg="rgba(255,255,255,0.03)" borderRadius="10px" mb="8px">
                <Flex alignItems="center" gap="12px">
                  <Avatar size="md" name={user.name} src={user.pic} border="2px solid rgba(0,212,216,0.4)" />
                  <Box>
                    <Text fontWeight="700" fontSize="0.9rem" color="#f0f2ff" fontFamily="'Syne', sans-serif">{user.name}</Text>
                    <Text fontSize="0.75rem" color="rgba(240,242,255,0.5)">{user.email}</Text>
                  </Box>
                </Flex>
                <Text mt="10px" fontSize="0.75rem" color="rgba(240,242,255,0.6)" lineHeight="1.5">{profileBio}</Text>
              </Box>
              <MenuDivider borderColor="rgba(255,255,255,0.06)" />
              <ProfileModal user={user}>
                <MenuItem bg="transparent" color="rgba(240,242,255,0.75)" fontSize="0.85rem" borderRadius="8px" _hover={{ bg: "rgba(255,255,255,0.06)", color: "#f0f2ff" }}>
                  <EditIcon mr="8px" boxSize="14px" /> Profile
                </MenuItem>
              </ProfileModal>
              <MenuItem bg="transparent" color="rgba(240,242,255,0.75)" fontSize="0.85rem" borderRadius="8px" _hover={{ bg: "rgba(255,100,100,0.1)", color: "#ff8080" }} onClick={logoutHandler}>
                <ExternalLinkIcon mr="8px" boxSize="14px" /> Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>

      {/* SEARCH DRAWER */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay bg="rgba(0,0,0,0.6)" backdropFilter="blur(8px)" />
        <DrawerContent bg="#13151f" color="#f0f2ff" borderRight="1px solid rgba(255,255,255,0.07)" maxW="320px">
          <DrawerHeader
            fontFamily="'Syne', sans-serif"
            fontWeight="800"
            fontSize="1.1rem"
            borderBottomWidth="1px"
            borderColor="rgba(255,255,255,0.07)"
            bgGradient="linear(130deg, #00d4d8, #a8ff78)"
            bgClip="text"
            color="transparent"
          >
            Find People
          </DrawerHeader>
          <DrawerBody pt="16px">
            <Box display="flex" pb="16px" gap="8px">
              <Input
                placeholder="Name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                bg="rgba(255,255,255,0.05)"
                border="1px solid rgba(255,255,255,0.08)"
                borderRadius="10px"
                color="#f0f2ff"
                fontSize="0.875rem"
                _placeholder={{ color: "rgba(240,242,255,0.4)" }}
                _focus={{ borderColor: "rgba(0,212,216,0.5)", boxShadow: "0 0 0 3px rgba(0,212,216,0.1)" }}
              />
              <Button
                onClick={handleSearch}
                bg="linear-gradient(135deg, #00d4d8, #00b8bc)"
                color="#071014"
                fontWeight="600"
                fontSize="0.85rem"
                borderRadius="10px"
                _hover={{ opacity: 0.9 }}
                _active={{ opacity: 0.8 }}
                px="16px"
              >
                Go
              </Button>
            </Box>
            {loading ? <ChatLoading /> : (
              searchResult?.map((myuser) => (
                <UserListItem key={myuser._id} user={myuser} handleFunction={() => accessChat(myuser._id)} />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" color="#00d4d8" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
