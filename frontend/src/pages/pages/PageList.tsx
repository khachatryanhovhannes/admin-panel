import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPages, createPage, deletePage, Page } from "../../api/pages";
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

const PageList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // useQuery with object signature (v5+ requirement)
  const { data: pages, isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: fetchPages,
  });

  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isStatic, setIsStatic] = useState(false);

  // CREATE mutation
  const createMutation = useMutation({
    mutationFn: createPage,
    onSuccess: () => {
      queryClient.invalidateQueries(["pages"]);
      setSlug("");
      setIsActive(true);
      setIsStatic(false);
    },
  });

  // DELETE mutation
  const deleteMutation = useMutation({
    mutationFn: deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries(["pages"]);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      slug,
      isActive,
      isStatic,
      translations: { create: [] }, // կամ կարող եք later Edit-ում ավելացնել
    });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure to delete this page?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading Pages...</div>;

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Pages
      </Heading>

      {/* Create Form */}
      <form onSubmit={handleCreate}>
        <HStack mb={4} align="flex-end">
          <Box>
            <FormLabel>Slug</FormLabel>
            <Input
              placeholder="Page Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </Box>
          <Box>
            <FormLabel>Is Active?</FormLabel>
            <Switch
              isChecked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </Box>
          <Box>
            <FormLabel>Is Static?</FormLabel>
            <Switch
              isChecked={isStatic}
              onChange={(e) => setIsStatic(e.target.checked)}
            />
          </Box>
          <Button type="submit" colorScheme="blue">
            Create
          </Button>
        </HStack>
      </form>

      {/* Table */}
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Slug</Th>
            <Th>Active?</Th>
            <Th>Static?</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pages?.map((p) => (
            <Tr key={p.id}>
              <Td>{p.id}</Td>
              <Td>{p.slug}</Td>
              <Td>{p.isActive ? "Yes" : "No"}</Td>
              <Td>{p.isStatic ? "Yes" : "No"}</Td>
              <Td>
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    onClick={() => navigate(`/admin/pages/${p.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => handleDelete(p.id)}
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

export default PageList;
