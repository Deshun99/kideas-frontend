import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import AuthProvider from "./components/AuthProvider/AuthProvider";
import { UserContext, UserProvider } from "./context/UserContext";
import { ThemeProvider } from "@/app/context/ThemeContext";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primereact/resources/primereact.min.css'; // core css
import 'primeicons/primeicons.css'; // icons

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Kideas Parenting Platform",
  description: "Curating the best parenting advice for your children",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            <UserProvider>
              <div className="container">
                <Navbar />
                {children}
                <Footer />
              </div>
            </UserProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
