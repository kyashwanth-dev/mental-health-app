import { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  Box,
  Flex,
  Input,
  Button,
  VStack,
  Text,
  Heading,
  Spacer
} from "@chakra-ui/react";

const socket = io("http://localhost:3000");

const colors = ["blue", "green", "red", "purple", "orange", "teal", "pink", "yellow"];

function getRandomItem(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [user, setUser] = useState({ name: "", color: "" });
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (isJoined) {
      const newUser = {
        name: username,
        color: getRandomItem(colors)
      };
      setUser(newUser);

      socket.on("chat message", (data) => {
        setChat((prev) => [...prev, data]);
      });

      socket.on("connect_error", () => {
        // Connection error handling removed
      });
    }
  }, [isJoined, username]);

  const joinChat = () => {
    if (username.trim()) {
      setIsJoined(true);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", { message, user });
      setMessage("");
    }
  };

  return (
    <Flex direction="column" align="center" p={4} minH="100vh" bg="gray.100">
      {!isJoined ? (
        <VStack gap={4} w="100%" maxW="400px">
          <Heading size="lg">Join the Chat</Heading>
          <Input
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="subtle"
            bg="white"
            color="black"
          />
          <Button onClick={joinChat} colorScheme="blue" w="100%">Join</Button>
        </VStack>
      ) : (
        <>
          <Flex w="100%" maxW="600px" align="center" mb={4}>
            <Heading size="lg" color="blue.600">💬 Chakra Chat</Heading>
            <Spacer />
          </Flex>

          <Box w="100%" maxW="600px" bg="white" borderRadius="md" p={4} boxShadow="lg">
            <VStack gap={3} align="stretch" maxH="400px" overflowY="auto">
              {chat.map((msg, i) => (
                <Flex key={i} justify={msg.user.name === user.name ? "flex-end" : "flex-start"} align="center" gap={3}>
                  {msg.user.name !== user.name && (
                    <Box
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      bg={`${msg.user.color}.500`}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      {msg.user.name[0].toUpperCase()}
                    </Box>
                  )}
                  <Box bg={`${msg.user.color}.50`} p={3} borderRadius="md" maxW="70%">
                    <Text color="black"><strong>{msg.user.name === user.name ? "(me)" : `${msg.user.name}`}</strong> {msg.message}</Text>
                  </Box>
                  {msg.user.name === user.name && (
                    <Box
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      bg={`${user.color}.500`}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontWeight="bold"
                      fontSize="sm"
                    >
                      {user.name[0].toUpperCase()}
                    </Box>
                  )}
                </Flex>
              ))}
            </VStack>

            <form onSubmit={sendMessage}>
              <Flex mt={4}>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message"
                  variant="subtle"
                  bg="gray.200"
                  color="black"
                  mr={2}
                />
                <Button type="submit" colorScheme="blue">Send</Button>
              </Flex>
            </form>
          </Box>
        </>
      )}
    </Flex>
  );
}

export default App;
