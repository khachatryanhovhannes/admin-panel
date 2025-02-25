import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMenuItems,
  createMenuItem,
  deleteMenuItem,
  MenuItem,
} from "../../api/menuItems";
import { fetchMenus } from "../../api/menus";
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
  Select,
  HStack,
  Heading,
  Switch,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MenuItemList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // useQuery v5 object form
  const { data: menuItems, isLoading } = useQuery({
    queryKey: ["menu-items"],
    queryFn: fetchMenuItems,
  });
  const { data: menus } = useQuery({
    queryKey: ["menus"],
    queryFn: fetchMenus,
  });

  const [formData, setFormData] = useState<any>({
    url: "",
    menuId: 0,
    parentId: null,
    order: 0,
    isActive: true,
  });

  // CREATE mutation
  const createMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["menu-items"]);
      setFormData({
        url: "",
        menuId: 0,
        parentId: null,
        order: 0,
        isActive: true,
      });
    },
  });

  // DELETE mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries(["menu-items"]);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      url: formData.url,
      order: Number(formData.order),
      isActive: formData.isActive,
      menu: { connect: { id: Number(formData.menuId) } },
    };
    if (formData.parentId) {
      payload["parent"] = { connect: { id: Number(formData.parentId) } };
    }
    // Translations-ն ամենահեշտը հետո Edit-ում
    payload["translations"] = { create: [] };

    createMutation.mutate(payload);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this menu item?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading Menu Items...</div>;

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>
        Menu Items
      </Heading>

      <form onSubmit={handleCreate}>
        <HStack mb={4} align="flex-end">
          <Box>
            <FormLabel>URL</FormLabel>
            <Input
              placeholder="/about"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              required
            />
          </Box>
          <Box>
            <FormLabel>Menu</FormLabel>
            <Select
              value={formData.menuId}
              onChange={(e) =>
                setFormData({ ...formData, menuId: e.target.value })
              }
            >
              <option value={0}>-- select menu --</option>
              {menus?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            <FormLabel>Parent ID (optional)</FormLabel>
            <Input
              placeholder="parentId"
              value={formData.parentId ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, parentId: e.target.value })
              }
            />
          </Box>
          <Box>
            <FormLabel>Order</FormLabel>
            <Input
              type="number"
              value={formData.order}
              onChange={(e) =>
                setFormData({ ...formData, order: e.target.value })
              }
            />
          </Box>
          <Box>
            <FormLabel>Is Active?</FormLabel>
            <Switch
              isChecked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
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
            <Th>URL</Th>
            <Th>Menu</Th>
            <Th>Parent</Th>
            <Th>Order</Th>
            <Th>Active?</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {menuItems?.map((item) => (
            <Tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>{item.url}</Td>
              <Td>{item["menuId"]}</Td>
              <Td>{item["parentId"] || "-"}</Td>
              <Td>{item.order}</Td>
              <Td>{item.isActive ? "Yes" : "No"}</Td>
              <Td>
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    onClick={() => navigate(`/admin/menu-items/${item.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => handleDelete(item.id)}
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

export default MenuItemList;
