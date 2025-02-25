import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMenus, createMenu, deleteMenu, Menu } from "../../api/menus";
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

const MenuList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✔ React Query v5-ում միայն այս ձևով:
  const { data: menus, isLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: fetchMenus,
  });

  const [name, setName] = useState("");

  // CREATE mutation
  const createMutation = useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries(["menus"]);
      setName("");
    },
  });

  // DELETE mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries(["menus"]);
    },
  });

  // CREATE form submit
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name });
  };

  // DELETE
  const handleDelete = (id: number) => {
    if (window.confirm("Delete menu?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading Menus...</div>;

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Menus
      </Heading>

      <form onSubmit={handleCreate}>
        <HStack mb={4}>
          <Box>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Menu Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <Th>Name</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {menus?.map((m) => (
            <Tr key={m.id}>
              <Td>{m.id}</Td>
              <Td>{m.name}</Td>
              <Td>
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    onClick={() => navigate(`/admin/menus/${m.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => handleDelete(m.id)}
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

export default MenuList;
