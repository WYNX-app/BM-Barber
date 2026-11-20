import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Importação do Auth
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login'; // Nova tela de Login
import { AdminPanel } from './pages/AdminPanel'; // Novo Painel Admin
import { Dashboard } from './pages/Dashboard';
import { Servicos } from './pages/Servicos';
import { Agenda } from './pages/Agenda';
import { Clientes } from './pages/Clientes';
import { Financeiro } from './pages/Financeiro';
import { Estoque } from './pages/Estoque';
import { Relatorios } from './pages/Relatorios';
import { Configuracoes } from './pages/Configuracoes';

// Componente que protege as rotas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  // Enquanto o Supabase verifica se há um token salvo, mostramos uma tela de carregamento elegante
  if (loading) {
    return (
      <div className="min-h-screen bg-dm-ivory flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-dm-gold/30 border-t-dm-gold animate-spin mb-4"></div>
        <p className="text-dm-graphite font-serif font-bold text-xl">Carregando D&M...</p>
      </div>
    );
  }

  // Se não houver sessão, mostra a tela de Login no lugar do app
  if (!session) {
    return <Login />;
  }

  // Se estiver logado, libera o acesso
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Rota de Login (Fica fora do Layout Principal para não ter Menu) */}
      <Route path="/login" element={<Login />} />

      {/* Rotas Protegidas (Só acessa se estiver logado) */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/config" element={<Configuracoes />} />
        
        {/* Rota do Painel do Fundador */}
        <Route path="/admin" element={<AdminPanel />} />
        
        <Route path="*" element={<div className="text-center mt-20 text-xl font-serif">Página não encontrada.</div>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    // O AuthProvider envolve tudo para que o app saiba quem está logado
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;