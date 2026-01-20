import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from "./App.tsx";

// Custom JobRasa Theme
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#e6f7f7',
      100: '#b3e6e6',
      200: '#80d4d4',
      300: '#4dc3c3',
      400: '#1ab1b1',
      500: '#0d9494',
      600: '#0a7676',
      700: '#075959',
      800: '#043b3b',
      900: '#011e1e',
    },
    accent: {
      50: '#fff4e6',
      100: '#ffe0b3',
      200: '#ffcc80',
      300: '#ffb84d',
      400: '#ffa41a',
      500: '#ff9500',
      600: '#cc7700',
      700: '#995900',
      800: '#663b00',
      900: '#331e00',
    },
  },
  fonts: {
    heading: `'Inter', system-ui, -apple-system, sans-serif`,
    body: `'Inter', system-ui, -apple-system, sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: 'transparent',
        overflowX: 'hidden',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'xl',
      },
    },
  },
});

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <StrictMode>
      <ChakraProvider theme={theme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ChakraProvider>
    </StrictMode>
  );
}
