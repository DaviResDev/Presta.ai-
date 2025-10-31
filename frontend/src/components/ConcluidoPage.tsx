import { Search, MessageSquare, User } from "lucide-react";
import { Input } from "./ui/input";
import ilustracaoImage from 'figma:asset/117d47ad3fe5ac2781a042461c6b11399ebac9ac.png';
import logoImage from 'figma:asset/1768287f24ab0a2fae932e69f80bea244b7be19d.png';

interface ConcluidoPageProps {
  onNavigate?: (page: string) => void;
}

export function ConcluidoPage({ onNavigate }: ConcluidoPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header diferente */}
      <header className="px-8 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onNavigate?.("inicio")}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <img 
                src={logoImage} 
                alt="presta.ai logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-[#FF6B35] text-xl">presta.ai</span>
            </button>

            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar"
                  className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg w-60"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <nav className="flex items-center gap-6">
                <button className="text-sm text-gray-700 hover:text-[#FF6B35] transition">
                  Início
                </button>
                <button className="text-sm text-gray-700 hover:text-[#FF6B35] transition">
                  Encontre Projetos
                </button>
                <button className="text-sm text-gray-700 hover:text-[#FF6B35] transition">
                  Configuração
                </button>
                <button className="text-gray-700 hover:text-[#FF6B35] transition">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="text-gray-700 hover:text-[#FF6B35] transition">
                  <User className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-12 px-20 py-20 max-w-[1400px] mx-auto">
        {/* Left Side - Text */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl mb-4 leading-tight">
            Enviado com Sucesso
          </h1>
          <h2 className="text-[#FF6B35] text-3xl mb-6">
            Seus dados estão sendo avaliados
          </h2>
          <p className="text-gray-600 text-lg">
            Em até 15 dias úteis enviaremos o e-mail de confirmação
          </p>
        </div>

        {/* Right Side - Illustration */}
        <div className="flex items-center justify-center">
          <img 
            src={ilustracaoImage} 
            alt="Família com prestador de serviço" 
            className="w-full h-auto max-w-[500px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
