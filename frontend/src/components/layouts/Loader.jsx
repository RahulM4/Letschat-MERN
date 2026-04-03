// @ts-nocheck
import React from 'react';
import { Box } from '@chakra-ui/react';

const Loader = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      gap="20px"
      style={{
        background: "radial-gradient(ellipse 70% 55% at 75% -10%, rgba(0,212,216,0.2) 0%, transparent 60%), #0c0e14",
        fontFamily: "'DM Sans', sans-serif"
      }}
    >
      {/* Animated logo mark */}
      <Box position="relative" width="64px" height="64px">
        <Box
          position="absolute"
          inset="0"
          borderRadius="18px"
          style={{
            background: "linear-gradient(135deg, #00d4d8, #a8ff78)",
            animation: "loaderPulse 1.4s ease-in-out infinite",
          }}
        />
        <Box
          position="absolute"
          inset="3px"
          borderRadius="15px"
          style={{ background: "#0c0e14" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#00d4d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Box>
      </Box>

      {/* Dots */}
      <Box display="flex" gap="6px" alignItems="center">
        {[0, 1, 2].map(i => (
          <Box
            key={i}
            width="6px" height="6px"
            borderRadius="50%"
            style={{
              background: "#00d4d8",
              animation: `dotBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </Box>

      <style>{`
        @keyframes loaderPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.95); }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default Loader;
