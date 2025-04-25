import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const { username } = req.body;

  // 检查用户是否存在
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  // 若不存在，自动创建用户
  if (!user) {
    const { data: newUser } = await supabase
      .from('users')
      .insert([{ username }])
      .single();
    return res.status(200).json(newUser);
  }

  res.status(200).json(user);
}