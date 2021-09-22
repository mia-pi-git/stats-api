/**
* Handlers for each API endpoint.
* @author mia-pi-git
*/

import {Endpoint} from './dispatch';
import {toID, readJSON} from './utils';

export const endpoints: {[k: string]: Endpoint} = {
	async pokemon({query, format, date, rating}) {
		const queryId = toID(query);
		const key = `${queryId}-${format}-${date}-${rating}`;
		let data = this.caches.pokemon.get(key);
		if (!data) {
			const stats = await readJSON(`stats/${date}/chaos/${format}-${rating}.json`);
			data = stats.data[queryId.charAt(0).toUpperCase() + queryId.slice(1)];
			if (!data) {
				data = {error: 'No data for that Pokemon was found'};
			}
			this.caches.pokemon.set(key, data);
		}
		return data;
	},
	ability(params) {
		return this.searchKey('Abilities', params);
	},
	item(params) {
		return this.searchKey('Items', params);
	},
	move(params) {
		return this.searchKey('Moves', params);
	},
};
