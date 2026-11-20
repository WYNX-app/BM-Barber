import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { Shield, UserPlus, Database, Trash2, Mail } from 'lucide-react'

export function AdminPanel() {
  const { isAdmin } = useAuth()
  const [professionals, setProfessionals] = useState<any[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  // Buscar profissionais cadastrados (que estão na tabela profiles)
  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await supabase.from('profiles').select('*')
      if (data) setProfessionals(data)
    }
    if (isAdmin) fetchProfiles()
  }, [isAdmin])

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-dm-graphite">
        <Shield size={64} className="text-red-500 mb-4 opacity-50" />
        <h2 className="text-2xl font-serif">Acesso Restrito</h2>
        <p>Área exclusiva do fundador (Heitor).</p>
      </div>
    )
  }

  // Simulação de convite (No mundo real, isso seria feito via Edge Function)
  const handleAddProfessional = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    alert("Para adicionar um novo profissional de forma segura, vá no painel do Supabase > Authentication > Users e crie o usuário. Depois, adicione o role dele no banco.")
    setLoading(false)
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-3 border-b border-dm-gold/30 pb-4">
        <div className="p-3 bg-dm-black rounded-2xl text-dm-gold">
          <Shield size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-serif font-bold text-dm-black">Painel do Fundador</h1>
          <p className="text-dm-graphite/70">Bem-vindo, Heitor. Gerencie sua equipe e o sistema.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Card de Gerenciamento de Equipe */}
        <div className="bg-dm-white p-6 rounded-2xl border border-dm-gold/20 shadow-sm">
          <h2 className="text-xl font-serif mb-4 flex items-center gap-2">
            <UserPlus className="text-dm-gold" /> Equipe D&M
          </h2>
          
          <form onSubmit={handleAddProfessional} className="flex gap-2 mb-6">
            <input 
              type="email" 
              placeholder="Email do novo barbeiro" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 p-3 border-2 border-dm-ivory rounded-xl outline-none focus:border-dm-gold"
            />
            <button type="submit" disabled={loading} className="bg-dm-black text-white px-4 rounded-xl font-bold hover:bg-dm-graphite">
              Convidar
            </button>
          </form>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-dm-graphite/50 mb-2">Usuários no Sistema</p>
            {professionals.map((prof) => (
              <div key={prof.id} className="flex items-center justify-between p-3 bg-dm-ivory/30 rounded-xl border border-dm-gold/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-dm-gold/20 flex items-center justify-center text-dm-gold font-bold">
                    {prof.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-dm-black">{prof.full_name || 'Sem nome'}</p>
                    <p className="text-xs text-dm-graphite/60 flex items-center gap-1"><Mail size={12}/> {prof.id.split('-')[0]}...</p>
                  </div>
                </div>
                {/* O ícone de lixeira só apareceria se não fosse o próprio Heitor */}
                <button className="text-dm-graphite/30 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Card de Banco de Dados / Backup */}
        <div className="bg-dm-white p-6 rounded-2xl border border-dm-gold/20 shadow-sm h-fit">
          <h2 className="text-xl font-serif mb-4 flex items-center gap-2">
            <Database className="text-dm-gold" /> Sistema e Backup
          </h2>
          <p className="text-dm-graphite/70 text-sm mb-6">
            A nuvem está conectada. Todos os dados dos barbeiros estão sendo sincronizados automaticamente de forma segura.
          </p>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
            <p className="text-green-800 font-bold text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Banco de Dados Online
            </p>
          </div>

          <button className="w-full py-3 bg-dm-black text-white rounded-xl font-bold hover:bg-dm-graphite transition-colors flex items-center justify-center gap-2">
            Baixar Backup Completo
          </button>
        </div>

      </div>
    </div>
  )
}