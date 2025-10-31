import { Search, User } from "lucide-react";
import { Input } from "./ui/input";

export function Header() {
  return (
    <header className="bg-white rounded-t-3xl px-8 py-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M17.5 7.5L14 11L17.5 14.5M6.5 7.5L10 11L6.5 14.5M12 4V20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[#FF6B35] text-2xl">presta.ai</span>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md mx-8">
          <Input
            type="text"
            placeholder="Buscar"
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg w-full"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <a href="#" className="text-gray-700 hover:text-[#FF6B35] transition">Início</a>
          <a href="#" className="text-gray-700 hover:text-[#FF6B35] transition">Serviços</a>
          <a href="#" className="text-gray-700 hover:text-[#FF6B35] transition">Como funcionamos?</a>
          <a href="#" className="text-gray-700 hover:text-[#FF6B35] transition">Configuração</a>
          <button className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#FF6B35] transition">
            <User className="w-5 h-5 text-gray-700" />
          </button>
        </nav>
      </div>
    </header>
  );
}
