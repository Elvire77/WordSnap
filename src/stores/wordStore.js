import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWordStore = create(
  persist(
    (set, get) => ({
      collections: [{ id: 'default', name: '默认收藏', words: [] }],

      addWord: (wordData) => set((state) => {
        const newWord = {
          id: Date.now().toString(),
          word: wordData.word,
          phonetic: wordData.phonetic || '',
          definition: wordData.definition || '',
          aiExample: wordData.aiExample || '',
          collectionId: wordData.collectionId || 'default',
          createdAt: new Date().toISOString()
        }

        // 添加到指定收藏本
        const collections = state.collections.map(c => {
          if (c.id === (wordData.collectionId || 'default')) {
            // 检查是否已存在该单词
            const exists = c.words.some(w => w.word.toLowerCase() === wordData.word.toLowerCase())
            if (exists) {
              return c // 已存在则不添加
            }
            return { ...c, words: [newWord, ...c.words] }
          }
          return c
        })

        return { collections }
      }),

      removeWord: (wordId, collectionId) => set((state) => ({
        collections: state.collections.map(c => {
          if (c.id === collectionId || c.id === 'default') {
            return { ...c, words: c.words.filter(w => w.id !== wordId) }
          }
          return c
        })
      })),

      addCollection: (name) => set((state) => ({
        collections: [...state.collections, { id: Date.now().toString(), name, words: [] }]
      })),

      deleteCollection: (collectionId) => set((state) => {
        // 不能删除默认收藏本
        if (collectionId === 'default') {
          return state
        }
        return {
          collections: state.collections.filter(c => c.id !== collectionId)
        }
      }),

      getCollectionWords: (collectionId) => {
        const state = get()
        const collection = state.collections.find(c => c.id === collectionId)
        return collection ? collection.words : []
      },

      getAllWords: () => {
        const state = get()
        return state.collections.flatMap(c => c.words)
      }
    }),
    {
      name: 'wordsnap-storage'
    }
  )
)
