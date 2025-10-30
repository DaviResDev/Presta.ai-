import logoImage from 'figma:asset/1768287f24ab0a2fae932e69f80bea244b7be19d.png';

interface TopBarProps {
  activeLink?: string;
  onNavigate?: (page: string) => void;
}

export function TopBar({ activeLink = "inicio", onNavigate }: TopBarProps) {
  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <header className="px-8 py-4 border-b border-gray-100">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => handleNavigation("inicio")}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <img 
            src={logoImage} 
            alt="presta.ai logo" 
            className="w-10 h-10 object-contain"
          />
        </button>

        <nav className="flex items-center gap-6">
          <button
            onClick={() => handleNavigation("inicio")}
            className={`text-sm transition ${
              activeLink === "inicio" ? "text-[#FF6B35]" : "text-gray-700 hover:text-[#FF6B35]"
            }`}
          >
            Início
          </button>
          <button
            className="text-sm text-gray-700 hover:text-[#FF6B35] transition"
          >
            Serviços
          </button>
          <button
            className="text-sm text-gray-700 hover:text-[#FF6B35] transition"
          >
            Como funcionamos?
          </button>
          <button
            className="text-sm text-gray-700 hover:text-[#FF6B35] transition"
          >
            Entrar
          </button>
          <button
            onClick={() => handleNavigation("cadastro")}
            className={`text-sm transition ${
              activeLink === "cadastro" ? "text-[#FF6B35]" : "text-gray-700 hover:text-[#FF6B35]"
            }`}
          >
            Cadastre-se
          </button>
        </nav>
      </div>
    </header>
  );
}
