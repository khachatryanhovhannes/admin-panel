import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchLanguages,
  createLanguage,
  deleteLanguage,
  Language,
} from "../../api/languages";
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
  FormControl,
  FormLabel,
  Switch,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LanguageList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // useQuery with object signature (v5+)
  const { data: languages, isLoading } = useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
  });

  // Form state for creating a new language
  const [formData, setFormData] = useState<Partial<Language>>({
    name_en: "",
    name_native: "",
    short_code: "",
    logo_url: "",
    is_active: true,
  });

  // CREATE mutation
  const createMutation = useMutation({
    mutationFn: createLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries(["languages"]);
      setFormData({
        name_en: "",
        name_native: "",
        short_code: "",
        logo_url: "",
        is_active: true,
      });
    },
  });

  // DELETE mutation
  const deleteMutation = useMutation({
    mutationFn: deleteLanguage,
    onSuccess: () => {
      queryClient.invalidateQueries(["languages"]);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure to delete this language?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading Languages...</div>;

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Languages
      </Heading>

      {/* Create Form */}
      <form onSubmit={handleCreate}>
        <HStack mb={4} align="flex-end">
          <Box>
            <FormLabel>English Name</FormLabel>
            <Input
              value={formData.name_en ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, name_en: e.target.value })
              }
              required
            />
          </Box>
          <Box>
            <FormLabel>Native Name</FormLabel>
            <Input
              value={formData.name_native ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, name_native: e.target.value })
              }
              required
            />
          </Box>
          <Box>
            <FormLabel>Short Code</FormLabel>
            <Input
              value={formData.short_code ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, short_code: e.target.value })
              }
              required
            />
          </Box>
          <Box>
            <FormLabel>Logo URL</FormLabel>
            <Input
              value={formData.logo_url ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, logo_url: e.target.value })
              }
            />
          </Box>
          <Box>
            <FormLabel>Is Active?</FormLabel>
            <Switch
              isChecked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
            />
          </Box>
          <Button type="submit" colorScheme="blue">
            Create
          </Button>
        </HStack>
      </form>

      {/* List Table */}
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>English Name</Th>
            <Th>Native Name</Th>
            <Th>Short Code</Th>
            <Th>Logo</Th>
            <Th>Active?</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {languages?.map((lang) => (
            <Tr key={lang.id}>
              <Td>{lang.id}</Td>
              <Td>{lang.name_en}</Td>
              <Td>{lang.name_native}</Td>
              <Td>{lang.short_code}</Td>
              <Td>{lang.logo_url || "-"}</Td>
              <Td>{lang.is_active ? "Yes" : "No"}</Td>
              <Td>
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    onClick={() => navigate(`/admin/languages/${lang.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => handleDelete(lang.id)}
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

export default LanguageList;
