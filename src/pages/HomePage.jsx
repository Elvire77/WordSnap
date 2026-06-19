import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-blue-500 text-white p-6">
        <h1 className="text-2xl font-bold text-center">WordSnap</h1>
        <p className="text-center text-sm opacity-90 mt-1">拍照学单词，轻松记</p>
      </header>

      {/* Main Feature - Hero Section */}
      <main className="p-4 space-y-4">
        {/* Hero Card */}
        <div
          onClick={() => navigate('/capture')}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg cursor-pointer active:scale-98 transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="text-6xl">📸</div>
            <div>
              <h2 className="text-xl font-bold">拍照取词</h2>
              <p className="text-sm opacity-90 mt-1">拍下物品，马上知道英文</p>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/collection')}
            className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center gap-2 active:bg-gray-50 transition-colors"
          >
            <span className="text-3xl">📚</span>
            <span className="font-medium text-gray-800">我的收藏</span>
          </button>

          <button
            onClick={() => navigate('/profile')}
            className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center gap-2 active:bg-gray-50 transition-colors"
          >
            <span className="text-3xl">👤</span>
            <span className="font-medium text-gray-800">个人中心</span>
          </button>
        </div>

        {/* How It Works */}
        <section className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">如何使用</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">拍照物品</h3>
                <p className="text-sm text-gray-500 mt-1">
                  用相机拍下你想知道的物品，如杯子、书本、手机等
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 mt-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">AI 识别</h3>
                <p className="text-sm text-gray-500 mt-1">
                  系统会自动识别物品并翻译成英文
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 mt-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-bold shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">查看详情 & 收藏</h3>
                <p className="text-sm text-gray-500 mt-1">
                  查看音标、释义和例句，随时复习收藏
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Items */}
        <section className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">支持识别的物品</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {['杯子', '手机', '电脑', '书籍', '香蕉', '苹果', '猫', '狗', '汽车', '自行车', '沙发', '椅子', '时钟', '花瓶', '背包'].map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
              <span className="px-3 py-1 bg-blue-50 text-blue-500 text-sm">
                等 80+ 种物品...
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around">
        <button onClick={() => navigate('/')} className="flex flex-col items-center text-blue-500 py-1 min-w-[60px]">
          <span className="text-xl">🏠</span>
          <span className="text-xs">首页</span>
        </button>
        <button onClick={() => navigate('/capture')} className="flex flex-col items-center text-gray-500 py-1 min-w-[60px]">
          <span className="text-xl">📸</span>
          <span className="text-xs">拍照</span>
        </button>
        <button onClick={() => navigate('/collection')} className="flex flex-col items-center text-gray-500 py-1 min-w-[60px]">
          <span className="text-xl">📚</span>
          <span className="text-xs">收藏</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-gray-500 py-1 min-w-[60px]">
          <span className="text-xl">👤</span>
          <span className="text-xs">我的</span>
        </button>
      </nav>
    </div>
  )
}
