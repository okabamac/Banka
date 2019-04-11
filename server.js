const http = require('http');

const app = require('./app');

const { port } = require('./config');

const server = http.createServer(app);

server.listen(port, () => console.info(`Application running on port ${port}`));
