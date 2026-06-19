import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { detectObjects } from '../services/vision'
import { useWordStore } from '../stores/wordStore'

export default function CapturePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [objects, setObjects] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchWord, setSearchWord] = useState('')
  const collections = useWordStore(state => state.collections)

  // 检查单词是否已收藏
  const isWordCollected = (word) => {
    return collections.some(c => c.words.some(w => w.word.toLowerCase() === word.toLowerCase())
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setImageUrl(url)
    setObjects([])
    setLoading(true)

    try {
      const detectedObjects = await detectObjects(url)
      setObjects(detectedObjects)

      if (detectedObjects.length === 0) {
        setShowSearch(true)
      }
    } catch (error) {
      console.error('识别失败:', error)
      setShowSearch(true)
    } finally {
      setLoading(false)
    }
  }

  const handleWordClick = (item) => {
    const word = typeof item === 'string' ? item : item.object
    navigate(`/word/${encodeURIComponent(word)}`)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchWord.trim()) {
      handleWordClick(searchWord.trim().toLowerCase())
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4 flex items-center">
        <button onClick={() => navigate('/')} className="text-xl mr-4">←</button>
        <h1 className="text-lg font-bold flex-1 text-center">拍照取词</h1>
        <div className="w-8"></div>
      </header>

      <div className="p-4 space-y-4">
        {/* Image Upload */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="text-5xl mb-3">📷</span>
            <span className="text-base font-medium">点击拍照</span>
            <span className="text-sm mt-1">或选择图片</span>
          </div>
        </div>

        {/* Preview Image */}
        {imageUrl && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <img src={imageUrl} alt="Preview" className="w-full h-64 object-contain" />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div className="text-5xl mb-3 animate-bounce">🔍</div>
            <p className="text-gray-500">正在识别物品...</p>
          </div>
        )}

        {/* Recognized Objects */}
        {objects.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">识别到的物品</h2>
            <div className="space-y-3">
              {objects.map((item, index) => {
                const collected = isWordCollected(item.object)
                return (
                  <div
                    key={index}
                    onClick={() => handleWordClick(item)}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 active:bg-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📷</span>
                      <div>
                        <p className="font-medium text-gray-800 text-lg">{item.objectCn}</p>
                        <p className="text-sm text-gray-500">{item.object}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {collected && (
                        <span className="text-green-500 text-sm bg-green-50 px-2 py-1 rounded">
                          已收藏 ✓
                        </span>
                      )}
                      <span className="text-sm text-gray-400">
                        {Math.round(item.confidence * 100)}%
                      </span>
                      <span className="text-gray-400">→</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Manual Search */}
        {showSearch && !loading && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-2">🔍 搜索单词</h2>
            <p className="text-sm text-gray-500 mb-4">
              没有识别到物品？请直接搜索英文单词：
            </p>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder="输入英文单词，如：phone, tissue, wallet"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
              />
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                搜索
              </button>
            </form>

            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">常用单词：</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'phone', 'computer', 'book', 'cup', 'chair', 'table', 'lamp', 'plant',
                  'watch', 'glasses', 'wallet', 'keys', 'bag', 'bottle', 'pen', 'paper',
                  'tissue', 'towel', 'soap', 'shampoo', 'toothbrush', 'remote', 'keyboard'
                ].map(word => (
                  <button
                    key={word}
                    onClick={() => handleWordClick(word)}
                    className={`px-3 py-1 rounded-full text-sm ${isWordCollected(word) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600 hover:bg-blue-50'}`}
                  >
                    {isWordCollected(word) ? `${word} ✓` : word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        {!loading && objects.length === 0 && !showSearch && (
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-medium text-blue-800 mb-2">💡 拍照小技巧</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• 尽量拍摄单个物品</li>
              <li>• 确保光线充足</li>
              <li>• 物品占据画面主体</li>
              <li>• 背景尽量简洁</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
