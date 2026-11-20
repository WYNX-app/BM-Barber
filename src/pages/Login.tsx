import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError('Email ou senha inválidos.')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-dm-ivory flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-dm-white p-8 rounded-3xl border border-dm-gold/30 shadow-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-dm-black flex items-center justify-center mx-auto mb-4">
            <span className="font-serif text-2xl font-bold">D&M</span>
          </div>
          <h1 className="text-3xl font-serif font-bold">Acesso Restrito</h1>
          <p className="text-dm-graphite/60 mt-2">Entre com suas credenciais</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-4 border-2 border-dm-ivory rounded-xl outline-none focus:border-dm-gold"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-4 border-2 border-dm-ivory rounded-xl outline-none focus:border-dm-gold"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full py-4 bg-dm-black text-dm-white rounded-xl font-bold hover:bg-dm-graphite transition-colors">
            Entrar
          </button>
        </form>
      </motion.div>
    </div>
  )
}