// @ts-nocheck
import { Box, Stack, Text, Flex } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button, Avatar } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import "./styles.css";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat", { headers: { "Content-Type": "application/json" } });
      setChats(data);
    } catch (error) {
      toast({ title: "Failed to load chats", status: "error", duration: 4000, isClosable: true, position: "bottom-left" });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  // Generate a colour from a string for avatar fallback
  const getAvatarBg = (name = "") => {
    const colors = ["#00d4d8", "#a8ff78", "#7c6fff", "#ff7eb3", "#ffa94d"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Box className="chat-panel chat-sidebar" display="flex" flexDir="column" alignItems="stretch" h="100%">
      {/* Header */}
      <Box className="chat-panel-header">
        <Box>
          <Text className="chat-panel-title">Messages</Text>
          <Text className="chat-panel-subtitle">Your conversations</Text>
        </Box>
        <GroupChatModal>
          <Button className="chat-panel-action">+ Group</Button>
        </GroupChatModal>
      </Box>

      {/* Chat list */}
      <Box className="chat-panel-body">
        {chats && loggedUser ? (
          <Stack className="chat-list" spacing="0">
            {chats.length === 0 && (
              <Box textAlign="center" py="40px">
                <Text fontSize="0.85rem" color="rgba(240,242,255,0.3)">No conversations yet</Text>
                <Text fontSize="0.75rem" color="rgba(240,242,255,0.2)" mt="4px">Search for users to start chatting</Text>
              </Box>
            )}
            {chats.map((chat) => {
              const chatName = !chat.isGroupChat
                ? getSender(loggedUser, chat.users || [])
                : chat.chatName;
              const isSelected = selectedChat?._id === chat._id;

              return (
                <Box
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`chat-row ${isSelected ? "selected" : ""}`}
                >
                  <Flex align="center" gap="12px">
                    <Avatar
                      size="sm"
                      name={chatName}
                      w="38px" h="38px"
                      flexShrink={0}
                      bg={getAvatarBg(chatName)}
                      color="#071014"
                      fontWeight="700"
                      fontSize="0.8rem"
                    />
                    <Box flex="1" minW="0">
                      <Text className="chat-row-title" noOfLines={1}>{chatName}</Text>
                      {chat.latestMessage && (
                        <Text className="chat-row-preview" noOfLines={1}>
                          {chat.latestMessage.sender?.name?.split(" ")[0]}: {chat.latestMessage.content.length > 38
                            ? chat.latestMessage.content.substring(0, 38) + "…"
                            : chat.latestMessage.content}
                        </Text>
                      )}
                    </Box>
                    {/* Unread indicator dot placeholder */}
                    {isSelected && (
                      <Box w="7px" h="7px" borderRadius="50%" bg="#00d4d8" flexShrink={0} boxShadow="0 0 8px rgba(0,212,216,0.6)" />
                    )}
                  </Flex>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
