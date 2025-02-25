import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchGlobalContent,
  updateGlobalContent,
} from "../../api/globalContents";
import { fetchLanguages } from "../../api/languages";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  Heading,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const GlobalContentEdit = () => {
  const { id } = useParams();
  const gcId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: gcData, isLoading } = useQuery({
    queryKey: ["global-content", gcId],
    queryFn: () => fetchGlobalContent(gcId),
    enabled: !!gcId,
  });

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
  });

  const [gcKey, setGcKey] = useState("");
  const [translations, setTranslations] = useState<any[]>([]);

  useEffect(() => {
    if (gcData) {
      setGcKey(gcData.key);

      const initTrans =
        gcData.translations?.map((t: any) => ({
          id: t.id,
          languageId: t.languageId,
          value: t.value,
        })) || [];
      setTranslations(initTrans);
    }
  }, [gcData]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateGlobalContent(gcId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["global-contents"]);
      navigate("/admin/global-contents");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const upsertData = translations.map((tr) => ({
      where: { id: tr.id ?? 0 },
      update: {
        value: tr.value,
        language: { connect: { id: tr.languageId } },
      },
      create: {
        value: tr.value,
        language: { connect: { id: tr.languageId } },
      },
    }));
    const payload = {
      key: gcKey,
      translations: {
        upsert: upsertData,
      },
    };
    updateMutation.mutate(payload);
  };

  const handleAddTranslation = () => {
    setTranslations((prev) => [
      ...prev,
      {
        id: undefined,
        languageId: languages?.[0]?.id || 1,
        value: "",
      },
    ]);
  };

  const handleRemoveTranslation = (index: number) => {
    if (window.confirm("Remove this translation?")) {
      setTranslations((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleChangeTranslation = (
    index: number,
    field: string,
    value: any
  ) => {
    setTranslations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  if (isLoading) return <div>Loading GlobalContent...</div>;
  if (!gcData) return <div>Global Content not found</div>;

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Edit Global Content #{gcData.id}
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={2}>
          <FormLabel>Key</FormLabel>
          <Input value={gcKey} onChange={(e) => setGcKey(e.target.value)} />
        </FormControl>

        <Button mb={4} onClick={handleAddTranslation}>
          Add Translation
        </Button>
        <VStack spacing={4} align="stretch">
          {translations.map((t, index) => (
            <Box key={index} p={3} border="1px solid #ccc" borderRadius="md">
              <HStack justifyContent="space-between" mb={2}>
                <FormLabel>Translation #{index + 1}</FormLabel>
                <Button
                  size="xs"
                  colorScheme="red"
                  onClick={() => handleRemoveTranslation(index)}
                >
                  Remove
                </Button>
              </HStack>
              <FormControl mb={2}>
                <FormLabel>Language</FormLabel>
                <Select
                  value={t.languageId}
                  onChange={(e) =>
                    handleChangeTranslation(
                      index,
                      "languageId",
                      Number(e.target.value)
                    )
                  }
                >
                  {languages?.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name_en} ({lang.short_code})
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={2}>
                <FormLabel>Value</FormLabel>
                <Textarea
                  value={t.value}
                  onChange={(e) =>
                    handleChangeTranslation(index, "value", e.target.value)
                  }
                />
              </FormControl>
            </Box>
          ))}
        </VStack>
        <Button mt={4} type="submit" colorScheme="blue">
          Save
        </Button>
      </form>
    </Box>
  );
};

export default GlobalContentEdit;
