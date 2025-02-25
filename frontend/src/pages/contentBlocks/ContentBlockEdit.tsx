import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchContentBlock,
  updateContentBlock,
  ContentBlock,
} from "../../api/contentBlocks";
import { fetchLanguages } from "../../api/languages";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Switch,
  Textarea,
  Select,
  Heading,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const ContentBlockEdit = () => {
  const { id } = useParams();
  const blockId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: blockData, isLoading } = useQuery({
    queryKey: ["content-block", blockId],
    queryFn: () => fetchContentBlock(blockId),
    enabled: !!blockId,
  });

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
  });

  const [blockKey, setBlockKey] = useState("");
  const [isGlobal, setIsGlobal] = useState(false);
  const [translations, setTranslations] = useState<any[]>([]);

  useEffect(() => {
    if (blockData) {
      setBlockKey(blockData.key);
      setIsGlobal(blockData.isGlobal);

      const initTrans =
        blockData.translations?.map((t: any) => ({
          id: t.id,
          languageId: t.languageId,
          content: t.content,
        })) || [];
      setTranslations(initTrans);
    }
  }, [blockData]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateContentBlock(blockId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["content-blocks"]);
      navigate("/admin/content-blocks");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const upsertData = translations.map((tr) => ({
      where: { id: tr.id ?? 0 },
      update: {
        content: tr.content,
        language: { connect: { id: tr.languageId } },
      },
      create: {
        content: tr.content,
        language: { connect: { id: tr.languageId } },
      },
    }));

    const payload = {
      key: blockKey,
      isGlobal,
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
        content: "",
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

  if (isLoading) return <div>Loading ContentBlock...</div>;
  if (!blockData) return <div>Content Block not found</div>;

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Edit Content Block #{blockData.id}
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={2}>
          <FormLabel>Key</FormLabel>
          <Input
            value={blockKey}
            onChange={(e) => setBlockKey(e.target.value)}
          />
        </FormControl>
        <FormControl mb={2} display="flex" alignItems="center">
          <FormLabel mb="0">Is Global?</FormLabel>
          <Switch
            isChecked={isGlobal}
            onChange={(e) => setIsGlobal(e.target.checked)}
          />
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
                <FormLabel>Content</FormLabel>
                <Textarea
                  value={t.content}
                  onChange={(e) =>
                    handleChangeTranslation(index, "content", e.target.value)
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

export default ContentBlockEdit;
