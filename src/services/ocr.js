import Tesseract from 'tesseract.js'

/**
 * 从图片中提取英文单词
 * @param {string} imageUrl - 图片 URL
 * @returns {Promise<string[]>} - 单词数组
 */
export async function extractText(imageUrl) {
  try {
    const result = await Tesseract.recognize(imageUrl, 'eng', {
      logger: (m) => console.log(m)
    })

    const text = result.data.text
    // 提取英文单词，过滤掉数字和符号
    const words = text.match(/[a-zA-Z]{2,}/g) || []
    // 去重并转换为小写
    return [...new Set(words.map(w => w.toLowerCase()))]
  } catch (error) {
    console.error('OCR Error:', error)
    throw error
  }
}
