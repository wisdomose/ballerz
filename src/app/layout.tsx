import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import FirebaseInit from "./FirebaseInit";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: ["roboto"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Ballerz",
  description: "Everything basketball in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`pb-10 ${poppins.className}`}>
        <FirebaseInit>{children}</FirebaseInit>
        <ToastContainer
          position="bottom-center"
          hideProgressBar
          pauseOnFocusLoss={false}
          pauseOnHover={false}
        />
      </body>
    </html>
  );
}
