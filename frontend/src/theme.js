import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Menu: {
      parts: ["button", "list", "item"],
      baseStyle: {
        list: {
          bg: "rgba(19,21,31,0.92)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          color: "#f0f2ff",
          zIndex: 1400,
        },
        item: {
          bg: "transparent",
          color: "#f0f2ff",
          _hover: {
            bg: "rgba(0,212,216,0.1)",
            color: "#f0f2ff",
          },
        },
      },
    },
  },
});

export default theme;
