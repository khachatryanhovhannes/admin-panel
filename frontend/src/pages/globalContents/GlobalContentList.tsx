import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchGlobalContents,
  createGlobalContent,
  deleteGlobalContent,
} from "../../api/globalContents";
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
  FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GlobalContentList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // useQuery v5 object form
  const { data: globalContents, isLoading } = useQuery({
    queryKey: ["global-contents"],
    queryFn: fetchGlobalContents,
  });

  const [gcKey, setGcKey] = useState("");

  // CREATE mutation
  const createMutation = useMutation({
    mutationFn: createGlobalContent,
    onSuccess: () => {
      queryClient.invalidateQueries(["global-contents"]);
      setGcKey("");
    },
  });

  // DELETE mutation
  const deleteMutation = useMutation({
    mutationFn: deleteGlobalContent,
    onSuccess: () => {
      queryClient.invalidateQueries(["global-contents"]);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      key: gcKey,
      translations: { create: [] },
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this global content?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading Global Contents...</div>;

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Global Contents
      </Heading>
      <form onSubmit={handleCreate}>
        <HStack mb={4}>
          <Box>
            <FormLabel>Key</FormLabel>
            <Input
              placeholder="Global Key"
              value={gcKey}
              onChange={(e) => setGcKey(e.target.value)}
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
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {globalContents?.map((gc) => (
            <Tr key={gc.id}>
              <Td>{gc.id}</Td>
              <Td>{gc.key}</Td>
              <Td>
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    onClick={() => navigate(`/admin/global-contents/${gc.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => handleDelete(gc.id)}
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

export default GlobalContentList;
