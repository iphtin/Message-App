import { Inter } from "next/font/google";
import "../globals.css";
import TopBar from "@components/Tobar";
import Providers from "@components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chats",
  description: "Chats page user exchange conversion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
        <TopBar />
        {children}
        </Providers>
        </body>
    </html>
  );
}