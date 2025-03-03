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
  Checkbox,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";

import {
  fetchAllTexts,
  fetchAllTextContents,
  createText,
  deleteText,
  createTextContent,
  updateTextContent,
  deleteTextContent,
} from "../../api/texts";
import { fetchAllLanguages } from "../../api/languages";

interface ILanguage {
  id: number;
  nativeName: string;
}

interface ITextRow {
  id: number;
  key: string;
}

interface ITextContent {
  id: number;
  textId: number;
  languageId: number;
  content: string | null;
}

export default function TextManagement() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const [texts, setTexts] = useState<ITextRow[]>([]);
  const [textContents, setTextContents] = useState<ITextContent[]>([]);
  const [languages, setLanguages] = useState<ILanguage[]>([]);

  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const [newTextKey, setNewTextKey] = useState<string>("");

  const {
    isOpen: isTransOpen,
    onOpen: onTransOpen,
    onClose: onTransClose,
  } = useDisclosure();
  const [currentContent, setCurrentContent] =
    useState<Partial<ITextContent> | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allTexts, allTextContents, allLangs] = await Promise.all([
        fetchAllTexts(),
        fetchAllTextContents(),
        fetchAllLanguages(),
      ]);
      setTexts(allTexts);
      setTextContents(allTextContents);
      setLanguages(allLangs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddText = async () => {
    if (!newTextKey.trim()) {
      toast({
        title: "Validation",
        description: "Key cannot be empty",
        status: "warning",
      });
      return;
    }
    try {
      const created = await createText({ key: newTextKey.trim() });
      setTexts((prev) => [...prev, created]);
      toast({ title: "Success", description: "Text added", status: "success" });
      setNewTextKey("");
      onAddClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create text",
        status: "error",
      });
    }
  };

  const handleDeleteText = async (textId: number) => {
    try {
      await deleteText(textId);
      setTexts((prev) => prev.filter((t) => t.id !== textId));
      setTextContents((prev) => prev.filter((tc) => tc.textId !== textId));

      toast({ title: "Deleted", description: "Text removed", status: "info" });
    } catch {
      toast({
        title: "Error",
        description: "Delete failed",
        status: "error",
      });
    }
  };

  const findContent = (textId: number, langId: number) => {
    return textContents.find(
      (tc) => tc.textId === textId && tc.languageId === langId
    );
  };

  const handleAddTranslation = (textId: number, languageId: number) => {
    setCurrentContent({
      textId,
      languageId,
    });
    setEditValue("");
    onTransOpen();
  };

  const handleEditTranslation = (tc: ITextContent) => {
    setCurrentContent(tc);
    setEditValue(tc.content || "");
    onTransOpen();
  };

  const handleDeleteTranslation = async (tc: ITextContent) => {
    try {
      await deleteTextContent(tc.id);
      setTextContents((prev) => prev.filter((x) => x.id !== tc.id));
      toast({
        title: "Deleted",
        description: "Translation deleted",
        status: "info",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete translation",
        status: "error",
      });
    }
  };

  const handleSaveTranslation = async () => {
    if (!currentContent) return;

    const contentVal = editValue.trim();
    if (!contentVal) {
      toast({
        title: "Validation",
        description: "Content cannot be empty",
        status: "warning",
      });
      return;
    }

    try {
      if (currentContent.id) {
        const updated = await updateTextContent(currentContent.id, {
          content: contentVal,
        });
        setTextContents((prev) =>
          prev.map((tc) => (tc.id === updated.id ? updated : tc))
        );
        toast({
          title: "Updated",
          description: "Translation updated successfully",
          status: "success",
        });
      } else {
        const created = await createTextContent({
          textId: currentContent.textId!,
          languageId: currentContent.languageId!,
          content: contentVal,
        });
        setTextContents((prev) => [...prev, created]);
        toast({
          title: "Created",
          description: "New translation added",
          status: "success",
        });
      }

      onTransClose();
      setCurrentContent(null);
      setEditValue("");
    } catch {
      toast({
        title: "Error",
        description: "Failed to save translation",
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
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Text Management
        </Text>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onAddOpen}>
          Add Text
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Key</Th>
            {languages.map((lang) => (
              <Th key={lang.id}>{lang.nativeName}</Th>
            ))}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {texts.map((txt) => (
            <Tr key={txt.id}>
              <Td>{txt.id}</Td>
              <Td>{txt.key}</Td>

              {languages.map((lang) => {
                const tc = findContent(txt.id, lang.id);
                return (
                  <Td key={lang.id}>
                    {tc ? (
                      <>
                        <Checkbox isChecked={true} isReadOnly mr={2} />
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="Edit"
                          size="sm"
                          mr={1}
                          onClick={() => handleEditTranslation(tc)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete"
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteTranslation(tc)}
                        />
                      </>
                    ) : (
                      <>
                        <Checkbox isChecked={false} isReadOnly mr={2} />
                        <IconButton
                          icon={<AddIcon />}
                          aria-label="Add"
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleAddTranslation(txt.id, lang.id)}
                        />
                      </>
                    )}
                  </Td>
                );
              })}

              <Td>
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Delete Text"
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteText(txt.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Text</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Text key"
              value={newTextKey}
              onChange={(e) => setNewTextKey(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddText}>
              Add
            </Button>
            <Button onClick={onAddClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isTransOpen} onClose={onTransClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentContent?.id ? "Edit Translation" : "Add Translation"}
          </ModalHeader>
          <ModalBody>
            <Input
              placeholder="Translation content"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveTranslation}>
              Save
            </Button>
            <Button onClick={onTransClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
