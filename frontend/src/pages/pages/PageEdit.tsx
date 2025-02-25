import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPage, updatePage, Page } from "../../api/pages";
import { fetchLanguages, Language } from "../../api/languages";
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

const PageEdit = () => {
  const { id } = useParams();
  const pageId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: pageData, isLoading } = useQuery({
    queryKey: ["page", pageId],
    queryFn: () => fetchPage(pageId),
    enabled: !!pageId,
  });

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
  });

  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isStatic, setIsStatic] = useState(false);
  const [translations, setTranslations] = useState<any[]>([]);

  useEffect(() => {
    if (pageData) {
      setSlug(pageData.slug);
      setIsActive(pageData.isActive);
      setIsStatic(pageData.isStatic);

      const initialTrans =
        pageData.translations?.map((t: any) => ({
          id: t.id,
          languageId: t.languageId,
          title: t.title,
          content: t.content,
          seoTitle: t.seoTitle,
          seoDesc: t.seoDesc,
        })) || [];
      setTranslations(initialTrans);
    }
  }, [pageData]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updatePage(pageId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["pages"]);
      navigate("/admin/pages");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Upsert translations
    const upsertData = translations.map((tr) => ({
      where: { id: tr.id ?? 0 },
      update: {
        title: tr.title,
        content: tr.content,
        seoTitle: tr.seoTitle,
        seoDesc: tr.seoDesc,
        language: { connect: { id: tr.languageId } },
      },
      create: {
        title: tr.title,
        content: tr.content,
        seoTitle: tr.seoTitle,
        seoDesc: tr.seoDesc,
        language: { connect: { id: tr.languageId } },
      },
    }));

    const payload = {
      slug,
      isActive,
      isStatic,
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
        title: "",
        content: "",
        seoTitle: "",
        seoDesc: "",
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

  if (isLoading) return <div>Loading Page...</div>;
  if (!pageData) return <div>Page not found</div>;

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Edit Page #{pageData.id}
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={2}>
          <FormLabel>Slug</FormLabel>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
        </FormControl>
        <FormControl mb={2} display="flex" alignItems="center">
          <FormLabel mb="0">Is Active?</FormLabel>
          <Switch
            isChecked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </FormControl>
        <FormControl mb={4} display="flex" alignItems="center">
          <FormLabel mb="0">Is Static?</FormLabel>
          <Switch
            isChecked={isStatic}
            onChange={(e) => setIsStatic(e.target.checked)}
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
                <FormLabel>Title</FormLabel>
                <Input
                  value={t.title}
                  onChange={(e) =>
                    handleChangeTranslation(index, "title", e.target.value)
                  }
                />
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

              <FormControl mb={2}>
                <FormLabel>SEO Title</FormLabel>
                <Input
                  value={t.seoTitle ?? ""}
                  onChange={(e) =>
                    handleChangeTranslation(index, "seoTitle", e.target.value)
                  }
                />
              </FormControl>

              <FormControl mb={2}>
                <FormLabel>SEO Desc</FormLabel>
                <Input
                  value={t.seoDesc ?? ""}
                  onChange={(e) =>
                    handleChangeTranslation(index, "seoDesc", e.target.value)
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

export default PageEdit;
