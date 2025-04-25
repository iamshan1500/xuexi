import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default async function handler(req, res) {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  // 处理正式请求
  res.setHeader('Access-Control-Allow-Origin', '*')
  
  try {
    const { username } = req.body
    if (!username) return res.status(400).json({ error: '用户名不能为空' })

    // 检查用户是否存在
    const { data: existingUser, error: queryError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    // 用户不存在则创建
    if (!existingUser || queryError?.code === 'PGRST116') {
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ username }])
        .select()
        .single()

      if (insertError) throw insertError
      return res.status(201).json(newUser)
    }

    // 用户已存在
    res.status(200).json(existingUser)
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}
