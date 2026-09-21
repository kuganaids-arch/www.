const express = require('express');

const app = express();
const port = process.env.PORT || 10000;

app.get('/', (_req, res) => {
    res.status(200).send('Discord bot is running.');
});

app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'discord-bot',
        uptime: process.uptime()
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`[WEB] Health server listening on port ${port}`);
});

module.exports = app;
