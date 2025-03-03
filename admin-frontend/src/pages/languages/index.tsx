import { useEffect, useState } from "react";
import { ILanguage } from "../../models";
import {
  Box,
  Heading,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  IconButton,
  useToast,
  Input,
  FormControl,
  FormLabel,
  Switch,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  fetchAllLanguages,
  createLanguage,
  deleteLanguage,
  updateLanguage,
} from "../../api/languages";

export default function Languages() {
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState<ILanguage>({
    enName: "",
    nativeName: "",
    shortName: "",
    iconUrl: "",
    isActive: true,
  });
  const [editingLanguage, setEditingLanguage] = useState<ILanguage | null>(
    null
  );

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCloseModal = () => {
    onClose();
    setFormData({
      enName: "",
      nativeName: "",
      shortName: "",
      iconUrl: "",
      isActive: true,
    });
    setEditingLanguage(null);
  };

  const fetchLanguages = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllLanguages();
      setLanguages(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch languages.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newLanguage = await createLanguage(formData);
      setLanguages((prev) => [...prev, newLanguage]);
      toast({
        title: "Language created.",
        description: `${newLanguage.nativeName} has been added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({
        enName: "",
        nativeName: "",
        shortName: "",
        iconUrl: "",
        isActive: true,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to create language.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await deleteLanguage(id);
      setLanguages((prev) => prev.filter((lang) => lang.id !== id));
      toast({
        title: "Deleted",
        description: "Language has been deleted.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete language.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (language: ILanguage) => {
    setEditingLanguage(language);
    setFormData(language);
    onOpen();
  };

  const handleUpdate = async () => {
    if (!editingLanguage) return;
    try {
      const updated = await updateLanguage(editingLanguage.id!, formData);
      setLanguages((prev) =>
        prev.map((lang) => (lang.id === updated.id ? updated : lang))
      );
      toast({
        title: "Updated",
        description: "Language has been updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      handleCloseModal();
      setEditingLanguage(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update language.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6}>
      <Heading textAlign="center" mb={6}>
        Languages
      </Heading>

      <Box
        as="form"
        onSubmit={handleSubmit}
        mb={8}
        p={4}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="md"
      >
        <Heading size="md" mb={4}>
          Add New Language
        </Heading>

        <Flex wrap="wrap" gap={4}>
          <FormControl isRequired width={["100%", "48%"]}>
            <FormLabel>English Name</FormLabel>
            <Input
              name="enName"
              placeholder="English"
              value={formData.enName}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired width={["100%", "48%"]}>
            <FormLabel>Native Name</FormLabel>
            <Input
              name="nativeName"
              placeholder="English"
              value={formData.nativeName}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired width={["100%", "48%"]}>
            <FormLabel>Short Code</FormLabel>
            <Input
              name="shortName"
              placeholder="EN"
              value={formData.shortName}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl isRequired width={["100%", "48%"]}>
            <FormLabel>Flag Image URL</FormLabel>
            <Input
              name="iconUrl"
              placeholder="https://flagcdn.com/w320/gb.png"
              value={formData.iconUrl}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl display="flex" alignItems="center" width="100%">
            <FormLabel htmlFor="isActive" mb="0">
              Is Active?
            </FormLabel>
            <Switch
              id="isActive"
              isChecked={formData.isActive}
              onChange={handleSwitch}
            />
          </FormControl>
        </Flex>

        <Button mt={4} colorScheme="teal" type="submit">
          Create Language
        </Button>
      </Box>

      {isLoading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Flag</Th>
              <Th>Native Name</Th>
              <Th>English Name</Th>
              <Th>Short Code</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {languages.map((language) => (
              <Tr key={language.id}>
                <Td>
                  <img
                    src={language.iconUrl}
                    alt={language.enName}
                    width="40"
                  />
                </Td>
                <Td>{language.nativeName}</Td>
                <Td>{language.enName}</Td>
                <Td>{language.shortName}</Td>
                <Td>
                  <Badge
                    colorScheme={language.isActive ? "green" : "red"}
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {language.isActive ? "Active" : "Inactive"}
                  </Badge>
                </Td>
                <Td>
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    mr={2}
                    onClick={() => handleEdit(language)}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDelete(language.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Language</ModalHeader>
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>English Name</FormLabel>
              <Input
                name="enName"
                value={formData.enName}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Native Name</FormLabel>
              <Input
                name="nativeName"
                value={formData.nativeName}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Short Code</FormLabel>
              <Input
                name="shortName"
                value={formData.shortName}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Flag Image URL</FormLabel>
              <Input
                name="iconUrl"
                value={formData.iconUrl}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center" mb={3}>
              <FormLabel mb="0">Is Active?</FormLabel>
              <Switch isChecked={formData.isActive} onChange={handleSwitch} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleUpdate}>
              Save
            </Button>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
