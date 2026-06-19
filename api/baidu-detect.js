// Vercel Serverless Function - 百度图像识别 API 代理
// 这个函数在服务端运行，避免 CORS 问题

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { image, token } = req.body

    if (!image || !token) {
      return res.status(400).json({ error: '缺少参数' })
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
    return res.status(200).json(data)
  } catch (error) {
    console.error('Detect error:', error)
    return res.status(500).json({ error: '服务器错误' })
  }
}
