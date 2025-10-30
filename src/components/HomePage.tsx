import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { TopBar } from "./TopBar";
import ilustracaoImage from 'figma:asset/3b40a813ed906783e5a76ae22be0e454ba009feb.png';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const servicos = [
    "Eletricista",
    "Diarista",
    "Encanador",
    "Pintor",
    "Vidraceiro",
    "Pedreiro"
  ];

  return (
    <div className="min-h-screen bg-white">
      <TopBar activeLink="inicio" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-12 px-20 py-20 max-w-[1400px] mx-auto">
        {/* Left Side */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl mb-8 leading-tight">
            Encontre o serviço<br />que você precisa aqui
          </h1>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Input
              type="text"
              placeholder="De qual serviço você precisa hoje?"
              className="pl-4 pr-12 py-6 border-2 border-gray-300 rounded-xl"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Search className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Service Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {servicos.map((servico) => (
              <Button
                key={servico}
                variant="secondary"
                className="bg-[#C8D5B9] hover:bg-[#b8c5a9] text-gray-800 rounded-xl py-3"
              >
                {servico}
              </Button>
            ))}
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="flex items-center justify-center">
          <img 
            src={ilustracaoImage} 
            alt="Família com prestador de serviço" 
            className="w-full h-auto max-w-[450px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
