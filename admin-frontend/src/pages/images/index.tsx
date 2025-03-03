import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
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
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

import {
  fetchAllImages,
  uploadImage,
  deleteImage,
  updateImage,
} from "../../api/images";

interface IImage {
  id: number;
  key: string;
  imageUrl: string;
}

export default function ImagesManagement() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [images, setImages] = useState<IImage[]>([]);

  // State for Upload
  const [newKey, setNewKey] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);

  // State for Edit
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editImage, setEditImage] = useState<IImage | null>(null);

  // State for Preview
  const [previewImage, setPreviewImage] = useState<IImage | null>(null);

  // Modals
  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isPreviewOpen,
    onOpen: onPreviewOpen,
    onClose: onPreviewClose,
  } = useDisclosure();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllImages(); // Պետք է վերադարձնի [{ id, key, imageUrl }, ...]
      setImages(data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load images",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Image Upload
  const handleUploadImage = async () => {
    if (!newKey.trim() || !newFile) {
      toast({
        title: "Validation",
        description: "Please provide a key and select a file",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("key", newKey);
      formData.append("file", newFile);

      const uploaded = await uploadImage(formData);
      // վերադարձրեք backend-ից վերբեռնված նկարի օբյեկտը (id, key, imageUrl)

      setImages((prev) => [...prev, uploaded]);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Մաքրել state-ը և փակել մոդալը
      setNewKey("");
      setNewFile(null);
      onUploadClose();
    } catch {
      toast({
        title: "Error",
        description: "Failed to upload image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle Image Update
  const handleUpdateImage = async () => {
    if (!editImage || !editFile) {
      toast({
        title: "Validation",
        description: "Please select a new file to update",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", editFile);

      const updated = await updateImage(editImage.key, formData);
      // պետք է վերադարձնի թարմացված նկարի օբյեկտը (id, key, imageUrl)

      setImages((prev) =>
        prev.map((img) => (img.key === editImage.key ? updated : img))
      );

      toast({
        title: "Updated",
        description: "Image updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Մաքրել state-ը և փակել մոդալը
      setEditFile(null);
      setEditImage(null);
      onEditClose();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle Image Delete
  const handleDeleteImage = async (key: string) => {
    try {
      await deleteImage(key);

      setImages((prev) => prev.filter((img) => img.key !== key));

      toast({
        title: "Deleted",
        description: "Image deleted successfully",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete image",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Flex justifyContent="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">
          Image Management
        </Text>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          onClick={onUploadOpen}
        >
          Upload Image
        </Button>
      </Flex>

      {/* Loader */}
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" mt={8}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Key</Th>
              <Th>Preview</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {images.map((img) => (
              <Tr key={img.id}>
                <Td>{img.id}</Td>
                <Td>{img.key}</Td>
                <Td>
                  <Image
                    src={`http://localhost:3000${img.imageUrl}`}
                    alt={img.key}
                    boxSize="50px"
                    objectFit="cover"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => {
                      setPreviewImage(img);
                      onPreviewOpen();
                    }}
                  />
                </Td>
                <Td>
                  <IconButton
                    icon={<ViewIcon />}
                    aria-label="View Image"
                    size="sm"
                    colorScheme="blue"
                    onClick={() => {
                      setPreviewImage(img);
                      onPreviewOpen();
                    }}
                  />
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit Image"
                    size="sm"
                    colorScheme="yellow"
                    ml={2}
                    onClick={() => {
                      setEditImage(img);
                      onEditOpen();
                    }}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete Image"
                    size="sm"
                    colorScheme="red"
                    ml={2}
                    onClick={() => handleDeleteImage(img.key)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {/* ------------------ Upload Image Modal ------------------ */}
      <Modal isOpen={isUploadOpen} onClose={onUploadClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload New Image</ModalHeader>
          <ModalBody>
            <Text mb={2}>Key (unique identifier)</Text>
            <Input
              placeholder="Enter unique key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              mb={4}
            />
            <Input
              type="file"
              onChange={(e) => setNewFile(e.target.files?.[0] || null)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleUploadImage}>
              Upload
            </Button>
            <Button onClick={onUploadClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ------------------ Edit Image Modal ------------------ */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Image</ModalHeader>
          <ModalBody>
            <Text mb={2}>
              Editing: <strong>{editImage?.key}</strong>
            </Text>
            <Input
              type="file"
              onChange={(e) => setEditFile(e.target.files?.[0] || null)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="yellow" mr={3} onClick={handleUpdateImage}>
              Update
            </Button>
            <Button onClick={onEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ------------------ Preview Image Modal ------------------ */}
      <Modal isOpen={isPreviewOpen} onClose={onPreviewClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preview Image</ModalHeader>
          <ModalBody>
            {previewImage && (
              <Image
                src={`http://localhost:3000${previewImage.imageUrl}`}
                alt={previewImage.key}
                maxW="100%"
                maxH="80vh"
                objectFit="contain"
                borderRadius="md"
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onPreviewClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
