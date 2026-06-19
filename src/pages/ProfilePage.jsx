import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          setError('Supabase 未配置')
          setLoading(false)
          return
        }

        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      } catch (err) {
        console.error('获取用户失败:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      )
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header with back button */}
      <header className="bg-blue-500 text-white p-4 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="text-xl mr-4"
        >
          ←
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">个人中心</h1>
        <div className="w-8"></div>
      </header>

      <div className="p-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* User Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {user?.email || '未登录'}
            </p>
            <p className="text-sm text-gray-500">
              {user ? '已登录' : '点击登录同步数据'}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-xl overflow-hidden">
          <div
            onClick={() => navigate('/login')}
            className="px-4 py-4 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-50"
          >
            <span className="text-gray-800">{user ? '更换账号' : '登录/注册'}</span>
            <span className="text-gray-400">›</span>
          </div>
          <div
            onClick={() => navigate('/collection')}
            className="px-4 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
          >
            <span className="text-gray-800">我的收藏</span>
            <span className="text-gray-400">›</span>
          </div>
        </div>

        {/* Logout */}
        {user && (
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg py-3"
            >
              退出登录
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
