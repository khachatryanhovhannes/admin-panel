import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMenuItem, updateMenuItem } from "../../api/menuItems";
import { fetchMenus } from "../../api/menus";
import { fetchLanguages } from "../../api/languages";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Switch,
  Select,
  Heading,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

const MenuItemEdit = () => {
  const { id } = useParams();
  const itemId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: itemData, isLoading } = useQuery({
    queryKey: ["menu-item", itemId],
    queryFn: () => fetchMenuItem(itemId),
    enabled: !!itemId,
  });

  const { data: menus } = useQuery(["menus"], fetchMenus);
  const { data: languages } = useQuery(["languages"], fetchLanguages);

  const [url, setUrl] = useState("");
  const [parentId, setParentId] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<number>(0);
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Translations
  const [translations, setTranslations] = useState<any[]>([]);

  useEffect(() => {
    if (itemData) {
      setUrl(itemData.url);
      setParentId(itemData.parentId || null);
      setMenuId(itemData["menuId"]);
      setOrder(itemData.order);
      setIsActive(itemData.isActive);

      const initTrans =
        itemData.translations?.map((t: any) => ({
          id: t.id,
          languageId: t.languageId,
          title: t.title,
        })) || [];
      setTranslations(initTrans);
    }
  }, [itemData]);

  const updateMutation = useMutation({
    mutationFn: (payload: any) => updateMenuItem(itemId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["menu-items"]);
      navigate("/admin/menu-items");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const upsertData = translations.map((tr) => ({
      where: { id: tr.id ?? 0 },
      update: {
        title: tr.title,
        language: { connect: { id: tr.languageId } },
      },
      create: {
        title: tr.title,
        language: { connect: { id: tr.languageId } },
      },
    }));

    const payload: any = {
      url,
      order: Number(order),
      isActive,
      menu: { connect: { id: Number(menuId) } },
      translations: { upsert: upsertData },
    };
    if (parentId) {
      payload["parent"] = { connect: { id: Number(parentId) } };
    } else {
      // Եթե parentId կա/չկա, gna - կամ դնում եք disconnect
      // payload["parent"] = { disconnect: true };
    }

    updateMutation.mutate(payload);
  };

  const handleAddTranslation = () => {
    setTranslations((prev) => [
      ...prev,
      {
        id: undefined,
        languageId: languages?.[0]?.id || 1,
        title: "",
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

  if (isLoading) return <div>Loading MenuItem...</div>;
  if (!itemData) return <div>Menu Item not found</div>;

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Edit Menu Item #{itemData.id}
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl mb={3}>
          <FormLabel>URL</FormLabel>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Menu</FormLabel>
          <Select
            value={menuId}
            onChange={(e) => setMenuId(Number(e.target.value))}
          >
            <option value={0}>-- select menu --</option>
            {menus?.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Parent ID</FormLabel>
          <Input
            placeholder="null for no parent"
            value={parentId ?? ""}
            onChange={(e) =>
              setParentId(e.target.value ? Number(e.target.value) : null)
            }
          />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>Order</FormLabel>
          <Input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </FormControl>
        <FormControl mb={3} display="flex" alignItems="center">
          <FormLabel mb="0">Is Active?</FormLabel>
          <Switch
            isChecked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </FormControl>

        {/* Translations */}
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

export default MenuItemEdit;
