const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    if (username === 'admin' && password === 'password') {
        return res.status(200).json({ token: 'mock-jwt-token' });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
