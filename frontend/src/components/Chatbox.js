// @ts-nocheck
import { Box, Text } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  if (!selectedChat) {
    return (
      <Box
        className="chatbox-panel"
        display={{ base: "none", md: "flex" }}
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        gap="16px"
        h="calc(100vh - 64px)"
        bg="var(--surface, #13151f)"
        style={{ background: "var(--surface, #13151f)" }}
      >
        {/* Decorative orb */}
        <Box position="relative">
          <Box
            w="96px" h="96px"
            borderRadius="28px"
            bg="rgba(0,212,216,0.08)"
            border="1px solid rgba(0,212,216,0.15)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{ animation: "emptyFloat 3s ease-in-out infinite" }}
          >
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="rgba(0,212,216,0.7)" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8" cy="10" r="1" fill="rgba(0,212,216,0.5)" />
              <circle cx="12" cy="10" r="1" fill="rgba(0,212,216,0.5)" />
              <circle cx="16" cy="10" r="1" fill="rgba(0,212,216,0.5)" />
            </svg>
          </Box>
          <Box
            position="absolute" inset="-8px"
            borderRadius="36px"
            border="1px solid rgba(0,212,216,0.08)"
            pointerEvents="none"
          />
        </Box>

        <Box textAlign="center">
          <Text
            fontFamily="'Syne', sans-serif"
            fontSize="1.25rem"
            fontWeight="700"
            color="rgba(240,242,255,0.6)"
            letterSpacing="-0.01em"
          >
            Select a conversation
          </Text>
          <Text fontSize="0.85rem" color="rgba(240,242,255,0.28)" mt="6px" maxW="240px" lineHeight="1.6">
            Pick someone from the sidebar or search for a user to start chatting
          </Text>
        </Box>

        <style>{`
          @keyframes emptyFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </Box>
    );
  }

  return (
    <Box
      className="chatbox-panel"
      display="flex"
      flexDir="column"
      h="calc(100vh - 64px)"
      w="100%"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
