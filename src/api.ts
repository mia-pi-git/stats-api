/**
 * This is basically just a lot of helpers in a context made specifically for
 * one api request.
 * @author mia-pi-git
 */

import {Dispatch, SanitizedParams, MiscSearch, PokemonStats} from './dispatch';
import * as Utils from './utils';

export class APIContext {
	static caches = {
		abilities: new Map<string, MiscSearch>(),
		items: new Map<string, MiscSearch>(),
		moves: new Map<string, MiscSearch>(),
		pokemon: new Map<string, PokemonStats | {error: string}>(),
	};
	caches = APIContext.caches;
	dispatch: Dispatch;
	constructor(dispatch: Dispatch) {
		this.dispatch = dispatch;
	}
	async searchKey(keyName: string, params: SanitizedParams, cacheName?: string) {
		const cache = this.caches[(cacheName || Utils.toID(keyName)) as 'items'];
		const {format, query, date, rating} = params;
		const queryId = Utils.toID(query);
		const key = `ability-${queryId}-${format}-${date}-${rating}`;
		let data = cache.get(key);
		if (!data) {
			const stats = await Utils.readJSON(`stats/${date}/chaos/${format}-${rating}.json`);
			const results = [];
			for (const k in stats.data) {
				const pokemon = stats.data[k];
				if (typeof pokemon[keyName]?.[queryId] !== 'undefined') {
					results.push({pokemon: k, usage: pokemon[keyName][queryId]});
				}
			}
			data = {
				results,
				matches: results.length,
			};
			cache.set(key, data);
		}
		return data;
	}
}
