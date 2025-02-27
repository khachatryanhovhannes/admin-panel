import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, Text } from "@chakra-ui/react";

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const is_logined = await auth.login(username, password);
      if (is_logined) {
        navigate("/admin");
      } else {
        setError("Invalid username or password");
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <Box maxW="400px" mx="auto" mt="50px">
      <Text fontSize="2xl" mb={4}>
        Login
      </Text>
      {error && <Text color="red.500">{error}</Text>}
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Username"
          mb={3}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Password"
          mb={3}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button colorScheme="teal" type="submit" width="full">
          Login
        </Button>
      </form>
    </Box>
  );
}
