import React, { useEffect, useState } from "react";
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
import RichEditor from "../../components/RichEditor";
import {
  fetchAllPages,
  fetchAllPagesContent,
  createPage,
  deletePage,
  createPageContent,
  updatePageContent,
  deletePageContent,
} from "../../api/pages";
import { fetchAllLanguages } from "../../api/languages";

interface ILanguage {
  id: number;
  nativeName: string;
}

type PageType = "DYNAMIC" | "BLOG";

interface IPage {
  id: number;
  title: string;
  slug: string;
  type: PageType;
  isActive: boolean;
}

interface IPageContent {
  id: number;
  pagesId: number;
  languageId: number;
  meta_title: string;
  meta_description: string;
  keywords: string;
  title: string;
  content: string;
}

export default function PagesManagement() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState<IPage[]>([]);
  const [pagesContent, setPagesContent] = useState<IPageContent[]>([]);
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const {
    isOpen: isAddPageOpen,
    onOpen: onAddPageOpen,
    onClose: onAddPageClose,
  } = useDisclosure();
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const {
    isOpen: isContentOpen,
    onOpen: onContentOpen,
    onClose: onContentClose,
  } = useDisclosure();
  const [currentContent, setCurrentContent] =
    useState<Partial<IPageContent> | null>(null);
  const [editMetaTitle, setEditMetaTitle] = useState("");
  const [editMetaDesc, setEditMetaDesc] = useState("");
  const [editKeywords, setEditKeywords] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allPages, allPagesContent, allLangs] = await Promise.all([
        fetchAllPages(),
        fetchAllPagesContent(),
        fetchAllLanguages(),
      ]);
      setPages(allPages);
      setPagesContent(allPagesContent);
      setLanguages(allLangs);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load data",
        status: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPage = async () => {
    if (!newTitle.trim() || !newSlug.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and Slug cannot be empty",
        status: "warning",
      });
      return;
    }
    try {
      const createdPage = await createPage({
        title: newTitle.trim(),
        slug: newSlug.trim(),
        type: "DYNAMIC",
        isActive: true,
      });
      setPages((prev) => [...prev, createdPage]);
      toast({
        title: "Success",
        description: "Page created successfully",
        status: "success",
      });
      setNewTitle("");
      setNewSlug("");
      onAddPageClose();
    } catch {
      toast({
        title: "Error",
        description: "Failed to create Page",
        status: "error",
      });
    }
  };

  const handleDeletePage = async (pageId: number) => {
    try {
      await deletePage(pageId);
      setPages((prev) => prev.filter((p) => p.id !== pageId));
      setPagesContent((prev) => prev.filter((pc) => pc.pagesId !== pageId));
      toast({
        title: "Deleted",
        description: "Page removed successfully",
        status: "info",
      });
    } catch {
      toast({
        title: "Error",
        description: "Page delete failed",
        status: "error",
      });
    }
  };

  const findContent = (pageId: number, langId: number) => {
    return pagesContent.find(
      (pc) => pc.pagesId === pageId && pc.languageId === langId
    );
  };

  const handleAddPageContent = (pageId: number, languageId: number) => {
    setCurrentContent({ pagesId: pageId, languageId });
    setEditMetaTitle("");
    setEditMetaDesc("");
    setEditKeywords("");
    setEditTitle("");
    setEditContent("");
    onContentOpen();
  };

  const handleEditPageContent = (pc: IPageContent) => {
    setCurrentContent(pc);
    setEditMetaTitle(pc.meta_title);
    setEditMetaDesc(pc.meta_description);
    setEditKeywords(pc.keywords);
    setEditTitle(pc.title);
    setEditContent(pc.content);
    onContentOpen();
  };

  const handleDeletePageContent = async (pc: IPageContent) => {
    try {
      await deletePageContent(pc.id);
      setPagesContent((prev) => prev.filter((x) => x.id !== pc.id));
      toast({
        title: "Deleted",
        description: "Page content deleted",
        status: "info",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete page content",
        status: "error",
      });
    }
  };

  const handleSavePageContent = async () => {
    if (!currentContent) return;
    if (!editMetaTitle.trim() || !editTitle.trim()) {
      toast({
        title: "Validation",
        description: "'meta_title' և 'title' cannot be empty",
        status: "warning",
      });
      return;
    }
    const newPayload = {
      meta_title: editMetaTitle.trim(),
      meta_description: editMetaDesc.trim(),
      keywords: editKeywords.trim(),
      title: editTitle.trim(),
      content: editContent,
    };
    try {
      if (currentContent.id) {
        const updated = await updatePageContent(currentContent.id, newPayload);
        setPagesContent((prev) =>
          prev.map((pc) => (pc.id === updated.id ? updated : pc))
        );
        toast({
          title: "Updated",
          description: "Page content updated",
          status: "success",
        });
      } else {
        const created = await createPageContent({
          pagesId: currentContent.pagesId!,
          languageId: currentContent.languageId!,
          ...newPayload,
        });
        setPagesContent((prev) => [...prev, created]);
        toast({
          title: "Created",
          description: "Page content created",
          status: "success",
        });
      }
      setCurrentContent(null);
      setEditMetaTitle("");
      setEditMetaDesc("");
      setEditKeywords("");
      setEditTitle("");
      setEditContent("");
      onContentClose();
    } catch {
      toast({
        title: "Error",
        description: "Failed to save page content",
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
          Pages Management
        </Text>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          onClick={onAddPageOpen}
        >
          Add Page
        </Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Title</Th>
            <Th>Slug</Th>
            {languages.map((lang) => (
              <Th key={lang.id}>{lang.nativeName}</Th>
            ))}
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {pages.map((pg) => (
            <Tr key={pg.id}>
              <Td>{pg.id}</Td>
              <Td>{pg.title}</Td>
              <Td>{pg.slug}</Td>
              {languages.map((lang) => {
                const pc = findContent(pg.id, lang.id);
                return (
                  <Td key={lang.id}>
                    {pc ? (
                      <>
                        <Checkbox isChecked readOnly mr={2} />
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="Edit"
                          size="sm"
                          mr={1}
                          onClick={() => handleEditPageContent(pc)}
                        />
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete"
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeletePageContent(pc)}
                        />
                      </>
                    ) : (
                      <>
                        <Checkbox isChecked={false} readOnly mr={2} />
                        <IconButton
                          icon={<AddIcon />}
                          aria-label="Add"
                          size="sm"
                          colorScheme="blue"
                          onClick={() => handleAddPageContent(pg.id, lang.id)}
                        />
                      </>
                    )}
                  </Td>
                );
              })}
              <Td>
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Delete Page"
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeletePage(pg.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal
        isOpen={isAddPageOpen}
        onClose={onAddPageClose}
        scrollBehavior="outside"
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Page</ModalHeader>
          <ModalBody>
            <Text mb={1}>Title</Text>
            <Input
              placeholder="Page title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              mb={3}
            />
            <Text mb={1}>Slug</Text>
            <Input
              placeholder="URL slug (e.g., about-us)"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              mb={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddPage}>
              Add
            </Button>
            <Button onClick={onAddPageClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isContentOpen}
        onClose={onContentClose}
        size="4xl"
        scrollBehavior="outside"
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentContent?.id ? "Edit Page Content" : "Add Page Content"}
          </ModalHeader>
          <ModalBody>
            <Text fontSize="sm" color="gray.500" mb={3}>
              {currentContent?.id
                ? `Editing existing content (ID: ${currentContent.id})`
                : "Create new content for this page & language"}
            </Text>
            <Text mb={1}>Meta Title</Text>
            <Input
              placeholder="Meta Title"
              value={editMetaTitle}
              onChange={(e) => setEditMetaTitle(e.target.value)}
              mb={3}
            />
            <Text mb={1}>Meta Description</Text>
            <Input
              placeholder="Meta Description"
              value={editMetaDesc}
              onChange={(e) => setEditMetaDesc(e.target.value)}
              mb={3}
            />
            <Text mb={1}>Keywords</Text>
            <Input
              placeholder="Keywords"
              value={editKeywords}
              onChange={(e) => setEditKeywords(e.target.value)}
              mb={3}
            />
            <Text mb={1}>Title</Text>
            <Input
              placeholder="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              mb={3}
            />
            <Text mb={1}>Content</Text>
            <RichEditor
              value={editContent}
              onChange={(val) => setEditContent(val)}
              style={{ minHeight: "250px" }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSavePageContent}>
              Save
            </Button>
            <Button onClick={onContentClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
