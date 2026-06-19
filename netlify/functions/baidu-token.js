// Netlify Function - 获取百度 Access Token
const BAIDU_API_KEY = 'SDtrviOdKf2z6R6ISd2Z5aw0'
const BAIDU_SECRET_KEY = 'RCez7uIWZCnP6tDsgg0FBvrw8kDCKV2Z'

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
    const response = await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`,
      { method: 'POST' }
    )
    const data = await response.json()

    if (data.access_token) {
      return { statusCode: 200, headers, body: JSON.stringify({ token: data.access_token }) }
    } else {
      return { statusCode: 500, headers, body: JSON.stringify({ error: data.error_description || '获取 Token 失败' }) }
    }
  } catch (error) {
    console.error('Token error:', error)
    return { statusCode: 500, headers, body: JSON.stringify({ error: '服务器错误' }) }
  }
}
