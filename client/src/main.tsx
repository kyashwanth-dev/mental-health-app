import ReactDOM from "react-dom/client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import App from "./App";

const rootElement = document.getElementById("root") as HTMLElement;
if (!rootElement) throw new Error("Root element not found");

ReactDOM.createRoot(rootElement).render(
  <ChakraProvider value={defaultSystem}>
    <App />
  </ChakraProvider>
);
          