import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LanguageProvider } from "./context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Costa Rican",
  description: "Read the latest blog from Costa Rican Insurance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Marcellus&family=Mulish:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        ></link>
        <LanguageProvider>
          <div
            id="main-scroll"
            className="h-screen w-screen dark:bg-black overflow-y-scroll"
          >
            <div className="sticky top-0 z-50 bg-white dark:bg-black ">
              <Header />
            </div>
            {children}
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
