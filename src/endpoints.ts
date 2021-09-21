/**
* Handlers for each API endpoint.
* @author mia-pi-git
*/

import {Endpoint, caches, PokemonStats, MiscSearch} from './dispatch';
import {toID, readJSON} from './utils';

export const endpoints: {[k: string]: Endpoint} = {
	async pokemon({query, format, date, rating}) {
		const queryId = toID(query);
		const key = `pokemon-${queryId}-${format}-${date}-${rating}`;
		let data = caches.pokemon.get(key);
		if (!data) {
			const stats = await readJSON(`stats/${date}/chaos/${format}-${rating}.json`);
			data = stats.data[queryId.charAt(0).toUpperCase() + queryId.slice(1)];
			if (!data) {
				data = {error: 'No data for that Pokemon was found'};
			}
			caches.pokemon.set(key, data);
		}
		return data as PokemonStats;
	},
	async ability({query, format, date, rating}) {
		const queryId = toID(query);
		const key = `ability-${queryId}-${format}-${date}-${rating}`;
		let data = caches.abilities.get(key);
		if (!data) {
			const stats = await readJSON(`stats/${date}/chaos/${format}-${rating}.json`);
			const results = [];
			for (const k in stats.data) {
				const pokemon = stats.data[k];
				if (typeof pokemon.Abilities[queryId] !== 'undefined') {
					results.push({pokemon: k, usage: pokemon.Abilities[queryId]});
				}
			}
			data = {
				results,
				matches: results.length,
			};
			caches.abilities.set(key, data);
		}
		return data as MiscSearch;
	},
	async item({query, format, date, rating}) {
		const queryId = toID(query);
		const key = `item-${queryId}-${format}-${date}-${rating}`;
		let data = caches.items.get(key);
		if (!data) {
			const stats = await readJSON(`stats/${date}/chaos/${format}-${rating}.json`);
			const results = [];
			for (const k in stats.data) {
				const pokemon = stats.data[k];
				if (typeof pokemon.Items[queryId] !== 'undefined') {
					results.push({pokemon: k, usage: pokemon.Items[queryId]});
				}
			}
			data = {
				results,
				matches: results.length,
			};
			caches.items.set(key, data);
		}
		return data as MiscSearch;
	},
};
