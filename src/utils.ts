/**
 * Misc useful stuff.
 * @author mia-pi-git
 */
import * as fs from 'fs';
import * as pathModule from 'path';

const ROOT = pathModule.resolve(__dirname, '../');

export function resolvePath(path: string) {
	return pathModule.join(ROOT, path);
}

export function readJSON(path: string) {
	return new Promise<any>((resolve, reject) => {
		fs.readFile(resolvePath(path), 'utf-8', (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(JSON.parse(data));
			}
		});
	});
}

export function fileExists(path: string) {
	return new Promise<boolean>((resolve) => {
		fs.exists(resolvePath(path), exists => {
			resolve(exists);
		});
	});
}
export function toID(text: any): string {
	return (text && typeof text === "string" ? text : "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}
