import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('请输入邮箱和密码')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase 未配置')
      }

      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('注册成功！请查收验证邮件')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        alert('登录成功')
        navigate('/')
      }
    } catch (err) {
      console.error('登录错误:', err)
      setError(err.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with back button */}
      <header className="bg-blue-500 text-white p-4 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="text-xl"
        >
          ←
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">登录</h1>
        <div className="w-8"></div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isSignUp ? '注册账号' : '登录'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isSignUp ? '创建账号以同步你的收藏' : '登录以同步你的收藏'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="邮箱"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="密码"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-500 text-white rounded-lg py-3 font-medium disabled:opacity-50"
            >
              {loading ? '处理中...' : isSignUp ? '注册' : '登录'}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-500 text-sm"
            >
              {isSignUp ? '已有账号？去登录' : '没有账号？去注册'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
