// Vercel Serverless Function - 获取百度 Access Token
// 这个函数在服务端运行，避免 CORS 问题

const BAIDU_API_KEY = 'SDtrviOdKf2z6R6ISd2Z5aw0'
const BAIDU_SECRET_KEY = 'RCez7uIWZCnP6tDsgg0FBvrw8kDCKV2Z'

module.exports = async (req, res) => {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const response = await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`,
      { method: 'POST' }
    )
    const data = await response.json()

    if (data.access_token) {
      return res.status(200).json({ token: data.access_token })
    } else {
      return res.status(500).json({ error: data.error_description || '获取 Token 失败' })
    }
  } catch (error) {
    console.error('Token error:', error)
    return res.status(500).json({ error: '服务器错误' })
  }
}
