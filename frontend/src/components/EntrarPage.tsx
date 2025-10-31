import { EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { TopBar } from "./TopBar";

interface EntrarPageProps {
  onNavigate?: (page: string) => void;
}

export function EntrarPage({ onNavigate }: EntrarPageProps) {
  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <TopBar activeLink="entrar" onNavigate={onNavigate} />

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="flex items-center justify-center min-h-full px-4 sm:px-6 py-2">
          <div className="w-full max-w-[450px]">
            <div className="text-center mb-3">
              <h1 className="text-2xl mb-1">Entrar</h1>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="space-y-4">
                {/* E-mail */}
                <div>
                  <Label htmlFor="email" className="text-gray-700 mb-1 block text-sm">
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
                  <Label htmlFor="senha" className="text-gray-700 mb-1 block text-sm">
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
                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={() => onNavigate?.("concluido")}
                    className="flex-1 bg-[#FF6B35] hover:bg-[#e55a28] text-white py-2.5 rounded-xl text-sm"
                  >
                    Avançar
                  </Button>
                  <Button 
                    onClick={() => onNavigate?.("cadastro")}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 rounded-xl text-sm"
                  >
                    Cadastrar-se
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
