import { Box } from "@chakra-ui/react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <Box display="flex">
      <Sidebar />
      <Box ml="250px" p="6" w="100%">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
