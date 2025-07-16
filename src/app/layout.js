import { Inter } from "next/font/google";
import "./globals.css";

// Import both providers using the correct relative paths
import { AppContextProvider } from '../context/AppContext';
import { CartProvider } from '../context/CartContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Wyncell App",
  description: "eSIMs for your travel needs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Nest the providers. This makes both available to the entire app. */}
        <AppContextProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AppContextProvider>
      </body>
    </html>
  );
}

