import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchContentBlocks,
  createContentBlock,
  deleteContentBlock,
  ContentBlock,
} from "../../api/contentBlocks";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  HStack,
  Heading,
  Switch,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ContentBlockList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // useQuery v5 object form
  const { data: blocks, isLoading } = useQuery({
    queryKey: ["content-blocks"],
    queryFn: fetchContentBlocks,
  });

  const [blockKey, setBlockKey] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);

  // CREATE mutation
  const createMutation = useMutation({
    mutationFn: createContentBlock,
    onSuccess: () => {
      queryClient.invalidateQueries(["content-blocks"]);
      setBlockKey("");
      setIsGlobal(false);
    },
  });

  // DELETE mutation
  const deleteMutation = useMutation({
    mutationFn: deleteContentBlock,
    onSuccess: () => {
      queryClient.invalidateQueries(["content-blocks"]);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      key: blockKey,
      isGlobal,
      translations: { create: [] },
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this content block?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading Content Blocks...</div>;

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Content Blocks
      </Heading>

      <form onSubmit={handleCreate}>
        <HStack mb={4} align="flex-end">
          <Box>
            <FormLabel>Key</FormLabel>
            <Input
              placeholder="Block Key"
              value={blockKey}
              onChange={(e) => setBlockKey(e.target.value)}
              required
            />
          </Box>
          <Box>
            <FormLabel>Is Global?</FormLabel>
            <Switch
              isChecked={isGlobal}
              onChange={(e) => setIsGlobal(e.target.checked)}
            />
          </Box>
          <Button type="submit" colorScheme="blue">
            Create
          </Button>
        </HStack>
      </form>

      <Table size="sm">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Key</Th>
            <Th>Global?</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {blocks?.map((b) => (
            <Tr key={b.id}>
              <Td>{b.id}</Td>
              <Td>{b.key}</Td>
              <Td>{b.isGlobal ? "Yes" : "No"}</Td>
              <Td>
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    onClick={() => navigate(`/admin/content-blocks/${b.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => handleDelete(b.id)}
                  >
                    Delete
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ContentBlockList;
