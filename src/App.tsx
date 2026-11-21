import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import { SubscriptionProvider, useSubscription } from './contexts/SubscriptionContext'; // <-- NOVO
import { ToastProvider } from './contexts/ToastContext';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login'; 
import { AdminPanel } from './pages/AdminPanel'; 
import { SuspendedScreen } from './pages/SuspendedScreen'; // <-- NOVO
import { Dashboard } from './pages/Dashboard';
import { Servicos } from './pages/Servicos';
import { Agenda } from './pages/Agenda';
import { Clientes } from './pages/Clientes';
import { Financeiro } from './pages/Financeiro';
import { Estoque } from './pages/Estoque';
import { Relatorios } from './pages/Relatorios';
import { Configuracoes } from './pages/Configuracoes';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const { isSuspended, loading: subLoading } = useSubscription();

  // Mostra o loading enquanto verifica o login e a assinatura
  if (authLoading || subLoading) {
    return (
      <div className="min-h-screen bg-dm-ivory flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full border-4 border-dm-gold/30 border-t-dm-gold animate-spin mb-4"></div>
        <p className="text-dm-graphite font-serif font-bold text-xl">Verificando acesso...</p>
      </div>
    );
  }

  // Se não estiver logado, manda pro Login
  if (!session) {
    return <Login />;
  }

  // Se a assinatura estiver suspensa por atraso, bloqueia o app
  if (isSuspended) {
    return <SuspendedScreen />;
  }

  // Se estiver tudo certo, libera o app
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

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
        
        {/* A rota do admin fica protegida pelo login, mas ele também precisa passar pelo bloqueio */}
        <Route path="/admin" element={<AdminPanel />} />
        
        <Route path="*" element={<div className="text-center mt-20 text-xl font-serif">Página não encontrada.</div>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      {/* O SubscriptionProvider precisa ficar dentro do AuthProvider para saber quem é o usuário */}
      <SubscriptionProvider> 
        <ToastProvider>
          <DataProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </DataProvider>
        </ToastProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;