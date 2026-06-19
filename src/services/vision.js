/**
 * 物体识别服务 - 使用百度图像识别 API
 * 通过 Netlify Functions 代理，解决 CORS 问题
 */

const API_BASE = '/.netlify/functions'

/**
 * 获取 Access Token（通过服务端代理）
 */
async function getAccessToken() {
  try {
    const response = await fetch(`${API_BASE}/baidu-token`)
    const data = await response.json()
    if (data.token) {
      console.log('获取 Token 成功')
      return data.token
    } else {
      throw new Error(data.error || '获取 Token 失败')
    }
  } catch (error) {
    console.error('获取 Token 失败:', error)
    throw error
  }
}

/**
 * 将图片转换为 Base64
 */
function imageToBase64(img) {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  return canvas.toDataURL('image/jpeg').split(',')[1]
}

/**
 * 从图片识别物体
 */
export async function detectObjects(imageUrl) {
  try {
    const token = await getAccessToken()

    const img = new Image()
    img.crossOrigin = 'anonymous'

    return new Promise((resolve, reject) => {
      img.onload = async () => {
        try {
          console.log('识别中...')

          const imageBase64 = imageToBase64(img)

          const response = await fetch(`${API_BASE}/baidu-detect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: imageBase64,
              token: token
            })
          })

          const data = await response.json()
          console.log('识别结果:', data)

          if (data.results && data.results.length > 0) {
            const objects = data.results.slice(0, 5).map(item => ({
              object: item.keyword,
              objectCn: item.keyword,
              confidence: item.score
            }))
            console.log('最终结果:', objects)
            resolve(objects)
          } else {
            resolve([])
          }
        } catch (error) {
          console.error('识别出错:', error)
          reject(error)
        }
      }

      img.onerror = () => reject(new Error('图片加载失败'))
      img.src = imageUrl
    })
  } catch (error) {
    console.error('detectObjects 错误:', error)
    throw error
  }
}
