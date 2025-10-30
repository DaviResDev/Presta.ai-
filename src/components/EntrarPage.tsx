import { EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { TopBar } from "./TopBar";

interface EntrarPageProps {
  onNavigate?: (page: string) => void;
}

export function EntrarPage({ onNavigate }: EntrarPageProps) {
  return (
    <div className="min-h-screen bg-[#C8D5B9] flex items-center justify-center p-8">
      <div className="bg-white rounded-[40px] w-full max-w-7xl shadow-lg">
        <TopBar activeLink="entrar" onNavigate={onNavigate} />

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center py-20 px-12">
          <h1 className="text-5xl mb-12">Entrar</h1>

          <div className="w-full max-w-sm bg-white rounded-2xl p-8 border border-gray-100">
            <div className="space-y-6">
              {/* E-mail */}
              <div>
                <Label htmlFor="email" className="text-gray-700 mb-2 block">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ex: @joaoservicos"
                  className="w-full border-gray-200"
                />
              </div>

              {/* Senha */}
              <div>
                <Label htmlFor="senha" className="text-gray-700 mb-2 block">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type="password"
                    className="w-full pr-10 border-gray-200"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <EyeOff className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-[#FF6B35] hover:bg-[#e55a28] text-white py-6 rounded-xl">
                  Avançar
                </Button>
                <Button 
                  onClick={() => onNavigate?.("cadastro")}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-6 rounded-xl"
                >
                  Cadastrar-se
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
