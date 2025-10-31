import { useState } from "react";
import { Toaster } from "sonner";
import { HomePage } from "./components/HomePage";
import { CadastroPage } from "./components/CadastroPage";
import { EntrarPage } from "./components/EntrarPage";
import { ComoFuncionamosPage } from "./components/ComoFuncionamosPage";
import { ConcluidoPage } from "./components/ConcluidoPage";

type PageType = "inicio" | "cadastro" | "entrar" | "como-funcionamos" | "concluido";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>("inicio");

  const handleNavigation = (page: string) => {
    if (["inicio", "cadastro", "entrar", "como-funcionamos", "concluido"].includes(page)) {
      setCurrentPage(page as PageType);
    }
  };

  return (
    <div>
      <Toaster position="top-right" richColors />
      {currentPage === "inicio" && <HomePage onNavigate={handleNavigation} />}
      {currentPage === "cadastro" && <CadastroPage onNavigate={handleNavigation} />}
      {currentPage === "entrar" && <EntrarPage onNavigate={handleNavigation} />}
      {currentPage === "como-funcionamos" && <ComoFuncionamosPage onNavigate={handleNavigation} />}
      {currentPage === "concluido" && <ConcluidoPage onNavigate={handleNavigation} />}
    </div>
  );
}
