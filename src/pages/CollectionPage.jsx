import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWordStore } from '../stores/wordStore'

export default function CollectionPage() {
  const navigate = useNavigate()
  const [showDialog, setShowDialog] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [selectedCollection, setSelectedCollection] = useState(null)
  const collections = useWordStore(state => state.collections)
  const addCollection = useWordStore(state => state.addCollection)
  const deleteCollection = useWordStore(state => state.deleteCollection)
  const removeWord = useWordStore(state => state.removeWord)

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      addCollection(newCollectionName.trim())
      setNewCollectionName('')
      setShowDialog(false)
    }
  }

  const handleDelete = (collection) => {
    setDeleteConfirm(collection)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteCollection(deleteConfirm.id)
      setDeleteConfirm(null)
    }
  }

  const handleWordClick = (word) => {
    navigate(`/word/${encodeURIComponent(word.word)}`)
  }

  const handleRemoveWord = (e, wordId, collectionId) => {
    e.stopPropagation()
    removeWord(wordId, collectionId)
  }

  const viewCollection = (collection) => {
    setSelectedCollection(collection)
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
        <h1 className="text-lg font-bold flex-1 text-center">我的收藏</h1>
        <button
          onClick={() => setShowDialog(true)}
          className="bg-white text-blue-500 px-3 py-1 rounded text-sm font-medium"
        >
          新建
        </button>
      </header>

      <div className="p-4 space-y-4">
        {collections.map(collection => (
          <div key={collection.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex justify-between items-center">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => viewCollection(collection)}
                >
                  <h3 className="font-semibold text-gray-800">{collection.name}</h3>
                  <span className="text-sm text-gray-500">{collection.words.length} 个单词</span>
                </div>
                <div className="flex items-center gap-2">
                  {collection.words.length > 0 && (
                    <button
                      onClick={() => viewCollection(collection)}
                      className="text-blue-500 text-sm px-2 py-1"
                    >
                      查看
                    </button>
                  )}
                  {collection.id !== 'default' && (
                    <button
                      onClick={() => handleDelete(collection)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>

            {collection.words.length > 0 && (
              <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  {collection.words.slice(0, 3).map(word => (
                    <div
                      key={word.id}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                    >
                      <span
                        onClick={() => handleWordClick(word)}
                        className="cursor-pointer hover:text-blue-500"
                      >
                        {word.word}
                      </span>
                      <button
                        onClick={(e) => handleRemoveWord(e, word.id, collection.id)}
                        className="text-gray-400 hover:text-red-500 ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {collection.words.length > 3 && (
                  <p className="text-sm text-gray-400 mt-2">
                    还有 {collection.words.length - 3} 个单词...
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

        {collections.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center text-gray-400">
            <p className="text-4xl mb-2">📚</p>
            <p>暂无收藏</p>
          </div>
        )}
      </div>

      {/* Collection Detail Modal */}
      {selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-11/12 max-h-3/4 overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-lg">{selectedCollection.name}</h3>
              <button
                onClick={() => setSelectedCollection(null)}
                className="text-gray-500 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              {selectedCollection.words.length === 0 ? (
                <p className="text-center text-gray-400 py-8">暂无单词</p>
              ) : (
                <div className="space-y-2">
                  {selectedCollection.words.map(word => (
                    <div
                      key={word.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        onClick={() => handleWordClick(word)}
                        className="flex-1 cursor-pointer hover:text-blue-500"
                      >
                        <p className="font-medium text-gray-800">{word.word}</p>
                        <p className="text-sm text-gray-500 truncate">{word.definition}</p>
                      </div>
                      <button
                        onClick={(e) => handleRemoveWord(e, word.id, selectedCollection.id)}
                        className="text-gray-400 hover:text-red-500 p-2"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Collection Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80">
            <h3 className="font-semibold text-gray-800 mb-4">新建收藏本</h3>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="请输入收藏本名称"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleCreateCollection}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80">
            <h3 className="font-semibold text-gray-800 mb-2">确认删除</h3>
            <p className="text-gray-500 mb-4">
              确定要删除收藏本 "{deleteConfirm.name}" 吗？里面的单词也会被删除。
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
