import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Text,
  Flex,
  Avatar,
  Input,
  Textarea,
  Box,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { createdAt } from "../../config/ChatLogics";
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
    reader.onloadend = () => {
      setPicData(reader.result);
      setPicPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Name is required",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = { name, bio };
      if (picData) payload.pic = picData;

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.patch("/api/user/profile", payload, config);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      toast({
        title: "Profile updated",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setPicData("");
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "Unable to update profile.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "bottom",
      });
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
        bg="red"
        color="white"
        pos="absolute"
        top={4}
        right={4}
        className="close-button"
      />
    )}
    <Modal size="2xl" onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent
        h="auto"
        w="auto"
        bg="#28293D"
        color="#F2F2F5"
        pt={4}
        pb={4}
      >
        <ModalCloseButton color="#F2F2F5" pos="absolute" top={4} right={4} />
        <ModalBody
          display="flex"
          alignItems="stretch"
          justifyContent="center"
          gap={6}
          flexDirection={{ base: "column", md: "row" }}
        >
          <Flex direction="column" align="center" gap={4} width={{ base: "100%", md: "35%" }}>
            <Avatar
              size="xl"
              borderRadius="lg"
              width="200px"
              height="200px"
              src={picPreview}
              alt={user?.name}
            />
            {canEdit && (
              <>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handlePicChange}
                />
                <Button
                  as="label"
                  htmlFor="profile-upload"
                  bgGradient="linear(to-r, #3E7BFA, #6366F1)"
                  color="#FFFFFF"
                  _hover={{ opacity: 0.9 }}
                >
                  Change Photo
                </Button>
              </>
            )}
            <Box textAlign="center">
              <Text>ID: {user?._id?.toString().substring(0, 9)}</Text>
              <Text>Created At: {createdAt(user)}</Text>
              <Text>Email: {user?.email}</Text>
            </Box>
          </Flex>
          <Flex direction="column" gap={3} width={{ base: "100%", md: "65%" }}>
            {canEdit ? (
              <>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  bg="#1F1F33"
                  borderColor="transparent"
                  color="#EBEBF0"
                />
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short bio"
                  bg="#1F1F33"
                  borderColor="transparent"
                  color="#EBEBF0"
                  minH="120px"
                />
                <Button
                  onClick={handleSave}
                  isLoading={isSaving}
                  bgGradient="linear(to-r, #34D399, #10B981)"
                  color="#020617"
                  fontWeight="bold"
                >
                  Save changes
                </Button>
              </>
            ) : (
              <>
                <Text fontSize="xl" fontWeight="bold">
                  {user?.name}
                </Text>
                <Text color="gray.400">{user?.bio || "No bio added yet"}</Text>
              </>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
);
};

export default ProfileModal;
