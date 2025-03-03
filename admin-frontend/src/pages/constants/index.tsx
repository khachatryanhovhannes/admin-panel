import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

import {
  fetchAllConstants,
  createConstant,
  updateConstant,
  deleteConstant,
} from "../../api/constant";

// ------ Types ------
interface IConstant {
  id: number;
  key: string;
  value: string;
}

export default function ConstantsManagement() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [constants, setConstants] = useState<IConstant[]>([]);

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [editConstant, setEditConstant] = useState<IConstant | null>(null);
  const [editKey, setEditKey] = useState("");
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllConstants();
      setConstants(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load constants",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddConstant = async () => {
    if (!newKey.trim() || !newValue.trim()) {
      toast({
        title: "Validation",
        description: "Key and Value cannot be empty",
        status: "warning",
      });
      return;
    }
    try {
      const created = await createConstant({ key: newKey, value: newValue });
      setConstants((prev) => [...prev, created]);
      toast({
        title: "Success",
        description: "Constant created",
        status: "success",
      });
      setNewKey("");
      setNewValue("");
      onAddClose();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create constant",
        status: "error",
      });
    }
  };

  const handleDeleteConstant = async (id: number) => {
    try {
      await deleteConstant(id);
      setConstants((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: "Deleted",
        description: "Constant deleted",
        status: "info",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete constant",
        status: "error",
      });
    }
  };

  const openEditModal = (constant: IConstant) => {
    setEditConstant(constant);
    setEditKey(constant.key);
    setEditValue(constant.value);
    onEditOpen();
  };

  const handleSaveEdit = async () => {
    if (!editConstant) return;
    if (!editKey.trim() || !editValue.trim()) {
      toast({
        title: "Validation",
        description: "Key and Value cannot be empty",
        status: "warning",
      });
      return;
    }

    try {
      const updated = await updateConstant(editConstant.id, {
        key: editKey,
        value: editValue,
      });
      setConstants((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      toast({
        title: "Updated",
        description: "Constant updated successfully",
        status: "success",
      });
      onEditClose();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update constant",
        status: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <Box p={5}>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Flex justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Constants Management
        </Text>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onAddOpen}>
          Add Constant
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Key</Th>
            <Th>Value</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {constants.map((cst) => (
            <Tr key={cst.id}>
              <Td>{cst.id}</Td>
              <Td>{cst.key}</Td>
              <Td>{cst.value}</Td>
              <Td>
                <IconButton
                  icon={<EditIcon />}
                  aria-label="Edit Constant"
                  mr={2}
                  size="sm"
                  colorScheme="blue"
                  onClick={() => openEditModal(cst)}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Delete Constant"
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteConstant(cst.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Constant</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Key"
              mb={3}
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <Input
              placeholder="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddConstant}>
              Add
            </Button>
            <Button onClick={onAddClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Constant</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Key"
              mb={3}
              value={editKey}
              onChange={(e) => setEditKey(e.target.value)}
            />
            <Input
              placeholder="Value"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveEdit}>
              Save
            </Button>
            <Button onClick={onEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
