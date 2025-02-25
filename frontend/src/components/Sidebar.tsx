import { Box, VStack, Link, Icon, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { AtSignIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";

const Sidebar = () => {
  const menuItems = [
    { label: "Languages", path: "/languages", icon: AtSignIcon },
    { label: "Pages", path: "/pages", icon: EditIcon },
    { label: "Menus", path: "/menus", icon: SettingsIcon },
  ];

  return (
    <Box
      w="250px"
      h="100vh"
      bg="gray.800"
      color="white"
      p="4"
      position="fixed"
      left="0"
      top="0"
    >
      <Text fontSize="2xl" mb="6" fontWeight="bold">
        Admin Panel
      </Text>
      <VStack align="start" spacing="4">
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path} style={{ width: "100%" }}>
            {({ isActive }) => (
              <Box
                p="2"
                borderRadius="md"
                bg={isActive ? "teal.500" : "transparent"}
                _hover={{ bg: "teal.600" }}
                display="flex"
                alignItems="center"
              >
                <Icon as={item.icon} mr="2" />
                <Text>{item.label}</Text>
              </Box>
            )}
          </NavLink>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
