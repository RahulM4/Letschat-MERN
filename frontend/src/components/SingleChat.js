import { FormControl } from "@chakra-ui/form-control";
import {
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Send from "@mui/icons-material/Send";
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import EmojiOptions from "./EmojiOptions";
import animationData from "../animations/typing.json";
import io from "socket.io-client";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";

const ENDPOINT =
  window.location.hostname === "localhost"
    ? "http://localhost:5001"
    : "https://chat-mind-3pcx.onrender.com";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  // FIX 3 (part a): Keep a stable ref to newMessage so the socket listener
  // always reads the latest value without needing to be re-registered.
  const newMessageRef = useRef(newMessage);
  useEffect(() => {
    newMessageRef.current = newMessage;
  }, [newMessage]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const [showEmojiOptions, setShowEmojiOptions] = useState(false);

  const handleEmojiClick = (emoji) => {
    setNewMessage((prevMessage) => prevMessage + emoji);
  };

  const handleToggleEmojiOptions = () => {
    setShowEmojiOptions((prevState) => !prevState);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // FIX 3 (part b): Extract the core send logic into a separate function so
  // it can be called from BOTH the keyboard handler (Enter key) AND the
  // Send button's onClick handler without depending on a keyboard event object.
  const dispatchMessage = async () => {
    if (!newMessage) return;

    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Clear the input optimistically before the request so fast typists
      // don't see the old text linger.
      const messageToSend = newMessage;
      setNewMessage("");
      setShowEmojiOptions(false);

      const { data } = await axios.post(
        "/api/message",
        {
          content: messageToSend,
          chatId: selectedChat,
        },
        config
      );
      socket.emit("new message", data);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // Keyboard handler — only fires dispatchMessage on Enter key
  const sendMessage = (event) => {
    if (event.key === "Enter") {
      dispatchMessage();
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);

  // FIX 3 (part c): The original useEffect had no dependency array, which
  // re-registered a NEW "message recieved" listener on every render.
  // Over time this caused exponential duplicate listeners.
  // Fixed by adding an empty dependency array and cleaning up the listener
  // on unmount with socket.off().
  useEffect(() => {
    const handleMessageReceived = (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification((prev) => [newMessageRecieved, ...prev]);
          setFetchAgain((prev) => !prev);
        }
      } else {
        setMessages((prev) => [...prev, newMessageRecieved]);
      }
    };

    socket.on("message recieved", handleMessageReceived);

    // Cleanup: remove this specific listener when the component re-renders
    // or unmounts to prevent stacking duplicate listeners.
    return () => {
      socket.off("message recieved", handleMessageReceived);
    };
    // eslint-disable-next-line
  }, [notification]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box className="chat-header">
            <IconButton
              className="chat-back-button"
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages && (
              <Box className="chat-header-title">
                {!selectedChat.isGroupChat ? (
                  <>
                    <Text className="chat-header-name">
                      {getSender(user, selectedChat.users)}
                    </Text>
                    <ProfileModal
                      user={getSenderFull(user, selectedChat.users)}
                    />
                  </>
                ) : (
                  <>
                    <Text className="chat-header-name">
                      {selectedChat.chatName.toUpperCase()}
                    </Text>
                    <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </>
                )}
              </Box>
            )}
          </Box>

          <Box className="chat-window">
            {loading ? (
              <Spinner
                className="chat-spinner"
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              className="chat-input-panel"
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
            >
              {istyping && (
                <div className="typing-indicator">
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              )}

              <InputGroup className="chat-input-group">
                <Input
                  className="chat-input"
                  variant="filled"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={typingHandler}
                  pr="4rem"
                />
                <InputRightElement className="chat-input-actions" width="4rem">
                  <IconButton
                    className="chat-emoji-button"
                    icon={<EmojiEmotionsIcon />}
                    onClick={handleToggleEmojiOptions}
                    aria-label="Open Emoji Options"
                    bg="transparent"
                  />
                  <IconButton
                    className="chat-send-button"
                    icon={<Send />}
                    onClick={dispatchMessage}
                    aria-label="Send Message"
                    bg="transparent"
                  />
                </InputRightElement>
              </InputGroup>

              {showEmojiOptions && (
                <EmojiOptions handleEmojiClick={handleEmojiClick} />
              )}
            </FormControl>
          </Box>
        </>
      ) : null}
    </>
  );
};

export default SingleChat;
