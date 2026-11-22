import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import { SubscriptionProvider, useSubscription } from './contexts/SubscriptionContext';
import { ToastProvider } from './contexts/ToastContext';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login'; 
import { AdminPanel } from './pages/AdminPanel'; 
import { SuspendedScreen } from './pages/SuspendedScreen';
import { Dashboard } from './pages/Dashboard';
import { Servicos } from './pages/Servicos';
import { Agenda } from './pages/Agenda';
import { Clientes } from './pages/Clientes';
import { Financeiro } from './pages/Financeiro';
import { Estoque } from './pages/Estoque';
import { Relatorios } from './pages/Relatorios';
import { Configuracoes } from './pages/Configuracoes';

// IMPORTANDO O MODAL DE INSTALAÇÃO DO APP (PWA)
import { PWAInstaller } from './components/ui/PWAInstaller'; 

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const { isSuspended, loading: subLoading } = useSubscription();

  // 1. Se o Auth ainda está carregando, mostra o spinner básico.
  if (authLoading) {
    return (
      <div className="min-h-screen bg-dm-ivory flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-dm-gold/30 border-t-dm-gold animate-spin"></div>
      </div>
    );
  }

  // 2. Se não tem sessão, vai direto pro Login, ignorando o loading da assinatura.
  if (!session) {
    return <Login />;
  }

  // 3. Se tem sessão, mas a assinatura ainda está carregando, mostra o spinner.
  if (subLoading) {
    return (
      <div className="min-h-screen bg-dm-ivory flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-dm-gold/30 border-t-dm-gold animate-spin"></div>
      </div>
    );
  }

  // 4. Se a assinatura está suspensa, bloqueia a tela.
  if (isSuspended) {
    return <SuspendedScreen />;
  }

  // 5. Tudo ok, libera o app.
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/estoque" element={<Estoque />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/config" element={<Configuracoes />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<div className="text-center mt-20 text-xl font-serif">Página não encontrada.</div>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider> 
        <ToastProvider>
          <DataProvider>
            <BrowserRouter>
              <AppRoutes />
              {/* O MODAL DE INSTALAÇÃO FICA AQUI, FLUTUANDO SOBRE O APP */}
              <PWAInstaller />
            </BrowserRouter>
          </DataProvider>
        </ToastProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;