// @ts-nocheck
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
  useDisclosure, IconButton, Text, Flex, Avatar, Input,
  Textarea, Box, Button, useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";

const ProfileModal = ({ user, children }) => {
  const { user: loggedInUser, setUser } = ChatState();
  const canEdit = loggedInUser?._id === user?._id;
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [picPreview, setPicPreview] = useState(user?.pic);
  const [picData, setPicData] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const displayBio = user?.bio?.trim() || "No bio added yet.";

  useEffect(() => {
    setName(user?.name || "");
    setBio(user?.bio || "");
    setPicPreview(user?.pic);
    setPicData("");
  }, [user]);

  const handlePicChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { setPicData(reader.result); setPicPreview(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: "Name is required", status: "warning", duration: 3000, isClosable: true, position: "bottom" });
      return;
    }
    setIsSaving(true);
    try {
      const payload = { name, bio };
      if (picData) payload.pic = picData;
      const { data } = await axios.patch("/api/user/profile", payload, { headers: { "Content-type": "application/json" } });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setName(data.name || name);
      setBio(data.bio || bio);
      if (data.pic) setPicPreview(data.pic);
      toast({ title: "Profile updated!", status: "success", duration: 3000, isClosable: true, position: "bottom" });
      onClose();
      setPicData("");
    } catch (error) {
      toast({ title: "Update failed", description: error.response?.data?.message || "Unable to update profile.", status: "error", duration: 4000, isClosable: true, position: "bottom" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          icon={<ViewIcon />}
          onClick={onOpen}
          size="sm"
          bg="rgba(0,212,216,0.15)"
          border="1px solid rgba(0,212,216,0.3)"
          color="#00d4d8"
          borderRadius="10px"
          _hover={{ bg: "rgba(0,212,216,0.25)" }}
        />
      )}

      <Modal size="2xl" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay bg="rgba(5,7,15,0.8)" backdropFilter="blur(12px)" />
        <ModalContent
          bg="#13151f"
          border="1px solid rgba(255,255,255,0.07)"
          borderRadius="24px"
          overflow="hidden"
          boxShadow="0 48px 96px rgba(0,0,0,0.65)"
          mx="16px"
        >
          <Box h="1px" bgGradient="linear(90deg, transparent, #00d4d8, #a8ff78, transparent)" />
          <ModalCloseButton
            color="rgba(240,242,255,0.4)"
            top="18px" right="18px"
            _hover={{ color: "#f0f2ff", bg: "rgba(255,255,255,0.06)" }}
            borderRadius="8px"
          />

          <ModalBody p={{ base: "20px", md: "28px" }}>
            <Flex direction={{ base: "column", md: "row" }} gap="20px" align="stretch" minH="300px">
              {/* Left: Avatar card */}
              <Box
                bg="rgba(255,255,255,0.03)"
                border="1px solid rgba(255,255,255,0.06)"
                borderRadius="18px"
                p="24px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap="16px"
                minW={{ md: "200px" }}
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="-30px" left="-30px"
                  w="120px" h="120px"
                  borderRadius="50%"
                  bg="rgba(0,212,216,0.08)"
                  filter="blur(30px)"
                  pointerEvents="none"
                />
                <Box position="relative">
                  <Avatar
                    size="xl"
                    width="96px"
                    height="96px"
                    src={picPreview}
                    name={user?.name}
                    border="3px solid rgba(0,212,216,0.4)"
                    boxShadow="0 0 24px rgba(0,212,216,0.2)"
                  />
                  {canEdit && (
                    <>
                      <input id="profile-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={handlePicChange} />
                      <Box
                        as="label"
                        htmlFor="profile-upload"
                        position="absolute"
                        bottom="-2px" right="-2px"
                        w="28px" h="28px"
                        bg="linear-gradient(135deg, #00d4d8, #00b8bc)"
                        borderRadius="50%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        cursor="pointer"
                        boxShadow="0 4px 12px rgba(0,212,216,0.4)"
                        title="Change photo"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#071014" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Box>
                    </>
                  )}
                </Box>
                <Box textAlign="center">
                  <Text fontFamily="'Syne', sans-serif" fontWeight="700" fontSize="0.95rem" color="#f0f2ff">{user?.name}</Text>
                  <Text fontSize="0.75rem" color="rgba(240,242,255,0.45)" mt="2px">@{user?.email?.split("@")[0]}</Text>
                </Box>
              </Box>

              {/* Right: Edit / view card */}
              <Box flex="1" display="flex" flexDirection="column" gap="16px">
                <Text fontFamily="'Syne', sans-serif" fontWeight="800" fontSize="1.1rem" color="#f0f2ff" letterSpacing="-0.01em">
                  {canEdit ? "Edit Profile" : "About"}
                </Text>

                {canEdit ? (
                  <>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      bg="rgba(255,255,255,0.04)"
                      border="1px solid rgba(255,255,255,0.08)"
                      borderRadius="12px"
                      color="#f0f2ff"
                      fontSize="0.9rem"
                      height="44px"
                      _placeholder={{ color: "rgba(240,242,255,0.35)" }}
                      _focus={{ borderColor: "rgba(0,212,216,0.5)", boxShadow: "0 0 0 3px rgba(0,212,216,0.1)" }}
                    />
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write a short bio..."
                      bg="rgba(255,255,255,0.04)"
                      border="1px solid rgba(255,255,255,0.08)"
                      borderRadius="12px"
                      color="#f0f2ff"
                      fontSize="0.875rem"
                      minH="120px"
                      resize="none"
                      _placeholder={{ color: "rgba(240,242,255,0.35)" }}
                      _focus={{ borderColor: "rgba(0,212,216,0.5)", boxShadow: "0 0 0 3px rgba(0,212,216,0.1)" }}
                    />
                    <Button
                      onClick={handleSave}
                      isLoading={isSaving}
                      bg="linear-gradient(135deg, #00d4d8, #00b8bc)"
                      color="#071014"
                      fontWeight="700"
                      fontSize="0.875rem"
                      borderRadius="12px"
                      height="44px"
                      boxShadow="0 6px 20px rgba(0,212,216,0.35)"
                      _hover={{ transform: "translateY(-1px)", boxShadow: "0 10px 28px rgba(0,212,216,0.45)" }}
                      _active={{ transform: "none" }}
                      loadingText="Saving..."
                    >
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <Box
                    bg="rgba(255,255,255,0.03)"
                    border="1px solid rgba(255,255,255,0.06)"
                    borderRadius="12px"
                    p="16px"
                    flex="1"
                  >
                    <Text fontSize="0.875rem" color="rgba(240,242,255,0.65)" lineHeight="1.7">
                      {displayBio}
                    </Text>
                  </Box>
                )}
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
