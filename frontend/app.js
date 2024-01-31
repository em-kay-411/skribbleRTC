const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static('./'));

app.get('/', (req, res) => {
    res.sendFile(__dirname, '/index.html');
});

app.listen(PORT, () => {
    console.log('Frontend launched');
})