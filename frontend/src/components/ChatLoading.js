import { Stack } from "@chakra-ui/react";
import { Skeleton } from "@chakra-ui/skeleton";

const ChatLoading = () => {
  return (
    <Stack p="12px" gap="6px">
      {[...Array(8)].map((_, index) => (
        <Skeleton
          key={index}
          height="56px"
          borderRadius="12px"
          startColor="rgba(255,255,255,0.04)"
          endColor="rgba(0,212,216,0.06)"
        />
      ))}
    </Stack>
  );
};

export default ChatLoading;
