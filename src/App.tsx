import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { CadastroPage } from "./components/CadastroPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"inicio" | "cadastro">("inicio");

  const handleNavigation = (page: string) => {
    if (page === "inicio" || page === "cadastro") {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      {currentPage === "inicio" && <HomePage onNavigate={handleNavigation} />}
      {currentPage === "cadastro" && <CadastroPage onNavigate={handleNavigation} />}
    </div>
  );
}
