module.exports = async (req, res) => {
    // 从环境变量获取存储的账号信息
    const storedUsername = process.env.VERCEL_USERNAME || 'admin';
    const storedPassword = process.env.VERCEL_PASSWORD || '123456';

    const { username, password } = req.body;
    
    if (username === storedUsername && password === storedPassword) {
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
};
