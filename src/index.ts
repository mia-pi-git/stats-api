import * as http from 'http';
import {handle} from './dispatch';

export const server = http.createServer();
server.on('request', (req, res) => void handle(req, res));

const port = parseInt(process.env.PORT || "") || 3000;
server.listen(port, () => {
	console.log(`Stat API server listening on port ${port}`);
});
