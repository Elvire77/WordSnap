// Netlify Function - 百度图像识别 API 代理
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const { image, token } = JSON.parse(event.body)

    if (!image || !token) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: '缺少参数' }) }
    }

    const response = await fetch(
      `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/detection/advanced_general?access_token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image })
      }
    )

    const data = await response.json()
    return { statusCode: 200, headers, body: JSON.stringify(data) }
  } catch (error) {
    console.error('Detect error:', error)
    return { statusCode: 500, headers, body: JSON.stringify({ error: '服务器错误' }) }
  }
}
