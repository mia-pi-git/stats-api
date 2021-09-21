/**
 * Tests for the API endpoints.
 */

import * as Utils from './test-utils';
import {resolvePath as resolve} from '../utils';
import * as fs from 'fs';

describe("API Endpoints", () => {
	beforeEach(async () => {
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
	test("Pokemon fetching", async () => {
		const result = await Utils.testQuery({
			type: 'pokemon',
			query: 'xurkitree',
			format: 'gen8ou',
			date: '2021-08',
		});
		expect(result);
		expect(result.error).toBeUndefined();
		for (const key of ['Checks and Counters', 'Moves', 'Abilities']) {
			expect(result[key]).toBeDefined();
		}
	});
    test("Ability fetching", async () => {
        const result = await Utils.testQuery({
            type: 'ability',
            query: 'beastboost',
            format: 'gen8ou',
            date: '2021-08',
        });
        expect(result);
        expect(result.error).toBeUndefined();
        expect(result.results.length).toEqual(4);
        expect(result.results[0].pokemon).toEqual('Xurkitree');
    });
    test("Item fetching", async () => {
        const result = await Utils.testQuery({
            type: 'item',
            query: 'weaknesspolicy',
            format: 'gen8ou',
            date: '2021-08',
        });
        expect(result);
        expect(result.error).toBeUndefined();
        expect(result.results.length).toEqual(8);
        expect(result.results[0].pokemon).toEqual('Mr. Mime-Galar');
    });
});
