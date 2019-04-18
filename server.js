import http from 'http';

import app from './app';

import { port } from './config';

const server = http.createServer(app);

server.listen(port, () => console.info(`Application running on port ${port}`));
