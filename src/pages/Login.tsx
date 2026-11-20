import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (isRegister) {
      if (!fullName) return setError('Por favor, digite seu nome.')
      
      const { error } = await signUp(email, password, fullName)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Conta criada! Verifique seu e-mail para confirmar (se configurado) ou faça login.')
        setIsRegister(false)
        setPassword('')
      }
    } else {
      const { error } = await signIn(email, password)
      if (error) {
        setError('Email ou senha inválidos.')
      } else {
        navigate('/')
      }
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
          <h1 className="text-3xl font-serif font-bold">
            {isRegister ? 'Criar Conta' : 'Acesso Restrito'}
          </h1>
          <p className="text-dm-graphite/60 mt-2">
            {isRegister ? 'Junte-se à equipe D&M' : 'Entre com suas credenciais'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Seu Nome Completo"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full p-4 border-2 border-dm-ivory rounded-xl outline-none focus:border-dm-gold bg-dm-ivory/30"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-4 border-2 border-dm-ivory rounded-xl outline-none focus:border-dm-gold bg-dm-ivory/30"
            required
          />
          
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-4 border-2 border-dm-ivory rounded-xl outline-none focus:border-dm-gold bg-dm-ivory/30"
            required
          />
          
          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm font-medium text-center">{success}</p>}
          
          <button type="submit" className="w-full py-4 bg-dm-black text-dm-white rounded-xl font-bold hover:bg-dm-graphite transition-colors mt-2">
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
            className="text-sm font-medium text-dm-graphite hover:text-dm-gold transition-colors"
          >
            {isRegister ? 'Já tem uma conta? Faça login' : 'Ainda não tem conta? Cadastre-se'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}