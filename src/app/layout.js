// src/app/layout.js
import "./globals.css";
import { AppProvider } from "@/context/LanguageContext";

export const metadata = {
  title: "Wyncell",
  description: "High-Speed Internet and Global eSIMs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}