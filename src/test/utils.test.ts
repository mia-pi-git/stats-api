/**
 * Never hurts to test the utilities, right?
 * @author mia-pi-git
 */
import * as Utils from '../utils';

describe('Utilities', () => {
	describe('toID', () => {
		test('Non-alphanumeric character removal', () => {
			expect(Utils.toID('(Hello), ^ & * $World!')).toBe('helloworld');
		});
		test('Lowercase conversion', () => {
			expect(Utils.toID('Hello World')).toBe('helloworld');
		});
	});
	test('File path resolving', () => {
		expect(Utils.resolvePath('src/test/utils.test.ts')).toBe(__filename);
	});
	describe('File utilities', () => {
		test('JSON reading', async () => {
			const json = await Utils.readJSON('src/test/stats-fixtures.json');
			expect(json).toBeTruthy();
			expect(json.info).toBeDefined();
			expect(json.data).toBeDefined();
		});
		test('Checking existence', async () => {
			expect(await Utils.fileExists('src/test/stats-fixtures.json')).toBe(true);
			expect(await Utils.fileExists('src/test/stats-fixtures.jsonx')).toBe(false);
		});
		test('Reading nonexistent and non-JSON files', async () => {
			await expect(Utils.readJSON('src/test/nonexistentfile')).rejects.toThrow();
			await expect(Utils.readJSON('src/dispatch.ts')).rejects.toThrow();
		});
	});
});
