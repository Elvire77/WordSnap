import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchWordDetails, fetchAiExamples, translateSentence } from '../services/ai'
import { useWordStore } from '../stores/wordStore'

export default function WordDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const word = decodeURIComponent(id)
  const [loading, setLoading] = useState(true)
  const [details, setDetails] = useState(null)
  const [aiExamples, setAiExamples] = useState([])
  const [exampleTranslations, setExampleTranslations] = useState({})
  const [saving, setSaving] = useState(false)
  const [showCollectionPicker, setShowCollectionPicker] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [playingExample, setPlayingExample] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const collections = useWordStore(state => state.collections)
  const addWord = useWordStore(state => state.addWord)

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true)
      try {
        const detailsData = await fetchWordDetails(word)
        setDetails(detailsData)

        const examples = await fetchAiExamples(word)
        setAiExamples(examples)

        // 翻译例句
        const translations = {}
        for (let i = 0; i < examples.length; i++) {
          translations[i] = await translateSentence(examples[i])
        }
        setExampleTranslations(translations)
      } catch (error) {
        console.error('Error loading details:', error)
      } finally {
        setLoading(false)
      }
    }
    loadDetails()
  }, [word])

  // 播放单词发音
  const playPronunciation = () => {
    if ('speechSynthesis' in window) {
      setPlaying(true)
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      utterance.onend = () => setPlaying(false)
      utterance.onerror = () => setPlaying(false)
      window.speechSynthesis.speak(utterance)
    }
  }

  // 播放例句发音
  const playExample = (example, index) => {
    if ('speechSynthesis' in window) {
      setPlayingExample(index)
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(example)
      utterance.lang = 'en-US'
      utterance.rate = 0.7
      utterance.onend = () => setPlayingExample(null)
      utterance.onerror = () => setPlayingExample(null)
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleSaveClick = () => {
    setShowCollectionPicker(true)
  }

  const handleSaveToCollection = (collectionId) => {
    setSaving(true)
    try {
      addWord({
        word,
        phonetic: details?.phonetic || '',
        definition: details?.definition || '',
        aiExample: aiExamples.join('\n'),
        collectionId
      })
      const collectionName = getCollectionName(collectionId)
      setShowCollectionPicker(false)
      setSavedMessage(`已收藏到「${collectionName}」`)
      setTimeout(() => setSavedMessage(''), 3000)
    } catch (error) {
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const getCollectionName = (collectionId) => {
    const collection = collections.find(c => c.id === collectionId)
    return collection ? collection.name : '默认收藏'
  }

  // 检查单词是否已收藏
  const isWordCollected = () => {
    return collections.some(c => c.words.some(w => w.word.toLowerCase() === word.toLowerCase()))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-blue-500 text-white p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="text-xl mr-4">←</button>
        <h1 className="text-lg font-bold flex-1 text-center">{word}</h1>
        <button onClick={() => navigate('/')} className="text-sm bg-blue-400 px-3 py-1 rounded">首页</button>
      </header>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : (
          <>
            {/* Word Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-800">{word}</h2>
                    <button
                      onClick={playPronunciation}
                      disabled={playing}
                      className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
                    >
                      <span className="text-blue-500">{playing ? '🔊' : '🔈'}</span>
                    </button>
                  </div>
                  {details?.phonetic && (
                    <p className="text-gray-500 mt-1">{details.phonetic}</p>
                  )}
                </div>
                {isWordCollected() ? (
                  <span className="bg-green-100 text-green-600 px-4 py-2 rounded text-sm">已收藏 ✓</span>
                ) : (
                  <button onClick={handleSaveClick} className="bg-blue-500 text-white px-4 py-2 rounded text-sm">
                    收藏
                  </button>
                )}
              </div>
            </div>

            {/* Definition */}
            {details?.definition && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">释义</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{details.definition}</p>
              </div>
            )}

            {/* Examples */}
            {aiExamples.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">例句</h3>
                <div className="space-y-4">
                  {aiExamples.map((example, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-500 font-bold mt-1">{index + 1}.</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-700">{example}</p>
                            <button
                              onClick={() => playExample(example, index)}
                              disabled={playingExample === index}
                              className="text-gray-400 hover:text-blue-500"
                            >
                              <span className="text-sm">{playingExample === index ? '🔊' : '🔈'}</span>
                            </button>
                          </div>
                          {exampleTranslations[index] && (
                            <p className="text-gray-500 text-sm mt-1">译文：{exampleTranslations[index]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h3 className="font-medium text-blue-800 mb-2">💡 学习提示</h3>
              <p className="text-sm text-blue-600">
                点击 🔈 听单词和例句发音，多听多说记得更牢！
              </p>
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {savedMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg z-50">
          ✓ {savedMessage}
        </div>
      )}

      {/* Collection Picker */}
      {showCollectionPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 max-h-96 overflow-y-auto">
            <h3 className="font-semibold text-gray-800 mb-4">选择收藏本</h3>
            <div className="space-y-2">
              {collections.map(collection => (
                <div
                  key={collection.id}
                  onClick={() => !saving && handleSaveToCollection(collection.id)}
                  className={`p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 ${saving ? 'opacity-50' : ''}`}
                >
                  <p className="font-medium text-gray-800">{collection.name}</p>
                  <p className="text-sm text-gray-500">{collection.words.length} 个单词</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowCollectionPicker(false)}
              className="w-full mt-4 py-2 border border-gray-300 rounded-lg text-gray-600"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
