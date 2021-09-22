/**
 * Tests for APIContext.
 */
import * as Utils from './test-utils';
import {resolvePath as resolve, toID} from '../utils';
import * as fs from 'fs';

describe('APIContext', () => {
	beforeEach(() => {
		Utils.mkdirIfNotExists('stats');
		Utils.mkdirIfNotExists('stats/2021-08/');
		Utils.mkdirIfNotExists('stats/2021-08/chaos');
		// i am indeed aware the current fixtures are not gen8ou. i don't care.
		const fixtureRequiredPath = resolve('/stats/2021-08/chaos/gen8ou-0.json');
		if (!fs.existsSync(fixtureRequiredPath)) {
			fs.copyFileSync(
				resolve('src/test/stats-fixtures.json'),
				fixtureRequiredPath
			);
		}
	});
	test('APIContext#searchKey', async () => {
		const api = Utils.makeAPI({
			date: '2021-08',
			format: 'gen8ou',
			type: 'ability',
			query: 'adaptability',
		});
		const params = {
			date: '2021-08',
			format: 'gen8ou',
			type: 'ability',
			query: 'flamebody',
			rating: 0,
		};
		let result = await api.searchKey('Abilities', params);
		expect(result.results).toHaveLength(3);
		expect(toID(result.results[0].pokemon)).toEqual('volcarona');

		Object.assign(params, {type: 'item', query: 'choiceband'});
		result = await api.searchKey('Items', params);
		expect(result.results).toHaveLength(12);
		expect(toID(result.results[0].pokemon)).toEqual('barraskewda');

		Object.assign(params, {type: 'move', query: 'flipturn'});
		result = await api.searchKey('Moves', params);
		expect(result.results).toHaveLength(3);
		expect(toID(result.results[0].pokemon)).toEqual('barraskewda');
	});
});
