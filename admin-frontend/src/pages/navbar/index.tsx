import { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  IconButton,
  useToast,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
  Flex,
  Text,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  AddIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import {
  fetchAllNavbars,
  fetchAllNavbarItems,
  createNavbar,
  deleteNavbar,
  createNavbarItem,
  updateNavbarItem,
  updateNavbar,
} from "../../api/navbar";
import { ILanguage } from "../../models";
import { fetchAllLanguages } from "../../api/languages";

interface INavbar {
  id: number;
  title: string;
  link: string;
  orderId: number;
  parentId?: number | null;
}

interface INavbarItem {
  id: number;
  navId: number;
  languageId: number;
  text: string;
  isActive: boolean;
}

export default function NavbarTable() {
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [navbars, setNavbars] = useState<INavbar[]>([]);
  const [navbarItems, setNavbarItems] = useState<INavbarItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const toast = useToast();

  const {
    isOpen: isTransEditOpen,
    onOpen: onTransEditOpen,
    onClose: onTransEditClose,
  } = useDisclosure();

  const [currentNavbarItem, setCurrentNavbarItem] =
    useState<Partial<INavbarItem> | null>(null);
  const [translationText, setTranslationText] = useState<string>("");

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const {
    isOpen: isTranslationOpen,
    onOpen: onTranslationOpen,
    onClose: onTranslationClose,
  } = useDisclosure();

  const [newNavbar, setNewNavbar] = useState<{
    title: string;
    link: string;
    parentId?: number | null;
    isActive?: boolean;
  }>({
    title: "",
    link: "",
    parentId: null,
    isActive: true,
  });

  const [newNavbarId, setNewNavbarId] = useState<number | null>(null);
  const [newTranslations, setNewTranslations] = useState<
    Record<number, string>
  >({});

  useEffect(() => {
    fetchAllLanguages().then((data) => setLanguages(data));
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [navbarData, navbarItemData] = await Promise.all([
        fetchAllNavbars(),
        fetchAllNavbarItems(),
      ]);
      setNavbars(navbarData);
      setNavbarItems(navbarItemData);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load navbar data",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNavbar = async () => {
    try {
      const maxOrder = navbars.reduce(
        (acc, curr) => Math.max(acc, curr.orderId),
        0
      );

      const newNavbarData = {
        ...newNavbar,
        parentId: newNavbar.parentId ? Number(newNavbar.parentId) : null,
        orderId: maxOrder + 1,
        isActive: newNavbar.isActive ?? true,
      };

      const created = await createNavbar(newNavbarData);

      setNavbars((prev) => [...prev, created]);
      setNewNavbarId(created.id);

      toast({
        title: "Navbar Added",
        description: "New menu item created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setNewNavbar({ title: "", link: "", parentId: null, isActive: true });
      onAddClose();
      onTranslationOpen();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message?.join(", ") || "Failed to add navbar",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSaveTranslations = async () => {
    if (!newNavbarId) return;

    try {
      const translationPromises = Object.entries(newTranslations).map(
        async ([languageId, text]) => {
          return createNavbarItem({
            navId: newNavbarId,
            languageId: Number(languageId),
            text,
            isActive: true,
          });
        }
      );

      await Promise.all(translationPromises);
      loadData();

      toast({
        title: "Translations Added",
        description: "All translations were successfully added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setNewTranslations({});
      setNewNavbarId(null);
      onTranslationClose();
    } catch {
      toast({
        title: "Error",
        description: "Failed to add translations",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteNavbar = async (id: number) => {
    try {
      await deleteNavbar(id);
      setNavbars((prev) => prev.filter((nav) => nav.id !== id));
      toast({
        title: "Deleted",
        description: "Navbar item deleted",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete navbar",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddTranslation = (navId: number, languageId: number) => {
    setCurrentNavbarItem({
      navId,
      languageId,
      text: "",
    });
    setTranslationText("");
    onTransEditOpen();
  };

  const handleEditTranslation = (item: INavbarItem) => {
    setCurrentNavbarItem(item);
    setTranslationText(item.text);
    onTransEditOpen();
  };

  const handleSaveOneTranslation = async () => {
    if (!currentNavbarItem) return;
    try {
      if (currentNavbarItem.id) {
        // update
        await updateNavbarItem(currentNavbarItem.id, {
          text: translationText,
          isActive: true,
        });
        setNavbarItems((prev) =>
          prev.map((it) =>
            it.id === currentNavbarItem.id
              ? { ...it, text: translationText }
              : it
          )
        );
      } else {
        const created = await createNavbarItem({
          navId: currentNavbarItem.navId!,
          languageId: currentNavbarItem.languageId!,
          text: translationText,
          isActive: true,
        });
        setNavbarItems((prev) => [...prev, created]);
      }

      toast({
        title: "Success",
        description: "Translation saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onTransEditClose();
      setCurrentNavbarItem(null);
      setTranslationText("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to save translation",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const findTranslation = (navId: number, languageId: number) => {
    return navbarItems.find(
      (item) => item.navId === navId && item.languageId === languageId
    );
  };

  const sortedNavbars = [...navbars].sort((a, b) => a.orderId - b.orderId);

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const current = sortedNavbars[index];
    const above = sortedNavbars[index - 1];
    try {
      const tempOrder = current.orderId;
      await updateNavbar(current.id, { orderId: above.orderId });
      await updateNavbar(above.id, { orderId: tempOrder });
      loadData();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update order",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === sortedNavbars.length - 1) return;
    const current = sortedNavbars[index];
    const below = sortedNavbars[index + 1];
    try {
      const tempOrder = current.orderId;
      await updateNavbar(current.id, { orderId: below.orderId });
      await updateNavbar(below.id, { orderId: tempOrder });
      loadData();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update order",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          Navbar Management
        </Text>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onAddOpen}>
          Add Navbar
        </Button>
      </Flex>

      {isLoading ? (
        <Spinner />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Order</Th>
              <Th>Parent ID</Th>
              <Th>Link</Th>
              {languages.map((lang) => (
                <Th key={lang.id}>{lang.nativeName}</Th>
              ))}
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedNavbars.map((nav, index) => (
              <Tr key={nav.id}>
                <Td>{nav.id}</Td>
                <Td>{nav.title}</Td>
                <Td>
                  <Flex align="center">
                    <Text mr={2}>{nav.orderId}</Text>
                    <IconButton
                      aria-label="Move Up"
                      icon={<ChevronUpIcon />}
                      size="sm"
                      onClick={() => handleMoveUp(index)}
                      isDisabled={index === 0}
                      mr={1}
                    />
                    <IconButton
                      aria-label="Move Down"
                      icon={<ChevronDownIcon />}
                      size="sm"
                      onClick={() => handleMoveDown(index)}
                      isDisabled={index === sortedNavbars.length - 1}
                    />
                  </Flex>
                </Td>
                <Td>{nav.parentId ?? "-"}</Td>
                <Td>{nav.link}</Td>

                {languages.map((lang) => {
                  const translation = findTranslation(nav.id, lang.id!);
                  return (
                    <Td key={lang.id}>
                      <Checkbox isChecked={!!translation} isReadOnly />
                      {translation ? (
                        <IconButton
                          aria-label="Edit Translation"
                          icon={<EditIcon />}
                          size="sm"
                          ml={2}
                          onClick={() => handleEditTranslation(translation)}
                        />
                      ) : (
                        <IconButton
                          aria-label="Add Translation"
                          icon={<AddIcon />}
                          size="sm"
                          colorScheme="blue"
                          ml={2}
                          onClick={() => handleAddTranslation(nav.id, lang.id!)}
                        />
                      )}
                    </Td>
                  );
                })}

                <Td>
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDeleteNavbar(nav.id)}
                    mr={1}
                    size="sm"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Navbar</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Title"
              mb={3}
              value={newNavbar.title}
              onChange={(e) =>
                setNewNavbar({ ...newNavbar, title: e.target.value })
              }
            />
            <Input
              placeholder="Link"
              mb={3}
              value={newNavbar.link}
              onChange={(e) =>
                setNewNavbar({ ...newNavbar, link: e.target.value })
              }
            />
            <Input
              placeholder="Parent ID (optional)"
              type="number"
              mb={3}
              value={newNavbar.parentId ?? ""}
              onChange={(e) =>
                setNewNavbar({
                  ...newNavbar,
                  parentId: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
            <Flex align="center" mb={3}>
              <Checkbox
                isChecked={newNavbar.isActive ?? true}
                onChange={(e) =>
                  setNewNavbar({ ...newNavbar, isActive: e.target.checked })
                }
              >
                Active
              </Checkbox>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddNavbar}>
              Add
            </Button>
            <Button onClick={onAddClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isTranslationOpen} onClose={onTranslationClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Translations</ModalHeader>
          <ModalBody>
            {languages.map((lang) => (
              <Input
                key={lang.id}
                placeholder={`Translation in ${lang.nativeName}`}
                mb={3}
                value={newTranslations[lang.id!] || ""}
                onChange={(e) =>
                  setNewTranslations((prev) => ({
                    ...prev,
                    [lang.id!]: e.target.value,
                  }))
                }
              />
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveTranslations}>
              Save Translations
            </Button>
            <Button onClick={onTranslationClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isTransEditOpen} onClose={onTransEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentNavbarItem?.id ? "Edit Translation" : "Add Translation"}
          </ModalHeader>
          <ModalBody>
            <Input
              placeholder="Translation text"
              value={translationText}
              onChange={(e) => setTranslationText(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={handleSaveOneTranslation}
            >
              Save
            </Button>
            <Button onClick={onTransEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
