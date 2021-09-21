/**
* Misc stuff to make tests easier.
* @author mia-pi-git
*/

import * as net from 'net';
import * as http from 'http';
import * as fs from 'fs';
import {resolvePath} from '../utils';
import {URLSearchParams} from 'url';
import {Dispatch} from '../dispatch';

export async function testQuery(params: {[k: string]: any}) {
	const search = new URLSearchParams(params);
	const {req, res} = makeRequest();
	req.url = '/?' + search;
	try {
		return await new Dispatch(req, res).execute();
	} catch (e: any) {
		if (e.name?.endsWith('ResponseError')) {
			return {error: e.message};
		}
		throw e;
	}
}

export function makeRequest() {
	const socket = new net.Socket();
	const req = new http.IncomingMessage(socket);
	return {
		req,
		res: new http.ServerResponse(req),
	};
}

export function mkdirIfNotExists(path: string) {
	path = resolvePath(path);
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}
