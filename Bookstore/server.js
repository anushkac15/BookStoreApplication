const express = require('express');
const app = require('./app');
const http = require('http');

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Server also accessible at http://127.0.0.1:${port}`);
});


