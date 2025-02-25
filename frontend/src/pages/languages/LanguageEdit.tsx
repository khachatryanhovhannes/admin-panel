import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLanguage, updateLanguage, Language } from "../../api/languages";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Switch,
  Heading,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const LanguageEdit = () => {
  const { id } = useParams();
  const languageId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["language", languageId],
    queryFn: () => fetchLanguage(languageId),
    enabled: !!languageId,
  });

  const [formData, setFormData] = useState<Partial<Language>>({});

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<Language>) =>
      updateLanguage(languageId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["languages"]);
      navigate("/admin/languages");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) return <div>Loading Language...</div>;
  if (!data) return <div>Language not found</div>;

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Edit Language #{data.id}
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={3}>
          <FormLabel>English Name</FormLabel>
          <Input
            value={formData.name_en ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, name_en: e.target.value })
            }
          />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Native Name</FormLabel>
          <Input
            value={formData.name_native ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, name_native: e.target.value })
            }
          />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Short Code</FormLabel>
          <Input
            value={formData.short_code ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, short_code: e.target.value })
            }
          />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Logo URL</FormLabel>
          <Input
            value={formData.logo_url ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, logo_url: e.target.value })
            }
          />
        </FormControl>
        <FormControl display="flex" alignItems="center" mb={3}>
          <FormLabel mb="0">Is Active?</FormLabel>
          <Switch
            isChecked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
          />
        </FormControl>

        <Button type="submit" colorScheme="blue">
          Save
        </Button>
      </form>
    </Box>
  );
};

export default LanguageEdit;
